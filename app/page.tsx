import type { Metadata } from "next";
import Link from "next/link";
import OndaDeVoz from "@/components/OndaDeVoz";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fonoaudióloga Infantil em São Gabriel do Oeste",
  description:
    "Avaliação e terapia de fala e linguagem para crianças em São Gabriel do Oeste/MS e por teleconsulta em todo o Brasil. Graduada pela USP, pós em Distúrbios de Fala e Linguagem.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Fonoaudióloga Infantil em São Gabriel do Oeste",
    description:
      "Avaliação e terapia de fala e linguagem para crianças, presencial e por teleconsulta.",
    url: "/",
  },
};

export default function Home() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-eyebrow font-bold uppercase tracking-[0.14em] text-coral-500">
            São Gabriel do Oeste · MS e teleconsulta em todo o Brasil
          </p>

          <h1 className="font-display text-display font-extrabold text-petroleo-600">
            Toda criança tem uma voz.{" "}
            <span className="text-coral-500">Vamos soltar a sua?</span>
          </h1>

          {/* TODO (D3): texto final revisado com a Stella */}
          <p className="medida-leitura text-corpo text-grafite">
            Avaliação e terapia de fala e linguagem com quem entende de infância. Graduada pela USP,
            pós em Distúrbios de Fala e Linguagem.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Primário (Coral) — único por tela */}
            <a
              href={whatsappLink("hero")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-coral-500 px-6 py-3 font-display font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-coral-600 focus-visible:outline-4 focus-visible:outline-petroleo-300"
            >
              Falar no WhatsApp
            </a>
            {/* Secundário (contorno Petróleo) */}
            <Link
              href="/teleconsulta"
              className="rounded-full border-2 border-petroleo-600 px-6 py-3 font-display font-bold text-petroleo-600 transition-all hover:-translate-y-0.5 hover:border-petroleo-700 hover:text-petroleo-700 focus-visible:outline-4 focus-visible:outline-petroleo-300"
            >
              Agendar teleconsulta
            </Link>
          </div>

          <OndaDeVoz className="h-8 w-16" cor="sol" />
        </div>

        {/*
          TODO (D3): foto institucional da Stella (moldura "arco de pipa", manual §04).
          Placeholder sem <img> até a imagem definitiva ser aprovada.
        */}
        <div
          aria-hidden="true"
          className="aspect-4/5 w-full rounded-b-3xl rounded-t-full border-2 border-dashed border-sol-500 bg-areia"
        />
      </div>
    </section>
  );
}
