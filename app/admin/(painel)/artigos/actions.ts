"use server";

import { revalidatePath } from "next/cache";
import type { ArtigoEditavel } from "@/lib/admin/tipos";
import { createClient } from "@/lib/supabase/server";

type Resultado = { ok: true; id: string } | { ok: false; erro: string };

// O que o site público precisa regerar quando um artigo muda de estado
function revalidarBlog(slug: string) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
}

/** Cria/atualiza sem mudar status. RLS (`is_stella`) é quem autoriza de fato. */
export async function salvarArtigo(artigo: ArtigoEditavel): Promise<Resultado> {
  const supabase = await createClient();

  if (!artigo.title.trim()) return { ok: false, erro: "Dê um título ao artigo antes de salvar." };
  const slug = artigo.slug.trim();
  if (!slug) return { ok: false, erro: "O artigo precisa de um slug (gerado pelo título)." };

  // Colisão de slug (spec US-12 AC2) — a constraint unique é o guarda final
  const { data: conflito } = await supabase
    .from("articles")
    .select("id")
    .eq("slug", slug)
    .neq("id", artigo.id ?? "00000000-0000-0000-0000-000000000000")
    .maybeSingle();
  if (conflito) return { ok: false, erro: `Já existe um artigo com o slug "${slug}". Edite o slug.` };

  const linha = {
    title: artigo.title.trim(),
    slug,
    excerpt: artigo.excerpt.trim() || null,
    content: artigo.content || null,
    cover_url: artigo.cover_url,
    meta_title: artigo.meta_title.trim() || null,
    meta_description: artigo.meta_description.trim() || null,
    updated_at: new Date().toISOString(),
  };

  const consulta = artigo.id
    ? supabase.from("articles").update(linha).eq("id", artigo.id).select("id, status").single()
    : supabase.from("articles").insert(linha).select("id, status").single();

  const { data, error } = await consulta;
  if (error) {
    if (error.code === "23505") return { ok: false, erro: `O slug "${slug}" já está em uso.` };
    return { ok: false, erro: `Não foi possível salvar: ${error.message}` };
  }

  // Artigo já publicado editado: reflete a edição no site
  if (data.status === "published") revalidarBlog(slug);
  return { ok: true, id: data.id };
}

export async function publicarArtigo(id: string): Promise<Resultado> {
  const supabase = await createClient();

  const { data: artigo } = await supabase
    .from("articles")
    .select("title, slug, published_at")
    .eq("id", id)
    .maybeSingle();
  if (!artigo) return { ok: false, erro: "Artigo não encontrado." };
  if (!artigo.title?.trim() || !artigo.slug?.trim())
    return { ok: false, erro: "Título e slug são obrigatórios para publicar." };

  const { error } = await supabase
    .from("articles")
    .update({
      status: "published",
      // preserva a data da primeira publicação em republicações
      published_at: artigo.published_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { ok: false, erro: `Não foi possível publicar: ${error.message}` };

  revalidarBlog(artigo.slug);
  return { ok: true, id };
}

export async function despublicarArtigo(id: string): Promise<Resultado> {
  const supabase = await createClient();

  const { data: artigo } = await supabase.from("articles").select("slug").eq("id", id).maybeSingle();
  if (!artigo) return { ok: false, erro: "Artigo não encontrado." };

  const { error } = await supabase
    .from("articles")
    .update({ status: "draft", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, erro: `Não foi possível despublicar: ${error.message}` };

  revalidarBlog(artigo.slug);
  return { ok: true, id };
}

export async function excluirArtigo(id: string): Promise<Resultado> {
  const supabase = await createClient();

  const { data: artigo } = await supabase.from("articles").select("slug").eq("id", id).maybeSingle();
  if (!artigo) return { ok: false, erro: "Artigo não encontrado." };

  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) return { ok: false, erro: `Não foi possível excluir: ${error.message}` };

  revalidarBlog(artigo.slug);
  return { ok: true, id };
}
