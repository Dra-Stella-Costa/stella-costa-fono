import type { Metadata } from "next";
import CalcomEmbed from "@/components/CalcomEmbed";
import OndaDeVoz from "@/components/OndaDeVoz";
import { mostrarRascunho } from "@/lib/landing-content";
import { FORMATO, INDICACOES, LIMITACOES } from "@/lib/teleconsulta-content";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Teleconsulta de Fonoaudiologia Infantil",
  description:
    "Teleconsulta de fonoaudiologia infantil para famílias de todo o Brasil: entenda o formato, as indicações e as limitações antes de agendar.",
  alternates: { canonical: "/teleconsulta" },
  openGraph: {
    title: "Teleconsulta de Fonoaudiologia Infantil",
    description: "Entenda o formato, as indicações e as limitações antes de agendar.",
    url: "/teleconsulta",
  },
};

const BLOCOS = [
  { id: "formato", titulo: "Como funciona", itens: FORMATO },
  { id: "indicacoes", titulo: "Para quais situações é indicada", itens: INDICACOES },
  { id: "limitacoes", titulo: "Limitações: o que a teleconsulta não resolve", itens: LIMITACOES },
];

export default function Teleconsulta() {
  // AD-007: a página é pública (o agendamento funciona), mas as listas clínicas
  // — formato, indicações, limitações — só aparecem depois da revisão da Stella (D4).
  // Nenhuma afirmação clínica não revisada chega ao visitante.
  const conteudoClinico = mostrarRascunho();

  return (
    <>
      <section className="bg-areia/50">
        <div className="mx-auto max-w-3xl space-y-5 px-4 py-14">
          <p className="text-eyebrow font-bold uppercase tracking-[0.14em] text-coral-500">
            Teleconsulta em todo o Brasil
          </p>
          <h1 className="font-display text-display font-extrabold text-petroleo-600">
            Fonoaudiologia infantil <span className="text-coral-500">onde você estiver</span>
          </h1>
          <p className="medida-leitura text-corpo text-grafite">
            {conteudoClinico
              ? "Antes de agendar, entenda como funciona, para quais situações a teleconsulta é indicada e, principalmente, o que ela não resolve a distância."
              : "O atendimento acontece por videochamada, com horário escolhido por você. Escolha abaixo o melhor dia — a confirmação chega por e-mail com o link da chamada."}
          </p>
          <a
            href="#agendar"
            className="inline-block rounded-full bg-coral-500 px-6 py-3 font-display font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-coral-600 focus-visible:outline-4 focus-visible:outline-petroleo-300"
          >
            Ver horários disponíveis
          </a>
          <OndaDeVoz className="h-7 w-14" cor="sol" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-10 px-4 py-14">
        {/* TODO (D4): conteúdo clínico aguarda revisão da Stella; oculto até lá */}
        {conteudoClinico &&
          BLOCOS.map((bloco) => (
            <div key={bloco.id} id={bloco.id} className="space-y-3">
              <h2 className="font-display text-h2 font-bold text-petroleo-600">{bloco.titulo}</h2>
              <ul className="medida-leitura space-y-2 text-corpo text-grafite">
                {bloco.itens.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sol-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        {/* TODO (D4): duração e valor — a Stella define. Nenhum valor inventado aqui. */}
        <p className="medida-leitura text-apoio text-grafite">
          Para saber duração, valor e se o seu caso é atendível a distância,{" "}
          <a
            href={whatsappLink("teleconsulta-duvidas")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-petroleo-600 underline underline-offset-2 hover:text-petroleo-700"
          >
            me chame no WhatsApp
          </a>
          .
        </p>
      </section>

      <section id="agendar" className="bg-areia/50">
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-14">
          <h2 className="font-display text-h2 font-bold text-petroleo-600">
            Escolha o seu <span className="text-coral-500">horário</span>
          </h2>
          <CalcomEmbed />
          <p className="text-apoio text-grafite">
            O agendamento é processado pela plataforma Cal.com, que trata os dados informados
            (nome e e-mail do responsável) conforme a política de privacidade dela. A confirmação,
            com o link da videochamada, chega por e-mail.
          </p>
        </div>
      </section>
    </>
  );
}
