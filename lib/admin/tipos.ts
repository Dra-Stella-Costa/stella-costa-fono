/** Artigo como o formulário do painel enxerga (strings vazias em vez de null). */
export interface ArtigoEditavel {
  id: string | null; // null = ainda não salvo
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  meta_title: string;
  meta_description: string;
  status: "draft" | "published";
}

export interface Depoimento {
  id: string;
  author_name: string;
  city: string | null;
  quote: string;
  sort_order: number;
  published: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
}

/** Slug a partir do título: minúsculas, sem acento, hífens. */
export function gerarSlug(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}
