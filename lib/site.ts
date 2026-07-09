export const SITE_NAME = "Stella Costa — Fonoaudiologia Infantil";

// D1 pendente: trocar pelo domínio definitivo quando registrado
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://stella-costa-fono.vercel.app";

// TODO: substituir pelo número real da Stella (formato internacional, só dígitos)
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5567999999999";

// TODO (D3): preencher com o registro real da Stella antes do lançamento
export const CRFA_NUMBER: string | null = null;

export const CITY = "São Gabriel do Oeste/MS";

/**
 * Gera o link do WhatsApp com mensagem pré-preenchida e identificador de
 * origem — a origem alimenta o KPI primário (US-13), mantenha-a única por
 * seção (hero, header, sinais, faq, blog, flutuante...).
 */
export function whatsappLink(origem: string): string {
  const text = `Olá! Vim pelo site (${origem}) e gostaria de mais informações sobre atendimento fonoaudiológico infantil.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
