import Link from "next/link";
import { whatsappLink } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-brand-700">Stella Costa</span>
          <span className="hidden text-sm font-semibold text-brand-500 sm:inline">
            Fonoaudiologia Infantil
          </span>
        </Link>
        <a
          href={whatsappLink("header")}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-700"
        >
          Agendar avaliação
        </a>
      </div>
    </header>
  );
}
