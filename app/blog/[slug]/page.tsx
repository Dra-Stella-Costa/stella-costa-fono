import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import CompartilharArtigo from "@/components/blog/CompartilharArtigo";
import SchemaArticle from "@/components/blog/SchemaArticle";
import { formatarData, getArticleBySlug, getPublishedArticles } from "@/lib/blog";
import { sanitizarConteudo } from "@/lib/sanitize";
import { SITE_URL, whatsappLink } from "@/lib/site";

export const revalidate = 60;
// Sem isto, artigo publicado depois do deploy daria 404 até o próximo build —
// quebraria exatamente o fluxo "publiquei, vou compartilhar no Instagram agora".
export const dynamicParams = true;

const CAPA_PADRAO = `${SITE_URL}/imagens/stella-institucional.jpg`;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const artigos = await getPublishedArticles();
  return artigos.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artigo = await getArticleBySlug(slug);
  if (!artigo) return {};

  const title = artigo.meta_title || artigo.title;
  const description = artigo.meta_description || artigo.excerpt || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${artigo.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${artigo.slug}`,
      images: [{ url: artigo.cover_url || CAPA_PADRAO }],
      publishedTime: artigo.published_at ?? undefined,
      modifiedTime: artigo.updated_at,
    },
  };
}

export default async function ArtigoPage({ params }: Props) {
  const { slug } = await params;
  const artigo = await getArticleBySlug(slug);
  // Inexistente ou rascunho (RLS esconde do anon) → 404 (spec US-06 AC4)
  if (!artigo) notFound();

  const html = sanitizarConteudo(artigo.content ?? "");
  const url = `${SITE_URL}/blog/${artigo.slug}`;
  const data = formatarData(artigo.published_at);

  return (
    <article className="mx-auto max-w-2xl space-y-8 px-4 py-14">
      <SchemaArticle artigo={artigo} url={url} />

      <header className="space-y-3">
        {data && (
          <p className="text-eyebrow font-bold uppercase tracking-[0.14em] text-coral-500">
            Blog · {data}
          </p>
        )}
        <h1 className="font-display text-display font-extrabold text-petroleo-600">
          {artigo.title}
        </h1>
        {artigo.excerpt && <p className="text-corpo text-grafite">{artigo.excerpt}</p>}
      </header>

      {artigo.cover_url && (
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-areia">
          <Image
            src={artigo.cover_url}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 42rem, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-headings:font-display prose-headings:text-petroleo-600 prose-a:text-coral-600 prose-blockquote:border-coral-300 prose-strong:text-grafite prose-img:rounded-2xl text-grafite"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <footer className="space-y-6 border-t border-areia pt-8">
        <CompartilharArtigo url={url} titulo={artigo.title} />

        {/* CTA de conversão: origem blog:[slug] alimenta o KPI primário (US-13) */}
        <div className="space-y-3 rounded-2xl bg-areia/50 p-6">
          <p className="font-display text-h3 font-bold text-petroleo-600">
            Ficou com alguma dúvida sobre o seu filho?
          </p>
          <p className="medida-leitura text-corpo text-grafite">
            Cada criança tem o próprio ritmo — e uma conversa rápida pode tranquilizar ou indicar o
            melhor caminho.
          </p>
          <a
            href={whatsappLink(`blog:${artigo.slug}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-coral-500 px-6 py-3 font-display font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-coral-600 focus-visible:outline-4 focus-visible:outline-petroleo-300"
          >
            Conversar no WhatsApp
          </a>
        </div>
      </footer>
    </article>
  );
}
