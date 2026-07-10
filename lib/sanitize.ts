import sanitizeHtml from "sanitize-html";

// Defesa em profundidade: só a Stella escreve (RLS), mas o repo e a anon key são
// públicos — se a política regredir, HTML injetado não pode virar XSS.
// Usado no render do blog e no preview do painel — manter um único allowlist.
export const SANITIZE_OPTS: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "figure", "figcaption"],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height"],
  },
  allowedSchemes: ["https", "http", "mailto"],
};

export function sanitizarConteudo(html: string): string {
  return sanitizeHtml(html, SANITIZE_OPTS);
}
