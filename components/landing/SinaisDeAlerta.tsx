import { FAIXAS_ETARIAS } from "@/lib/landing-content";
import { whatsappLink } from "@/lib/site";

export default function SinaisDeAlerta() {
  return (
    <section id="sinais">
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-16">
        <div className="space-y-3">
          <h2 className="font-display text-h2 font-bold text-petroleo-600">
            Sinais de alerta <span className="text-coral-500">por idade</span>
          </h2>
          {/* TODO (D3): conteúdo clínico pendente de revisão da Stella */}
          <p className="medida-leitura text-corpo text-grafite">
            Cada criança tem o seu próprio ritmo, e tudo bem. Mas alguns sinais merecem atenção —
            uma avaliação traz clareza e tranquilidade, não rótulos.
          </p>
        </div>

        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FAIXAS_ETARIAS.map((faixa) => (
            <li key={faixa.id} className="rounded-2xl border border-areia bg-creme p-5">
              <p className="text-eyebrow font-bold uppercase tracking-[0.14em] text-coral-500">
                {faixa.faixa}
              </p>
              <h3 className="mt-1 font-display text-h3 font-bold text-petroleo-600">
                {faixa.titulo}
              </h3>
              <ul className="mt-3 space-y-2 text-apoio text-grafite">
                {faixa.sinais.map((sinal) => (
                  <li key={sinal} className="flex gap-2">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sol-500" />
                    <span>{sinal}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        {/* Secundário: o primário Coral é único por tela e vive no hero (manual §06) */}
        <a
          href={whatsappLink("sinais")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full border-2 border-petroleo-600 px-6 py-3 font-display font-bold text-petroleo-600 transition-all hover:-translate-y-0.5 hover:border-petroleo-700 hover:text-petroleo-700 focus-visible:outline-4 focus-visible:outline-petroleo-300"
        >
          Identificou algum sinal? Fale comigo
        </a>
      </div>
    </section>
  );
}
