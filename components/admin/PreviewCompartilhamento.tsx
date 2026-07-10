import { SITE_URL } from "@/lib/site";

type Props = {
  titulo: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  coverUrl: string | null;
  slug: string;
};

/**
 * Card estilo WhatsApp/Google (US-12 AC3) usando os MESMOS fallbacks do
 * generateMetadata do blog: meta_title ∥ title e meta_description ∥ excerpt.
 */
export default function PreviewCompartilhamento({
  titulo,
  metaTitle,
  metaDescription,
  excerpt,
  coverUrl,
  slug,
}: Props) {
  const tituloFinal = metaTitle.trim() || titulo.trim() || "Sem título";
  const descricaoFinal = metaDescription.trim() || excerpt.trim() || "Sem descrição";
  const capa = coverUrl || "/imagens/stella-institucional.jpg";

  return (
    <div className="space-y-1">
      <p className="text-apoio font-semibold text-petroleo-600">
        Assim o link aparece no WhatsApp e no Google:
      </p>
      <div className="max-w-sm overflow-hidden rounded-xl border border-areia bg-white">
        {/* img simples de propósito: preview interno do painel, sem otimização */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={capa} alt="" className="aspect-[1.91/1] w-full object-cover" />
        <div className="space-y-1 p-3">
          <p className="line-clamp-2 font-semibold text-grafite">{tituloFinal}</p>
          <p className="line-clamp-2 text-apoio text-grafite/80">{descricaoFinal}</p>
          <p className="truncate text-apoio text-petroleo-500">
            {SITE_URL.replace("https://", "")}/blog/{slug || "slug-do-artigo"}
          </p>
        </div>
      </div>
    </div>
  );
}
