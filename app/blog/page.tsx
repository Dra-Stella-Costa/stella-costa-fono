import type { Metadata } from "next";
import ArticleCard from "@/components/blog/ArticleCard";
import OndaDeVoz from "@/components/OndaDeVoz";
import { getPublishedArticles } from "@/lib/blog";
import { whatsappLink } from "@/lib/site";

// ≤60s entre publicar no painel e aparecer aqui (spec US "Revalidação ao publicar")
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Fala e linguagem infantil",
  description:
    "Artigos sobre desenvolvimento da fala e da linguagem infantil, escritos pela fonoaudióloga Stella Costa para orientar pais e responsáveis.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Fala e linguagem infantil",
    description:
      "Artigos sobre desenvolvimento da fala e da linguagem infantil para orientar pais e responsáveis.",
    url: "/blog",
  },
};

export default async function BlogPage() {
  const artigos = await getPublishedArticles();

  return (
    <section className="mx-auto max-w-5xl space-y-8 px-4 py-14">
      <div className="space-y-3">
        <OndaDeVoz className="h-6 w-12" cor="coral" />
        <h1 className="font-display text-h2 font-bold text-petroleo-600">
          Blog: fala e linguagem <span className="text-coral-500">na infância</span>
        </h1>
        <p className="medida-leitura text-corpo text-grafite">
          Conteúdo para pais e responsáveis sobre o desenvolvimento da comunicação infantil.
        </p>
      </div>

      {artigos.length === 0 ? (
        // Spec US "Listagem" AC2: estado vazio amigável, nunca erro
        <div className="space-y-4 rounded-2xl border border-areia bg-areia/50 p-8">
          <p className="font-display text-h3 font-bold text-petroleo-600">
            Os primeiros artigos estão a caminho!
          </p>
          <p className="medida-leitura text-corpo text-grafite">
            Enquanto isso, se você tem alguma dúvida sobre a fala ou a linguagem do seu filho, é só
            chamar no WhatsApp.
          </p>
          <a
            href={whatsappLink("blog:vazio")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-coral-500 px-6 py-3 font-display font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-coral-600 focus-visible:outline-4 focus-visible:outline-petroleo-300"
          >
            Falar com a fonoaudióloga
          </a>
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-3">
          {artigos.map((artigo) => (
            <ArticleCard key={artigo.slug} artigo={artigo} />
          ))}
        </ul>
      )}
    </section>
  );
}
