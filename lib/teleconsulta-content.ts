/**
 * Conteúdo da página de teleconsulta.
 *
 * ⚠ RASCUNHO NÃO VALIDADO (D4). É conteúdo CLÍNICO: só a Stella (CRFa) pode definir
 * o que é atendível a distância, o que não é, duração e valor.
 *
 * Decisão 2026-07-09 (AD-007): a página é publicada com o agendamento funcionando,
 * mas as três listas abaixo só renderizam quando `mostrarRascunho()` é verdadeiro.
 * Em produção, nenhuma afirmação clínica não revisada é exibida — o visitante é
 * convidado a perguntar no WhatsApp. Isso honra a spec US-07 AC2 (placeholder não
 * vai a produção) sem travar a conversão, agora que o Cal.com está configurado.
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
