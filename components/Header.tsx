import Link from "next/link";
import Pipa from "@/components/Pipa";
import { whatsappLink } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-areia bg-creme/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Pipa className="h-9 w-7" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-extrabold text-petroleo-600">
              Stella Costa
            </span>
            <span className="block text-eyebrow font-bold uppercase tracking-[0.14em] text-coral-500">
              Fonoaudiologia Infantil
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="font-display text-sm font-bold text-petroleo-600 transition-colors hover:text-petroleo-700 focus-visible:outline-4 focus-visible:outline-petroleo-300"
          >
            Blog
          </Link>
          {/* Secundário (contorno Petróleo): o primário Coral é único por tela e vive no hero */}
          <a
            href={whatsappLink("header")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-petroleo-600 px-5 py-2 font-display text-sm font-bold text-petroleo-600 transition-all hover:-translate-y-0.5 hover:border-petroleo-700 hover:text-petroleo-700 focus-visible:outline-4 focus-visible:outline-petroleo-300"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
