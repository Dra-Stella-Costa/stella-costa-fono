export const SITE_NAME = "Stella Costa — Fonoaudiologia Infantil";

// D1 pendente: trocar pelo domínio definitivo quando registrado
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://stella-costa-fono.vercel.app";

// (67) 99311-2092 — confirmado por Leonardo em 2026-07-09.
// `||` e não `??`: variável definida como string vazia deve cair no padrão,
// senão os links viram `wa.me/?text=...` e toda a conversão quebra em silêncio.
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5567993112092";

// TODO (D3): preencher com o registro real da Stella antes do lançamento
export const CRFA_NUMBER: string | null = null;

export const CITY = "São Gabriel do Oeste/MS";

/** Nome curto da profissional (schema / seções) */
export const PROFESSIONAL_NAME = "Stella Costa";

/**
 * TODO (D3): endereço completo do consultório.
 * Enquanto pendente, usamos a cidade para SEO local e mapa.
 */
export const ADDRESS = {
  streetAddress: "", // preencher quando disponível
  addressLocality: "São Gabriel do Oeste",
  addressRegion: "MS",
  addressCountry: "BR",
  postalCode: "",
};

/** Telefone E.164 sem + (mesmo do WhatsApp) — schema LocalBusiness */
export function telephoneE164(): string {
  return `+${WHATSAPP_NUMBER.replace(/\D/g, "")}`;
}

/** Rótulo legível do CRFa (não inventa número se null) */
export function crfaLabel(): string {
  return CRFA_NUMBER ? `CRFa ${CRFA_NUMBER}` : "CRFa —";
}

/**
 * Gera o link do WhatsApp com mensagem pré-preenchida e identificador de
 * origem — a origem alimenta o KPI primário (US-13), mantenha-a única por
 * seção (hero, header, sinais, faq, blog, flutuante...).
 */
export function whatsappLink(origem: string): string {
  const text = `Olá! Vim pelo site (${origem}) e gostaria de mais informações sobre atendimento fonoaudiológico infantil.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
