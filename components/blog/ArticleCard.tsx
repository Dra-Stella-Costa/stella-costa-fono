import Image from "next/image";
import Link from "next/link";
import { formatarData, type ArticleResumo } from "@/lib/blog";

const CAPA_PADRAO = "/imagens/stella-institucional.jpg";

export default function ArticleCard({ artigo }: { artigo: ArticleResumo }) {
  const data = formatarData(artigo.published_at);

  return (
    <li className="overflow-hidden rounded-2xl border border-areia bg-creme transition-all hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/blog/${artigo.slug}`} className="block focus-visible:outline-4 focus-visible:outline-petroleo-300">
        <div className="relative aspect-video bg-areia">
          <Image
            src={artigo.cover_url || CAPA_PADRAO}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-2 p-5">
          {data && <p className="text-eyebrow font-bold uppercase tracking-[0.14em] text-coral-500">{data}</p>}
          <h3 className="font-display text-h3 font-bold text-petroleo-600">{artigo.title}</h3>
          {artigo.excerpt && <p className="text-apoio text-grafite">{artigo.excerpt}</p>}
        </div>
      </Link>
    </li>
  );
}
