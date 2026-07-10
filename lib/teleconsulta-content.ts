/**
 * Conteúdo da página de teleconsulta.
 *
 * ⚠ RASCUNHO NÃO VALIDADO (D4). É conteúdo CLÍNICO: só a Stella (CRFa) pode definir
 * o que é atendível a distância, o que não é, duração e valor.
 *
 * A spec (US-07, AC2) é explícita: com placeholder, a página NÃO vai a produção.
 * Por isso `app/teleconsulta/page.tsx` responde 404 em produção enquanto
 * `CONTEUDO_VALIDADO` for `false` — ver `mostrarRascunho()`.
 */

export const FORMATO: string[] = [
  "Atendimento por videochamada, com a criança e um responsável presente",
  "Sessões individuais, com orientação prática para continuar em casa",
  "Materiais e atividades enviados após cada encontro",
];

/** TODO (D4): a Stella define o que é atendível a distância. */
export const INDICACOES: string[] = [
  "Dúvidas sobre marcos de desenvolvimento da fala e da linguagem",
  "Orientação familiar sobre como estimular a comunicação na rotina",
  "Acompanhamento de crianças já avaliadas presencialmente",
];

/** TODO (D4): limitações clínicas honestas — o que a teleconsulta NÃO resolve. */
export const LIMITACOES: string[] = [
  "Algumas avaliações exigem observação presencial e não podem ser feitas a distância",
  "Casos que dependem de exame físico da musculatura orofacial precisam de consulta presencial",
  "A teleconsulta não substitui encaminhamentos a outros profissionais quando necessários",
];

/** Trechos usados pelo verificador para detectar rascunho servido (CHK-043). */
export const MARCADORES_TELECONSULTA = [
  "Materiais e atividades enviados após cada encontro",
  "Casos que dependem de exame físico da musculatura orofacial",
];
