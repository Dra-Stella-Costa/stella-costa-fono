import { supabase } from "@/lib/supabase";

/** Espelho de `public.articles` — somente os campos servidos ao site público. */
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null; // HTML do editor do painel; sanitizar antes de renderizar
  cover_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  updated_at: string;
}

export type ArticleResumo = Pick<
  Article,
  "slug" | "title" | "excerpt" | "cover_url" | "published_at" | "updated_at"
>;

const CAMPOS_RESUMO = "slug, title, excerpt, cover_url, published_at, updated_at";
const CAMPOS_ARTIGO =
  "id, title, slug, excerpt, content, cover_url, meta_title, meta_description, published_at, updated_at";

/** Publicados, do mais recente ao mais antigo. Erro derruba a revalidação (ISR mantém o cache). */
export async function getPublishedArticles(): Promise<ArticleResumo[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(CAMPOS_RESUMO)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw new Error(`Supabase (listagem do blog): ${error.message}`);
  return (data ?? []) as ArticleResumo[];
}

/**
 * `null` para slug inexistente OU rascunho: o RLS já esconde não-publicados do
 * anon, e o `eq status` explícito documenta a intenção (US-06 AC4 → 404).
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select(CAMPOS_ARTIGO)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(`Supabase (artigo ${slug}): ${error.message}`);
  return data as Article | null;
}

/** Data por extenso em pt-BR (cards e página do artigo). */
export function formatarData(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Campo_Grande",
  });
}
