import { whatsappLink } from "@/lib/site";

/**
 * Único ponto de contato com o Cal.com em todo o projeto (mitigação R3 do PRD):
 * trocar de fornecedor de agendamento não deve tocar em mais nenhum arquivo.
 * Nenhum outro componente pode referenciar `cal.com` diretamente.
 *
 * D5 pendente: validar se o free tier cobre a configuração da Stella (1 tipo de evento).
 */
// `||` e não `??`: variável vazia cai no padrão (ver comentário em lib/site.ts).
const CALCOM_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK || "stella-viwuxq/teleconsulta";

/**
 * Aceita tanto `usuario/evento` quanto a URL completa colada do painel do Cal.com.
 * Sem isso, uma URL completa gerava `https://cal.com/https://cal.com/...` (404).
 */
function calcomUrl(link: string): string {
  const slug = link.trim().replace(/^https?:\/\/(?:www\.)?cal\.com\//i, "").replace(/^\/+|\/+$/g, "");
  return `https://cal.com/${slug}`;
}

const CALCOM_URL = calcomUrl(CALCOM_LINK);

export default function CalcomEmbed() {
  return (
    <div className="space-y-4">
      <iframe
        title="Agenda de teleconsulta"
        src={CALCOM_URL}
        loading="lazy"
        className="h-[42rem] w-full rounded-2xl border border-areia bg-creme"
      />

      {/* Fallback (spec US-08 AC4): se o embed não carregar, o agendamento não morre. */}
      <p className="text-apoio text-grafite">
        Não consegue ver a agenda?{" "}
        <a
          href={CALCOM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-petroleo-600 underline underline-offset-2 hover:text-petroleo-700"
        >
          Abra a página de agendamento
        </a>{" "}
        ou{" "}
        <a
          href={whatsappLink("teleconsulta")}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-petroleo-600 underline underline-offset-2 hover:text-petroleo-700"
        >
          fale comigo no WhatsApp
        </a>
        .
      </p>
    </div>
  );
}
