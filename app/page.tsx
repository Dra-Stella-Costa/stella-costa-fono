import type { Metadata } from "next";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fonoaudióloga Infantil em São Gabriel do Oeste",
  description:
    "Avaliação e acompanhamento fonoaudiológico de crianças em São Gabriel do Oeste/MS e por teleconsulta. Fala, linguagem e comunicação na infância.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Fonoaudióloga Infantil em São Gabriel do Oeste",
    description:
      "Avaliação e acompanhamento fonoaudiológico de crianças em São Gabriel do Oeste/MS e por teleconsulta.",
    url: "/",
  },
};

export default function Home() {
  return (
    <section className="bg-gradient-to-b from-brand-50 to-white">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 py-16 sm:py-24">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-brand-800 sm:text-5xl">
          Fonoaudióloga Infantil em São Gabriel do Oeste
        </h1>
        {/* TODO (D3): texto de apoio definitivo com a Stella */}
        <p className="max-w-xl text-lg text-brand-700">
          Acompanhamento do desenvolvimento da fala e da linguagem do seu filho, com acolhimento
          para a família — presencial e por teleconsulta.
        </p>
        <a
          href={whatsappLink("hero")}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-whatsapp px-6 py-3 text-base font-bold text-white shadow-md transition-colors hover:bg-whatsapp-dark"
        >
          Conversar no WhatsApp
        </a>
      </div>
    </section>
  );
}
