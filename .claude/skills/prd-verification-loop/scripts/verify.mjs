#!/usr/bin/env node
/**
 * verify.mjs — Verificador automatizado do PRD Site Stella Costa v1.0
 * Cobre os itens AUTO do references/prd-checklist.md.
 *
 * Uso (sempre a partir da raiz do repositório):
 *   npm run verify
 *   npm run verify -- --base https://stella-costa-fono.vercel.app
 *   npm run verify -- --phase F2
 *   node .claude/skills/prd-verification-loop/scripts/verify.mjs --base http://localhost:3000 --repo .
 *
 * Flags:
 *   --base   URL do site (default: http://localhost:3000)
 *   --repo   caminho do repositório (default: .)
 *   --phase  F1|F2|F3|F4|F5|F6 (default: F6 = tudo)
 *            Checks de fases posteriores saem como N/A (não bloqueiam).
 *
 * Requisitos: Node 18+ (fetch nativo). Zero dependências.
 * Saída: verify-report.md no diretório atual + exit code 1 se houver FAIL.
 */

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const args = Object.fromEntries(
  process.argv.slice(2).map((a, i, arr) => (a.startsWith("--") ? [a.slice(2), arr[i + 1]] : null)).filter(Boolean)
);
const BASE = (args.base || "http://localhost:3000").replace(/\/$/, "");
const REPO = args.repo || ".";
const PHASE = String(args.phase || "F6").toUpperCase();
const RUN_BUILD = process.argv.includes("--build");
const IS_PROD = !/localhost|127\.0\.0\.1/.test(BASE);
const PHASE_RANK = { F1: 1, F2: 2, F3: 3, F4: 4, F5: 5, F6: 6 };
const maxRank = PHASE_RANK[PHASE] || 6;

const results = [];
const PASS = "PASS", FAIL = "FAIL", WARN = "WARN", NA = "N/A";

/** Registra resultado. Se o check exige fase > fase atual → N/A. */
function add(id, ref, status, detail, minPhase = "F1") {
  const need = PHASE_RANK[minPhase] || 1;
  if (need > maxRank) {
    results.push({ id, ref, status: NA, detail: `fora do escopo da fase ${PHASE} (exige ${minPhase})` });
    return;
  }
  results.push({ id, ref, status, detail });
}

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

const strip = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

/** Conta depoimentos: cards com nome abreviado "Nome X." ou blockquotes. */
function countDepoimentos(html) {
  const section =
    (html.match(/<section[^>]*>[\s\S]*?depoiment[\s\S]*?<\/section>/i) ||
      html.match(/id=["']depoiment[^"']*["'][\s\S]{0,8000}/i) ||
      html.match(/depoiment[\s\S]{0,5000}/i) ||
      [""])[0];
  if (!section || section.length < 20) return { n: 0, section: "" };
  const abbreviated = [...section.matchAll(/\b[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ]\.)+/g)];
  const quotes = [...section.matchAll(/<blockquote[\s\S]*?<\/blockquote>/gi)];
  const cards = [...section.matchAll(/<(?:article|li|figure)[\s\S]*?<\/(?:article|li|figure)>/gi)];
  const n = Math.max(abbreviated.length, quotes.length, cards.length >= 3 ? cards.length : 0);
  return { n, section };
}

/** Conta itens de FAQ no DOM (details/summary ou dt/dd). */
function countFaqDom(html) {
  const details = [...html.matchAll(/<details[\s\S]*?<\/details>/gi)].length;
  const dts = [...html.matchAll(/<dt[\s\S]*?<\/dt>/gi)].length;
  const faqSection =
    (html.match(/<section[^>]*>[\s\S]*?(?:faq|perguntas)[\s\S]*?<\/section>/i) ||
      html.match(/(?:faq|perguntas frequentes)[\s\S]{0,12000}/i) ||
      [""])[0];
  const h3inFaq = faqSection ? [...faqSection.matchAll(/<h3[\s\S]*?<\/h3>/gi)].length : 0;
  return Math.max(details, dts, h3inFaq);
}

// ---------- Bloco 0: fundação ----------
async function bloco0() {
  // CHK-001: build de produção sem erros.
  // Com --build, executa `npm run build` e usa o exit code como evidência.
  // Sem --build, só PASSA se houver BUILD_ID mais novo que todo o código-fonte —
  // artefato obsoleto ou ausente vira WARN, nunca PASS silencioso.
  const buildId = join(REPO, ".next", "BUILD_ID");
  if (RUN_BUILD) {
    const r = spawnSync("npm", ["run", "build"], { cwd: REPO, encoding: "utf8", shell: true });
    const erro = (r.stderr || "").split("\n").filter(Boolean).slice(-2).join(" | ");
    add("CHK-001", "Stack build de produção", r.status === 0 ? PASS : FAIL,
      r.status === 0 ? "npm run build → exit 0" : `npm run build → exit ${r.status}${erro ? ": " + erro : ""}`, "F1");
  } else if (!existsSync(buildId)) {
    add("CHK-001", "Stack build de produção", WARN,
      "sem .next/BUILD_ID — rode `npm run verify -- --build` ou `npm run build` antes", "F1");
  } else {
    const buildTime = statSync(buildId).mtimeMs;
    const maisNovo = [...walk(REPO)]
      .filter((f) => /\.(tsx?|jsx?|css|mjs|json)$/.test(f) && !f.includes(".next"))
      .reduce((max, f) => Math.max(max, statSync(f).mtimeMs), 0);
    const atual = buildTime >= maisNovo;
    add("CHK-001", "Stack build de produção", atual ? PASS : WARN,
      atual
        ? "artefato .next mais novo que o código-fonte (build atualizado)"
        : "artefato .next é ANTERIOR a alterações no código — rebuild antes de confiar no resultado",
      "F1");
  }

  add(
    "CHK-002",
    "Stack App Router",
    existsSync(join(REPO, "app")) || existsSync(join(REPO, "src/app")) ? PASS : FAIL,
    "diretório app/ " + (existsSync(join(REPO, "app")) || existsSync(join(REPO, "src/app")) ? "encontrado" : "ausente"),
    "F1"
  );

  const tw =
    existsSync(join(REPO, "tailwind.config.js")) ||
    existsSync(join(REPO, "tailwind.config.ts")) ||
    repoGrep(/@import\s+["']tailwindcss["']|@tailwind/, [".css"]).length > 0;
  add("CHK-003", "Tailwind", tw ? PASS : FAIL, tw ? "configuração encontrada" : "não encontrado", "F1");

  const secrets = repoGrep(/service_role|SUPABASE_SERVICE.*=.{20,}|sk-[a-zA-Z0-9]{20,}/);
  const exposed = secrets.filter((f) => !f.includes(".env") || f.includes("NEXT_PUBLIC"));
  const pubService = repoGrep(/NEXT_PUBLIC[A-Z_]*SERVICE/);
  add(
    "CHK-005",
    "Segredos",
    pubService.length === 0 && exposed.filter((f) => !f.includes(".env")).length === 0 ? PASS : FAIL,
    pubService.length
      ? "service key com prefixo NEXT_PUBLIC em: " + pubService.join(", ")
      : exposed.filter((f) => !f.includes(".env")).length
        ? "possível segredo hardcoded em: " + exposed.join(", ")
        : "nenhum segredo exposto no código",
    "F1"
  );
}

// ---------- Bloco A: landing ----------
async function blocoA(home) {
  const { status, body } = home;
  add("CHK-010", "US-01 home 200", status === 200 ? PASS : FAIL, `GET / → ${status}`, "F1");
  if (status !== 200) return;

  // Decisão 2026-07-09: H1 = frase da marca; keywords no H2 / title.
  const h1 = (body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "";
  const h2 = (body.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || [])[1] || "";
  const h1txt = strip(h1),
    h2txt = strip(h2);
  const temKeywords = (t) => /fonoaudi[oó]log/i.test(t) && /infantil/i.test(t) && /s[ãa]o gabriel do oeste/i.test(t);
  const okH1 = temKeywords(h1txt) || temKeywords(h2txt);
  add(
    "CHK-011",
    "US-01 palavras-chave em H1/H2",
    okH1 ? PASS : FAIL,
    `H1: "${h1txt.trim().slice(0, 60)}" | H2: "${h2txt.trim().slice(0, 80)}"`,
    "F2"
  );

  // CHK-012: foto Stella com alt no hero
  const imgs = [...body.matchAll(/<img[^>]+>/gi)].map((m) => m[0]);
  const stellaImg = imgs.find((tag) => /alt=["'][^"']*stella/i.test(tag));
  add(
    "CHK-012",
    "US-01 foto Stella no hero",
    stellaImg ? PASS : FAIL,
    stellaImg ? "img com alt referenciando Stella" : "nenhuma img com alt contendo Stella",
    "F2"
  );

  const text = strip(body);
  add(
    "CHK-013",
    "US-01 WhatsApp no HTML",
    /wa\.me|api\.whatsapp\.com/i.test(body) ? PASS : FAIL,
    "link wa.me " + (/wa\.me/i.test(body) ? "presente" : "ausente"),
    "F2"
  );

  add("CHK-020", "US-02 seção Sobre", /<h[23][^>]*>[^<]*sobre/i.test(body) ? PASS : FAIL, "", "F2");
  add("CHK-021", "US-02 USP Ribeirão", /USP/.test(text) && /Ribeir[ãa]o Preto/i.test(text) ? PASS : FAIL, "", "F2");
  add("CHK-022", "US-02 pós-graduação", /Dist[úu]rbios de Fala e Linguagem/i.test(text) ? PASS : FAIL, "", "F2");
  add(
    "CHK-023",
    "US-02/CFFa CRFa",
    /CRFa[\s.:–-]*\d/i.test(text) ? PASS : FAIL,
    "número de registro " + (/CRFa[\s.:–-]*\d/i.test(text) ? "visível" : "NÃO encontrado"),
    "F2"
  );

  // CHK-204: CRFa também no rodapé
  const footer = (body.match(/<footer[\s\S]*?<\/footer>/i) || [""])[0];
  add(
    "CHK-204",
    "CFFa CRFa no rodapé",
    /CRFa[\s.:–-]*\d/i.test(footer) ? PASS : FAIL,
    footer ? (/CRFa[\s.:–-]*\d/i.test(footer) ? "CRFa no footer" : "footer sem número CRFa") : "footer ausente",
    "F2"
  );

  const faixas = ["0-12", "1-2", "2-3", "3-4", "4"].filter((f) =>
    new RegExp(f.replace("-", "\\s*(a|-|–)\\s*") + "\\s*(meses|anos|\\+)", "i").test(text)
  );
  add("CHK-030", "US-03 faixas etárias", faixas.length >= 5 ? PASS : FAIL, `faixas detectadas: ${faixas.length}/5`, "F2");

  // CHK-031: CTA sinais → WhatsApp
  const ctaSinais =
    /identificou algum sinal/i.test(text) ||
    /wa\.me[^"']*sinais/i.test(body) ||
    /\(sinais\)/i.test(body);
  add(
    "CHK-031",
    "US-03 CTA sinais WhatsApp",
    ctaSinais ? PASS : FAIL,
    ctaSinais ? "CTA/origem sinais detectado" : 'sem "Identificou algum sinal" nem origem sinais no HTML',
    "F2"
  );

  // Depoimentos
  const { n: nDepo, section: depoSection } = countDepoimentos(body);
  add(
    "CHK-040",
    "US-04 ≥3 depoimentos",
    nDepo >= 3 ? PASS : nDepo === 0 ? FAIL : FAIL,
    nDepo >= 3 ? `${nDepo} itens detectados` : nDepo === 0 ? "seção/itens não localizados" : `apenas ${nDepo} (mín. 3)`,
    "F2"
  );

  const hasImgs = depoSection && /<img/i.test(depoSection);
  add(
    "CHK-041",
    "US-04 sem fotos em depoimentos",
    depoSection && !hasImgs ? PASS : depoSection ? FAIL : WARN,
    depoSection
      ? hasImgs
        ? "imagem detectada na seção de depoimentos (LGPD)"
        : "ok"
      : "seção de depoimentos não localizada por heurística — verificar manualmente",
    "F2"
  );

  // CHK-042: nomes abreviados (heurística)
  const fullNames = depoSection
    ? [...depoSection.matchAll(/\b[A-ZÁÉÍÓÚ][a-záéíóú]+\s+[A-ZÁÉÍÓÚ][a-záéíóú]{3,}\b/g)].filter(
        (m) => !/São Gabriel|Oeste|Brasil|WhatsApp/i.test(m[0])
      )
    : [];
  const abbreviatedOk = depoSection
    ? /\b[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ]\./.test(depoSection)
    : false;
  add(
    "CHK-042",
    "US-04 nomes abreviados",
    !depoSection
      ? WARN
      : abbreviatedOk && fullNames.length === 0
        ? PASS
        : fullNames.length
          ? FAIL
          : WARN,
    !depoSection
      ? "seção ausente — reavaliar com depoimentos"
      : fullNames.length
        ? "possível nome completo: " + fullNames.slice(0, 3).map((m) => m[0]).join(", ")
        : abbreviatedOk
          ? "padrão Nome X. detectado"
          : "sem padrão de abreviação claro — revisão manual",
    "F2"
  );

  // FAQ DOM + JSON-LD
  const nFaqDom = countFaqDom(body);
  add(
    "CHK-050",
    "US-05 FAQ ≥6 no DOM",
    nFaqDom >= 6 ? PASS : FAIL,
    nFaqDom >= 6 ? `${nFaqDom} itens no DOM` : `${nFaqDom} itens detectados (mín. 6)`,
    "F2"
  );

  const jsonld = extractJsonLd(body);
  const parseErrors = jsonld.filter((j) => j.__parseError);
  const faq = jsonld.find((j) => j["@type"] === "FAQPage");
  const nQ = faq?.mainEntity?.length || 0;
  add(
    "CHK-051",
    "US-05 FAQPage schema",
    faq && nQ >= 6 && parseErrors.length === 0 ? PASS : FAIL,
    parseErrors.length
      ? "JSON-LD com erro de parse"
      : faq
        ? `FAQPage com ${nQ} perguntas (mín. 6)`
        : "FAQPage ausente",
    "F2"
  );

  const biz = jsonld.find((j) =>
    ["LocalBusiness", "MedicalBusiness", "MedicalClinic", "HealthAndBeautyBusiness"].includes(j["@type"])
  );
  const bizOk = biz && JSON.stringify(biz).match(/S[ãa]o Gabriel do Oeste/i) && (biz.telephone || biz.contactPoint);
  add(
    "CHK-182",
    "RF-06 LocalBusiness/MedicalBusiness",
    bizOk ? PASS : FAIL,
    biz ? (bizOk ? `@type ${biz["@type"]} ok` : "presente mas sem endereço/telefone completos") : "ausente na home",
    "F2"
  );

  add(
    "CHK-080",
    "RF-08 mapa",
    /google\.com\/maps|maps\.google|openstreetmap/i.test(body) ? PASS : WARN,
    "Should Have — mapa " + (/maps/i.test(body) ? "presente" : "ausente"),
    "F2"
  );

  // CHK-212: viewport mobile
  add(
    "CHK-212",
    "RNF viewport meta",
    /<meta[^>]+name=["']viewport["']/i.test(body) ? PASS : FAIL,
    /viewport/i.test(body) ? "meta viewport presente" : "meta viewport ausente",
    "F2"
  );
}

// ---------- Bloco A': WhatsApp em todas as rotas ----------
async function checkWhats(pages) {
  const missing = [],
    noText = [],
    texts = new Set();
  for (const [path, { status, body }] of Object.entries(pages)) {
    if (status !== 200 && path !== "/rota-que-nao-existe-404") continue;
    // Em fases < F3/F4, rotas 404 de blog/teleconsulta não contam como "página pública"
    if (status !== 200 && status !== 404) continue;
    if (status === 404 && path !== "/rota-que-nao-existe-404") continue;
    if (!/wa\.me|api\.whatsapp\.com/i.test(body)) missing.push(path);
    const links = [...body.matchAll(/https?:\/\/(?:wa\.me|api\.whatsapp\.com)[^"'\s>]*/gi)].map((m) => m[0]);
    for (const l of links) {
      const t = (l.match(/[?&]text=([^&"']*)/) || [])[1];
      if (!t) noText.push(path);
      else texts.add(decodeURIComponent(t));
    }
  }
  add(
    "CHK-060",
    "US-06 WhatsApp em todas as páginas",
    missing.length === 0 ? PASS : FAIL,
    missing.length ? "ausente em: " + missing.join(", ") : "presente em todas as rotas testadas (status 200 + 404 custom)",
    "F2"
  );
  const preenchida = [...texts].some((t) => /vim pelo site/i.test(t));
  add(
    "CHK-061",
    "RF-02 mensagem pré-preenchida",
    noText.length === 0 && preenchida ? PASS : FAIL,
    noText.length
      ? "links sem text= em: " + [...new Set(noText)].join(", ")
      : preenchida
        ? "ok"
        : 'nenhuma mensagem contém "vim pelo site"',
    "F2"
  );
  add(
    "CHK-062",
    "US-13 origem distinta por seção",
    texts.size >= 3 ? PASS : WARN,
    `${texts.size} mensagens distintas detectadas (esperado ≥3 para distinguir origem) — confirmar tracking de evento (CHK-171 SEMI)`,
    "F2"
  );
}

// ---------- Bloco B: teleconsulta ----------
async function blocoB(tele) {
  add("CHK-100", "US-07 /teleconsulta", tele.status === 200 ? PASS : FAIL, `GET /teleconsulta → ${tele.status}`, "F4");
  if (tele.status !== 200) {
    // ainda assim checar isolamento do componente no repo (F4)
  } else {
    add(
      "CHK-102",
      "RF-19 embed Cal.com",
      /cal\.com|@calcom|Cal\(/i.test(tele.body) ? PASS : FAIL,
      "",
      "F4"
    );
    const pay = /checkout|pagamento online|pix.*(pagar|checkout)|stripe|mercadopago/i.test(strip(tele.body));
    add(
      "CHK-105",
      "Escopo: sem pagamento no MVP",
      !pay ? PASS : FAIL,
      pay ? "fluxo de pagamento detectado — RF-21 é V2" : "ok",
      "F4"
    );
  }

  // CHK-228: embed isolado em um único componente wrapper
  // Não conta menção textual a "Cal.com" (ex.: aviso de privacidade no Footer).
  const calHits = repoGrep(
    /@calcom\/embed|cal\.com\/embed|Cal\.com\/|from\s+["']@calcom|new\s+Cal\(|getCalApi|data-cal-link|CalEmbed|cal-embed/i,
    [".ts", ".tsx", ".js", ".jsx"]
  );
  const wrappers = calHits.filter(
    (f) => /components?[\\/]/i.test(f) || /CalEmbed|cal-embed/i.test(relative(REPO, f))
  );
  const appHits = calHits.filter((f) => /[\\/]app[\\/]/i.test(f));
  const isolated =
    calHits.length === 0 ? null : calHits.length <= 2 && wrappers.length >= 1 && appHits.length <= 1;
  add(
    "CHK-228",
    "R3 Cal.com isolado",
    calHits.length === 0 ? WARN : isolated ? PASS : FAIL,
    calHits.length === 0
      ? "nenhum embed Cal.com no código ainda (menções só em texto de privacidade não contam)"
      : isolated
        ? `wrapper isolado: ${calHits.map((f) => relative(REPO, f)).join(", ")}`
        : `referências de embed espalhadas (${calHits.length}): ${calHits.map((f) => relative(REPO, f)).join(", ")}`,
    "F4"
  );
}

// ---------- Bloco E: SEO infra ----------
async function blocoE(pages) {
  const sm = await get("/sitemap.xml");
  const smOk = sm.status === 200 && /<urlset|<sitemapindex/.test(sm.body);
  const smHasBlog = /\/blog/.test(sm.body);
  // Em F1–F2, sitemap sem blog é WARN ok; em F3+ exige blog
  if (maxRank < 3) {
    add(
      "CHK-180",
      "RF-05 sitemap",
      smOk ? PASS : FAIL,
      smOk ? (smHasBlog ? "válido, inclui blog" : "válido (blog ainda não exigido na fase " + PHASE + ")") : `→ ${sm.status}`,
      "F1"
    );
  } else {
    add(
      "CHK-180",
      "RF-05 sitemap",
      smOk && smHasBlog ? PASS : smOk ? WARN : FAIL,
      smOk ? (smHasBlog ? "válido, inclui blog" : "válido mas sem rotas de blog") : `→ ${sm.status}`,
      "F1"
    );
  }

  const rb = await get("/robots.txt");
  const rbOk = rb.status === 200 && /Disallow:\s*\/admin/i.test(rb.body);
  add(
    "CHK-181",
    "RF-05 robots.txt",
    rb.status === 200 ? (rbOk ? PASS : WARN) : FAIL,
    rb.status === 200 ? (rbOk ? "ok, /admin bloqueado" : "existe mas não bloqueia /admin") : `→ ${rb.status}`,
    "F1"
  );

  const nf = pages["/rota-que-nao-existe-404"];
  const custom404 =
    nf.status === 404 &&
    /wa\.me|voltar|in[íi]cio|home/i.test(nf.body) &&
    !/This page could not be found/i.test(strip(nf.body));
  add(
    "CHK-070",
    "RF-07 404 personalizada",
    custom404 ? PASS : FAIL,
    `status ${nf.status}; ${custom404 ? "custom com CTA" : "default do Next ou sem CTA de retorno"}`,
    "F1"
  );

  const semMeta = [],
    semCanonical = [];
  for (const [path, { status, body }] of Object.entries(pages)) {
    if (status !== 200) continue;
    if (!/<meta[^>]+name=["']description["']/i.test(body) || !/property=["']og:title["']/i.test(body)) semMeta.push(path);
    if (!/<link[^>]+rel=["']canonical["']/i.test(body)) semCanonical.push(path);
  }
  add(
    "CHK-184",
    "RNF-SEO meta+OG",
    semMeta.length === 0 ? PASS : FAIL,
    semMeta.length ? "faltando em: " + semMeta.join(", ") : "ok em todas",
    "F1"
  );
  add(
    "CHK-183",
    "RNF-SEO canonical",
    semCanonical.length === 0 ? PASS : FAIL,
    semCanonical.length ? "faltando em: " + semCanonical.join(", ") : "ok",
    "F1"
  );

  const rawImgs = repoGrep(/<img\s/i, [".tsx", ".jsx"]);
  add(
    "CHK-186",
    "RNF-Perf next/image",
    rawImgs.length === 0 ? PASS : WARN,
    rawImgs.length ? "<img> cru em: " + rawImgs.slice(0, 5).join(", ") : "ok",
    "F1"
  );

  // CHK-202: HTTPS obrigatório. Em localhost não há o que verificar → N/A.
  // Nunca marcar PASS por presunção de "a Vercel faz HTTPS nativo".
  if (/localhost|127\.0\.0\.1/.test(BASE)) {
    add("CHK-202", "RNF HTTPS", NA, "localhost — rode contra a URL de produção para verificar", "F1");
  } else if (!BASE.startsWith("https://")) {
    add("CHK-202", "RNF HTTPS", FAIL, "base não é HTTPS: " + BASE, "F1");
  } else {
    // Testa de fato o redirect http → https na origem.
    const httpUrl = BASE.replace(/^https:/, "http:");
    let detalhe, ok = false;
    try {
      const res = await fetch(httpUrl + "/", { redirect: "manual" });
      const loc = res.headers.get("location") || "";
      const redirected = res.status >= 300 && res.status < 400 && loc.startsWith("https://");
      const hsts = (await fetch(BASE + "/")).headers.get("strict-transport-security");
      ok = redirected && !!hsts;
      detalhe = `http → ${res.status}${loc ? " " + loc : ""} | HSTS: ${hsts || "ausente"}`;
    } catch (e) {
      detalhe = "falha ao testar redirect: " + e.message;
    }
    add("CHK-202", "RNF HTTPS", ok ? PASS : FAIL, detalhe, "F1");
  }
}

// ---------- Bloco C: blog público ----------
async function blocoC(blog) {
  add("CHK-110", "US-09 /blog", blog.status === 200 ? PASS : FAIL, `GET /blog → ${blog.status}`, "F3");
  if (blog.status !== 200) {
    // admin check still relevant when blog exists; if blog 404, try admin anyway only in F3+
    if (maxRank >= 3) {
      const admin = await get("/admin");
      const protectedAdmin =
        (admin.status >= 300 && admin.status < 400) ||
        (admin.status === 200 &&
          /login|senha|entrar/i.test(strip(admin.body)) &&
          !/novo artigo|rascunho/i.test(strip(admin.body)));
      // se /admin 404 total, FAIL de proteção (rota ainda não existe)
      add(
        "CHK-120",
        "US-10 /admin protegido",
        admin.status === 404 ? FAIL : protectedAdmin ? PASS : FAIL,
        `GET /admin → ${admin.status}${admin.headers?.get?.("location") ? " → " + admin.headers.get("location") : ""}`,
        "F3"
      );
    }
    return;
  }
  const slugs = [...blog.body.matchAll(/href=["']\/blog\/([a-z0-9-]+)["']/gi)].map((m) => m[1]);
  if (slugs.length === 0) {
    add("CHK-111", "US-09 artigo individual", WARN, "nenhum artigo publicado ainda — re-verificar após primeiro post", "F3");
  } else {
    const post = await get("/blog/" + slugs[0]);
    add("CHK-111", "US-09 slug amigável", post.status === 200 ? PASS : FAIL, `/blog/${slugs[0]} → ${post.status}`, "F3");
    if (post.status === 200) {
      const ogImg = /property=["']og:image["']/i.test(post.body);
      add(
        "CHK-112",
        "US-09 meta/OG do artigo",
        ogImg && /name=["']description["']/i.test(post.body) ? PASS : FAIL,
        ogImg ? "ok" : "og:image ausente",
        "F3"
      );
      const article = extractJsonLd(post.body).find((j) => ["Article", "BlogPosting"].includes(j["@type"]));
      add(
        "CHK-113",
        "RF-06 Article schema",
        article ? PASS : FAIL,
        article ? `@type ${article["@type"]}` : "ausente",
        "F3"
      );
      add(
        "CHK-114",
        "US-09 CTA WhatsApp no artigo",
        /wa\.me|api\.whatsapp/i.test(post.body) ? PASS : FAIL,
        "",
        "F3"
      );
    }
  }

  // CHK-115: rascunho/inexistente → 404
  const ghost = await get("/blog/slug-que-nao-existe-xyz-prd-verify");
  add(
    "CHK-115",
    "US-09 slug inexistente 404",
    ghost.status === 404 ? PASS : FAIL,
    `GET /blog/slug-inexistente → ${ghost.status}`,
    "F3"
  );

  const admin = await get("/admin");
  const protectedAdmin =
    (admin.status >= 300 && admin.status < 400) ||
    (admin.status === 200 &&
      /login|senha|entrar/i.test(strip(admin.body)) &&
      !/novo artigo|rascunho/i.test(strip(admin.body)));
  add(
    "CHK-120",
    "US-10 /admin protegido",
    protectedAdmin ? PASS : FAIL,
    `GET /admin → ${admin.status}${admin.headers?.get?.("location") ? " → " + admin.headers.get("location") : ""}`,
    "F3"
  );
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
  add(
    "CHK-203",
    "CFFa sem promessas",
    violations.length === 0 ? PASS : FAIL,
    violations.join(" | ") || "nenhum termo proibido encontrado",
    "F1"
  );

  // CHK-043/052: conteúdo placeholder não pode ser servido como se fosse real.
  // Depoimentos inventados violam LGPD; sinais de alerta e FAQ são conteúdo
  // clínico/comercial que só a Stella pode aprovar (D3).
  let marcadores = [], validado = false;
  try {
    const src = readFileSync(join(REPO, "lib/landing-content.ts"), "utf8");
    validado = /CONTEUDO_VALIDADO\s*=\s*true/.test(src);
    marcadores = [...src.matchAll(/^\s*"([^"]{20,})",\s*$/gm)]
      .map((m) => m[1])
      .filter((s) => src.slice(0, src.indexOf(s)).includes("MARCADORES_PLACEHOLDER"));
  } catch {}

  const servidos = [];
  for (const [path, { status, body }] of Object.entries(pages)) {
    if (status !== 200) continue;
    const texto = strip(body);
    for (const m of marcadores) if (texto.includes(m)) servidos.push(`${path}: "${m.slice(0, 40)}…"`);
  }

  if (validado && servidos.length === 0) {
    add("CHK-043", "US-04/US-05 conteúdo real da Stella", PASS, "CONTEUDO_VALIDADO=true e nenhum marcador de rascunho servido", "F2");
  } else if (servidos.length === 0) {
    add("CHK-043", "US-04/US-05 conteúdo real da Stella", WARN,
      "rascunho existe em lib/landing-content.ts mas NÃO é servido (seções ainda não renderizadas) — aguardando D3", "F2");
  } else {
    add("CHK-043", "US-04/US-05 conteúdo real da Stella", FAIL,
      `conteúdo placeholder servido em ${IS_PROD ? "PRODUÇÃO" : "localhost"}: ` + servidos.join(" | ") +
      " — depoimentos inventados (LGPD) e afirmações clínicas/comerciais não validadas (D3)", "F2");
  }

  const home = pages["/"];
  const priv =
    Object.values(pages).some((p) => p.status === 200 && /privacidade/i.test(strip(p.body)) && /cal\.com/i.test(strip(p.body))) ||
    (home.status === 200 && /pol[íi]tica de privacidade|aviso de privacidade/i.test(strip(home.body)));
  add(
    "CHK-201",
    "LGPD aviso de privacidade",
    priv ? PASS : FAIL,
    priv ? "menção encontrada" : "aviso de privacidade não localizado",
    "F1"
  );

  const forms = [];
  for (const [path, { status, body }] of Object.entries(pages)) {
    if (status !== 200) continue;
    const f = body.match(/<form[\s\S]*?<\/form>/gi) || [];
    for (const frm of f)
      if (/type=["'](email|tel|text)["']/i.test(frm) && !/cal\.com/i.test(frm) && !/admin|login|senha/i.test(frm))
        forms.push(path);
  }
  add(
    "CHK-200",
    "LGPD sem coleta própria",
    forms.length === 0 ? PASS : FAIL,
    forms.length ? "formulário coletando dados em: " + [...new Set(forms)].join(", ") : "ok",
    "F1"
  );

  const v2 = [];
  if (Object.values(pages).some((p) => /quiz/i.test(strip(p.body || "")))) v2.push("quiz (RF-10)");
  if (repoGrep(/stripe|mercadopago|checkout/i, [".ts", ".tsx"]).length) v2.push("pagamento (RF-21)");
  if (Object.values(pages).some((p) => /newsletter|assine|inscreva-se para receber/i.test(strip(p.body || ""))))
    v2.push("newsletter");
  add(
    "CHK-225",
    "Escopo MVP congelado",
    v2.length === 0 ? PASS : FAIL,
    v2.length ? "itens V2 detectados: " + v2.join(", ") : "nenhum item V2 no MVP",
    "F1"
  );
}

// ---------- Bloco D: analytics ----------
async function blocoD(pages) {
  const publicOk = Object.entries(pages).filter(([, p]) => p.status === 200);
  const hasAnalytics =
    publicOk.length > 0 &&
    publicOk.every(([, p]) => /vercel.*analytics|va\.vercel-scripts|umami|_vercel\/insights/i.test(p.body));
  add(
    "CHK-170",
    "US-13 analytics presente",
    hasAnalytics ? PASS : FAIL,
    hasAnalytics ? "script em todas as páginas" : "ausente em ao menos uma página pública",
    "F5"
  );
}

// ---------- main ----------
(async () => {
  console.log(`Verificando ${BASE} (repo: ${REPO}, fase: ${PHASE})...\n`);
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

  const counts = { PASS: 0, FAIL: 0, WARN: 0, "N/A": 0 };
  results.forEach((r) => counts[r.status]++);
  const icon = { PASS: "✓", FAIL: "✗", WARN: "⚠", "N/A": "–" };

  let md = `# Relatório de verificação PRD — ${new Date().toISOString().slice(0, 16).replace("T", " ")}\n`;
  md += `Base: ${BASE} | Fase: ${PHASE} | ✓ ${counts.PASS} PASS · ✗ ${counts.FAIL} FAIL · ⚠ ${counts.WARN} WARN · – ${counts["N/A"]} N/A\n\n`;
  for (const s of [FAIL, WARN, PASS, NA]) {
    const group = results.filter((r) => r.status === s);
    if (!group.length) continue;
    md += `## ${s}\n`;
    for (const r of group) md += `- ${icon[s]} [${r.id}] ${r.ref}${r.detail ? " — " + r.detail : ""}\n`;
    md += "\n";
  }
  md += `## Não coberto por este script\nItens SEMI e MANUAL do checklist (RLS, auth, CRUD, Lighthouse, conteúdo da Stella, Cal.com, D1–D5).\nConsulte \`.claude/skills/prd-verification-loop/references/prd-checklist.md\` e complete o relatório antes de fechar a iteração.\n`;

  writeFileSync("verify-report.md", md);
  console.log(md);
  console.log(`Relatório salvo em verify-report.md`);
  process.exit(counts.FAIL > 0 ? 1 : 0);
})();
