import type { Article } from "@/lib/blog";
import { PROFESSIONAL_NAME, SITE_NAME, SITE_URL } from "@/lib/site";

/** JSON-LD Article por post (RF-06), mesmo padrão do SchemaLocalBusiness. */
export default function SchemaArticle({ artigo, url }: { artigo: Article; url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: artigo.title,
    description: artigo.meta_description || artigo.excerpt || undefined,
    image: artigo.cover_url || `${SITE_URL}/imagens/stella-institucional.jpg`,
    datePublished: artigo.published_at || undefined,
    dateModified: artigo.updated_at,
    inLanguage: "pt-BR",
    author: { "@type": "Person", name: PROFESSIONAL_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
