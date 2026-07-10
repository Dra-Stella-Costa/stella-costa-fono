"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Resultado = { ok: true } | { ok: false; erro: string };

export async function salvarDepoimento(dados: {
  id: string | null;
  author_name: string;
  city: string;
  quote: string;
  published: boolean;
}): Promise<Resultado> {
  if (!dados.author_name.trim() || !dados.quote.trim())
    return { ok: false, erro: "Nome (abreviado) e texto do depoimento são obrigatórios." };

  const supabase = await createClient();
  const linha = {
    author_name: dados.author_name.trim(),
    city: dados.city.trim() || null,
    quote: dados.quote.trim(),
    published: dados.published,
  };
  const { error } = dados.id
    ? await supabase.from("testimonials").update(linha).eq("id", dados.id)
    : await supabase.from("testimonials").insert(linha);
  if (error) return { ok: false, erro: `Não foi possível salvar: ${error.message}` };

  revalidatePath("/");
  return { ok: true };
}

export async function excluirDepoimento(id: string): Promise<Resultado> {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { ok: false, erro: `Não foi possível excluir: ${error.message}` };
  revalidatePath("/");
  return { ok: true };
}
