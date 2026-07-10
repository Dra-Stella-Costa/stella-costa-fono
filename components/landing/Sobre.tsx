import OndaDeVoz from "@/components/OndaDeVoz";
import { crfaLabel, PROFESSIONAL_NAME } from "@/lib/site";

export default function Sobre() {
  return (
    <section id="sobre" className="bg-areia/50">
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-16">
        <OndaDeVoz className="h-6 w-12" cor="coral" />

        <h2 className="font-display text-h2 font-bold text-petroleo-600">
          Sobre a <span className="text-coral-500">{PROFESSIONAL_NAME}</span>
        </h2>

        {/* TODO (D3): tom e texto final revisados com a Stella */}
        <div className="medida-leitura space-y-4 text-corpo text-grafite">
          <p>
            Sou fonoaudióloga infantil e atendo crianças em São Gabriel do Oeste e, por
            teleconsulta, em todo o Brasil. Graduei-me em Fonoaudiologia pela USP de Ribeirão
            Preto e me especializei em Distúrbios de Fala e Linguagem.
          </p>
          <p>
            Meu trabalho começa escutando a família. Cada criança tem o seu ritmo, e uma avaliação
            serve para trazer clareza sobre esse ritmo — não para colar rótulos. A partir daí,
            construímos junto um caminho que faça sentido dentro da rotina de vocês.
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-3">
          {[
            { termo: "Graduação", desc: "Fonoaudiologia — USP Ribeirão Preto" },
            { termo: "Pós-graduação", desc: "Distúrbios de Fala e Linguagem" },
            { termo: "Registro profissional", desc: crfaLabel() },
          ].map(({ termo, desc }) => (
            <div key={termo} className="rounded-2xl border border-areia bg-creme p-4">
              <dt className="text-eyebrow font-bold uppercase tracking-[0.14em] text-coral-500">
                {termo}
              </dt>
              <dd className="mt-1 font-semibold text-petroleo-600">{desc}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
