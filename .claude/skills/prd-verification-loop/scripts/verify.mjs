#!/usr/bin/env node
/**
 * verify.mjs — Verificador automatizado do PRD Site Stella Costa v1.0
 * Cobre os itens AUTO do references/prd-checklist.md.
 *
 * Uso:
 *   node scripts/verify.mjs --base http://localhost:3000 --repo .
 *
 * Requisitos: Node 18+ (fetch nativo). Zero dependências.
 * Saída: verify-report.md no diretório atual + exit code 1 se houver FAIL.
 */

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map((a, i, arr) => (a.startsWith("--") ? [a.slice(2), arr[i + 1]] : null)).filter(Boolean)
);
const BASE = (args.base || "http://localhost:3000").replace(/\/$/, "");
const REPO = args.repo || ".";

const results = [];
const add = (id, ref, status, detail) => results.push({ id, ref, status, detail });
const PASS = "PASS", FAIL = "FAIL", WARN = "WARN", NA = "N/A";

// ---------- helpers ----------
async function get(path) {
  try {
    const res = await fetch(BASE + path, { redirect: "manual" });
    const body = await res.text();
    return { status: res.status, body, headers: res.headers };
  } catch (e) {
    return { status: 0, body: "", error: e.message };
  }
}

function* walk(dir, skip = ["node_modules", ".next", ".git", "dist", "out", ".claude", ".specs", "verify-report.md"]) {
  for (const name of readdirSync(dir)) {
    if (skip.includes(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walk(p, skip);
    else yield p;
  }
}

function repoGrep(regex, exts = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".env", ".env.local", ".md", ".json"]) {
  const hits = [];
  for (const f of walk(REPO)) {
    if (!exts.some((e) => f.endsWith(e)) && !f.includes(".env")) continue;
    try {
      const content = readFileSync(f, "utf8");
      if (regex.test(content)) hits.push(f);
    } catch {}
  }
  return hits;
}

function extractJsonLd(html) {
  const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const parsed = [];
  for (const [, raw] of blocks) {
    try {
      const j = JSON.parse(raw.trim());
      parsed.push(...(Array.isArray(j) ? j : j["@graph"] ? j["@graph"] : [j]));
    } catch {
      parsed.push({ __parseError: true, raw: raw.slice(0, 120) });
    }
  }
  return parsed;
}

const strip = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

// ---------- Bloco 0: fundação ----------
async function bloco0() {
  add("CHK-002", "Stack App Router", existsSync(join(REPO, "app")) || existsSync(join(REPO, "src/app")) ? PASS : FAIL,
    "diretório app/ " + (existsSync(join(REPO, "app")) || existsSync(join(REPO, "src/app")) ? "encontrado" : "ausente"));

  const tw = existsSync(join(REPO, "tailwind.config.js")) || existsSync(join(REPO, "tailwind.config.ts")) ||
    repoGrep(/@import\s+["']tailwindcss["']|@tailwind/, [".css"]).length > 0;
  add("CHK-003", "Tailwind", tw ? PASS : FAIL, tw ? "configuração encontrada" : "não encontrado");

  const secrets = repoGrep(/service_role|SUPABASE_SERVICE.*=.{20,}|sk-[a-zA-Z0-9]{20,}/);
  const exposed = secrets.filter((f) => !f.includes(".env") || f.includes("NEXT_PUBLIC"));
  const pubService = repoGrep(/NEXT_PUBLIC[A-Z_]*SERVICE/);
  add("CHK-005", "Segredos", pubService.length === 0 && exposed.filter(f => !f.includes(".env")).length === 0 ? PASS : FAIL,
    pubService.length ? "service key com prefixo NEXT_PUBLIC em: " + pubService.join(", ") :
    exposed.filter(f => !f.includes(".env")).length ? "possível segredo hardcoded em: " + exposed.join(", ") : "nenhum segredo exposto no código");
}

// ---------- Bloco A: landing ----------
async function blocoA(home) {
  const { status, body } = home;
  add("CHK-010", "US-01 home 200", status === 200 ? PASS : FAIL, `GET / → ${status}`);
  if (status !== 200) return;

  const h1 = (body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "";
  const h1txt = strip(h1);
  const okH1 = /fonoaudi[oó]log/i.test(h1txt) && /infantil/i.test(h1txt) && /s[ãa]o gabriel do oeste/i.test(h1txt);
  add("CHK-011", "US-01 H1", okH1 ? PASS : FAIL, `H1: "${h1txt.trim().slice(0, 120)}"`);

  const text = strip(body);
  add("CHK-013", "US-01 WhatsApp no HTML", /wa\.me|api\.whatsapp\.com/i.test(body) ? PASS : FAIL, "link wa.me " + (/wa\.me/i.test(body) ? "presente" : "ausente"));

  add("CHK-020", "US-02 seção Sobre", /<h[23][^>]*>[^<]*sobre/i.test(body) ? PASS : FAIL, "");
  add("CHK-021", "US-02 USP Ribeirão", /USP/.test(text) && /Ribeir[ãa]o Preto/i.test(text) ? PASS : FAIL, "");
  add("CHK-022", "US-02 pós-graduação", /Dist[úu]rbios de Fala e Linguagem/i.test(text) ? PASS : FAIL, "");
  add("CHK-023", "US-02/CFFa CRFa", /CRFa[\s.:–-]*\d/i.test(text) ? PASS : FAIL, "número de registro " + (/CRFa[\s.:–-]*\d/i.test(text) ? "visível" : "NÃO encontrado"));

  const faixas = ["0-12", "1-2", "2-3", "3-4", "4"].filter((f) =>
    new RegExp(f.replace("-", "\\s*(a|-|–)\\s*") + "\\s*(meses|anos|\\+)", "i").test(text));
  add("CHK-030", "US-03 faixas etárias", faixas.length >= 5 ? PASS : FAIL, `faixas detectadas: ${faixas.length}/5`);

  // Depoimentos
  const depoSection = (body.match(/<section[^>]*depoiment[\s\S]*?<\/section>/i) || body.match(/depoiment[\s\S]{0,3000}/i) || [""])[0];
  const hasImgs = /<img/i.test(depoSection);
  add("CHK-041", "US-04 sem fotos em depoimentos", depoSection && !hasImgs ? PASS : depoSection ? FAIL : WARN,
    depoSection ? (hasImgs ? "imagem detectada na seção de depoimentos (LGPD)" : "ok") : "seção de depoimentos não localizada por heurística — verificar manualmente");

  // FAQ + JSON-LD
  const jsonld = extractJsonLd(body);
  const parseErrors = jsonld.filter((j) => j.__parseError);
  const faq = jsonld.find((j) => j["@type"] === "FAQPage");
  const nQ = faq?.mainEntity?.length || 0;
  add("CHK-051", "US-05 FAQPage schema", faq && nQ >= 6 && parseErrors.length === 0 ? PASS : FAIL,
    parseErrors.length ? "JSON-LD com erro de parse" : faq ? `FAQPage com ${nQ} perguntas (mín. 6)` : "FAQPage ausente");

  const biz = jsonld.find((j) => ["LocalBusiness", "MedicalBusiness", "MedicalClinic", "HealthAndBeautyBusiness"].includes(j["@type"]));
  const bizOk = biz && JSON.stringify(biz).match(/S[ãa]o Gabriel do Oeste/i) && (biz.telephone || biz.contactPoint);
  add("CHK-182", "RF-06 LocalBusiness/MedicalBusiness", bizOk ? PASS : FAIL,
    biz ? (bizOk ? `@type ${biz["@type"]} ok` : "presente mas sem endereço/telefone completos") : "ausente na home");

  add("CHK-080", "RF-08 mapa", /google\.com\/maps|maps\.google|openstreetmap/i.test(body) ? PASS : WARN, "Should Have — mapa " + (/maps/i.test(body) ? "presente" : "ausente"));
}

// ---------- Bloco A': WhatsApp em todas as rotas ----------
async function checkWhats(pages) {
  const missing = [], noText = [], texts = new Set();
  for (const [path, { status, body }] of Object.entries(pages)) {
    if (status !== 200 && path !== "/rota-que-nao-existe-404") continue;
    if (!/wa\.me|api\.whatsapp\.com/i.test(body)) missing.push(path);
    const links = [...body.matchAll(/https?:\/\/(?:wa\.me|api\.whatsapp\.com)[^"'\s>]*/gi)].map((m) => m[0]);
    for (const l of links) {
      const t = (l.match(/[?&]text=([^&"']*)/) || [])[1];
      if (!t) noText.push(path);
      else texts.add(decodeURIComponent(t));
    }
  }
  add("CHK-060", "US-06 WhatsApp em todas as páginas", missing.length === 0 ? PASS : FAIL,
    missing.length ? "ausente em: " + missing.join(", ") : "presente em todas as rotas testadas");
  const preenchida = [...texts].some((t) => /vim pelo site/i.test(t));
  add("CHK-061", "RF-02 mensagem pré-preenchida", noText.length === 0 && preenchida ? PASS : FAIL,
    noText.length ? "links sem text= em: " + [...new Set(noText)].join(", ") : preenchida ? "ok" : 'nenhuma mensagem contém "vim pelo site"');
  add("CHK-062", "US-13 origem distinta por seção", texts.size >= 3 ? PASS : WARN,
    `${texts.size} mensagens distintas detectadas (esperado ≥3 para distinguir origem) — confirmar tracking de evento (CHK-171 SEMI)`);
}

// ---------- Bloco B: teleconsulta ----------
async function blocoB(tele) {
  add("CHK-100", "US-07 /teleconsulta", tele.status === 200 ? PASS : FAIL, `GET /teleconsulta → ${tele.status}`);
  if (tele.status !== 200) return;
  add("CHK-102", "RF-19 embed Cal.com", /cal\.com|@calcom|Cal\(/i.test(tele.body) ? PASS : FAIL, "");
  const pay = /checkout|pagamento online|pix.*(pagar|checkout)|stripe|mercadopago/i.test(strip(tele.body));
  add("CHK-105", "Escopo: sem pagamento no MVP", !pay ? PASS : FAIL, pay ? "fluxo de pagamento detectado — RF-21 é V2" : "ok");
}

// ---------- Bloco E: SEO infra ----------
async function blocoE(pages) {
  const sm = await get("/sitemap.xml");
  const smOk = sm.status === 200 && /<urlset|<sitemapindex/.test(sm.body);
  const smHasBlog = /\/blog/.test(sm.body);
  add("CHK-180", "RF-05 sitemap", smOk && smHasBlog ? PASS : smOk ? WARN : FAIL,
    smOk ? (smHasBlog ? "válido, inclui blog" : "válido mas sem rotas de blog") : `→ ${sm.status}`);

  const rb = await get("/robots.txt");
  const rbOk = rb.status === 200 && /Disallow:\s*\/admin/i.test(rb.body);
  add("CHK-181", "RF-05 robots.txt", rb.status === 200 ? (rbOk ? PASS : WARN) : FAIL,
    rb.status === 200 ? (rbOk ? "ok, /admin bloqueado" : "existe mas não bloqueia /admin") : `→ ${rb.status}`);

  const nf = pages["/rota-que-nao-existe-404"];
  const custom404 = nf.status === 404 && /wa\.me|voltar|in[íi]cio|home/i.test(nf.body) && !/This page could not be found/i.test(strip(nf.body));
  add("CHK-070", "RF-07 404 personalizada", custom404 ? PASS : FAIL, `status ${nf.status}; ${custom404 ? "custom com CTA" : "default do Next ou sem CTA de retorno"}`);

  const semMeta = [], semCanonical = [];
  for (const [path, { status, body }] of Object.entries(pages)) {
    if (status !== 200) continue;
    if (!/<meta[^>]+name=["']description["']/i.test(body) || !/property=["']og:title["']/i.test(body)) semMeta.push(path);
    if (!/<link[^>]+rel=["']canonical["']/i.test(body)) semCanonical.push(path);
  }
  add("CHK-184", "RNF-SEO meta+OG", semMeta.length === 0 ? PASS : FAIL, semMeta.length ? "faltando em: " + semMeta.join(", ") : "ok em todas");
  add("CHK-183", "RNF-SEO canonical", semCanonical.length === 0 ? PASS : FAIL, semCanonical.length ? "faltando em: " + semCanonical.join(", ") : "ok");

  const rawImgs = repoGrep(/<img\s/i, [".tsx", ".jsx"]);
  add("CHK-186", "RNF-Perf next/image", rawImgs.length === 0 ? PASS : WARN, rawImgs.length ? "<img> cru em: " + rawImgs.slice(0, 5).join(", ") : "ok");
}

// ---------- Bloco C: blog público ----------
async function blocoC(blog) {
  add("CHK-110", "US-09 /blog", blog.status === 200 ? PASS : FAIL, `GET /blog → ${blog.status}`);
  if (blog.status !== 200) return;
  const slugs = [...blog.body.matchAll(/href=["']\/blog\/([a-z0-9-]+)["']/gi)].map((m) => m[1]);
  if (slugs.length === 0) {
    add("CHK-111", "US-09 artigo individual", WARN, "nenhum artigo publicado ainda — re-verificar após primeiro post");
    return;
  }
  const post = await get("/blog/" + slugs[0]);
  add("CHK-111", "US-09 slug amigável", post.status === 200 ? PASS : FAIL, `/blog/${slugs[0]} → ${post.status}`);
  if (post.status === 200) {
    const ogImg = /property=["']og:image["']/i.test(post.body);
    add("CHK-112", "US-09 meta/OG do artigo", ogImg && /name=["']description["']/i.test(post.body) ? PASS : FAIL, ogImg ? "ok" : "og:image ausente");
    const article = extractJsonLd(post.body).find((j) => ["Article", "BlogPosting"].includes(j["@type"]));
    add("CHK-113", "RF-06 Article schema", article ? PASS : FAIL, article ? `@type ${article["@type"]}` : "ausente");
    add("CHK-114", "US-09 CTA WhatsApp no artigo", /wa\.me|api\.whatsapp/i.test(post.body) ? PASS : FAIL, "");
  }
  const admin = await get("/admin");
  const protectedAdmin = admin.status >= 300 && admin.status < 400 || (admin.status === 200 && /login|senha|entrar/i.test(strip(admin.body)) && !/novo artigo|rascunho/i.test(strip(admin.body)));
  add("CHK-120", "US-10 /admin protegido", protectedAdmin ? PASS : FAIL, `GET /admin → ${admin.status}${admin.headers?.get?.("location") ? " → " + admin.headers.get("location") : ""}`);
}

// ---------- Bloco G: LGPD / CFFa ----------
async function blocoG(pages) {
  const badWords = /garantimos|garantia de resultado|resultado garantido|\bcura\b|antes e depois|100% de/i;
  const violations = [];
  for (const [path, { status, body }] of Object.entries(pages)) {
    if (status !== 200) continue;
    const m = strip(body).match(badWords);
    if (m) violations.push(`${path}: "${m[0]}"`);
  }
  add("CHK-203", "CFFa sem promessas", violations.length === 0 ? PASS : FAIL, violations.join(" | ") || "nenhum termo proibido encontrado");

  const home = pages["/"];
  const priv = Object.values(pages).some((p) => p.status === 200 && /privacidade/i.test(strip(p.body)) && /cal\.com/i.test(strip(p.body)))
    || (home.status === 200 && /pol[íi]tica de privacidade|aviso de privacidade/i.test(strip(home.body)));
  add("CHK-201", "LGPD aviso de privacidade", priv ? PASS : FAIL, priv ? "menção encontrada" : "aviso de privacidade não localizado");

  const forms = [];
  for (const [path, { status, body }] of Object.entries(pages)) {
    if (status !== 200) continue;
    const f = body.match(/<form[\s\S]*?<\/form>/gi) || [];
    for (const frm of f) if (/type=["'](email|tel|text)["']/i.test(frm) && !/cal\.com/i.test(frm) && !/admin|login|senha/i.test(frm)) forms.push(path);
  }
  add("CHK-200", "LGPD sem coleta própria", forms.length === 0 ? PASS : FAIL, forms.length ? "formulário coletando dados em: " + [...new Set(forms)].join(", ") : "ok");

  // Escopo V2
  const v2 = [];
  if (Object.values(pages).some((p) => /quiz/i.test(strip(p.body || "")))) v2.push("quiz (RF-10)");
  if (repoGrep(/stripe|mercadopago|checkout/i, [".ts", ".tsx"]).length) v2.push("pagamento (RF-21)");
  if (Object.values(pages).some((p) => /newsletter|assine|inscreva-se para receber/i.test(strip(p.body || "")))) v2.push("newsletter");
  add("CHK-225", "Escopo MVP congelado", v2.length === 0 ? PASS : FAIL, v2.length ? "itens V2 detectados: " + v2.join(", ") : "nenhum item V2 no MVP");
}

// ---------- Bloco D: analytics ----------
async function blocoD(pages) {
  const hasAnalytics = Object.entries(pages).filter(([, p]) => p.status === 200)
    .every(([, p]) => /vercel.*analytics|va\.vercel-scripts|umami|_vercel\/insights/i.test(p.body));
  add("CHK-170", "US-13 analytics presente", hasAnalytics ? PASS : FAIL, hasAnalytics ? "script em todas as páginas" : "ausente em ao menos uma página pública");
}

// ---------- main ----------
(async () => {
  console.log(`Verificando ${BASE} (repo: ${REPO})...\n`);
  const ping = await get("/");
  if (ping.status === 0) {
    console.error(`✗ Servidor inacessível em ${BASE}: ${ping.error}\n  Rode: npm run build && npm run start`);
    process.exit(2);
  }

  const paths = ["/", "/teleconsulta", "/blog", "/rota-que-nao-existe-404"];
  const pages = {};
  for (const p of paths) pages[p] = p === "/" ? ping : await get(p);

  await bloco0();
  await blocoA(pages["/"]);
  await checkWhats(pages);
  await blocoB(pages["/teleconsulta"]);
  await blocoC(pages["/blog"]);
  await blocoE(pages);
  await blocoG(pages);
  await blocoD(pages);

  // Relatório
  const counts = { PASS: 0, FAIL: 0, WARN: 0, "N/A": 0 };
  results.forEach((r) => counts[r.status]++);
  const icon = { PASS: "✓", FAIL: "✗", WARN: "⚠", "N/A": "–" };

  let md = `# Relatório de verificação PRD — ${new Date().toISOString().slice(0, 16).replace("T", " ")}\n`;
  md += `Base: ${BASE} | ✓ ${counts.PASS} PASS · ✗ ${counts.FAIL} FAIL · ⚠ ${counts.WARN} WARN\n\n`;
  for (const s of [FAIL, WARN, PASS]) {
    const group = results.filter((r) => r.status === s);
    if (!group.length) continue;
    md += `## ${s}\n`;
    for (const r of group) md += `- ${icon[s]} [${r.id}] ${r.ref}${r.detail ? " — " + r.detail : ""}\n`;
    md += "\n";
  }
  md += `## Não coberto por este script\nItens SEMI e MANUAL do checklist (RLS, auth, CRUD, Lighthouse, conteúdo da Stella, Cal.com, D1–D5).\nConsulte references/prd-checklist.md e complete o relatório antes de fechar a iteração.\n`;

  writeFileSync("verify-report.md", md);
  console.log(md);
  console.log(`Relatório salvo em verify-report.md`);
  process.exit(counts.FAIL > 0 ? 1 : 0);
})();
