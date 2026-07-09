# Checklist de verificação — PRD Site Stella Costa v1.0

Cada item tem: **ID**, referência ao PRD, **tipo** e **método de verificação**.

Tipos:
- **AUTO** — coberto por `scripts/verify.mjs` (ou comando único documentado).
- **SEMI** — verificável por Claude Code com passos extras (query, curl, interação).
- **MANUAL** — exige humano (Stella ou Leonardo): conteúdo, decisão ou julgamento visual.

Prioridade herda do PRD: itens `Nice to Have (V2)` são **N/A no MVP** — verifique
apenas que NÃO foram implementados às custas do escopo (R4).

---

## Bloco 0 — Fundação técnica

| ID | Ref | Tipo | Verificação |
|----|-----|------|-------------|
| CHK-001 | Stack | AUTO | `npm run build` sai com código 0, sem erros de tipo/lint bloqueantes |
| CHK-002 | Stack | AUTO | Projeto usa Next.js App Router (`app/` existe, não `pages/` como principal) |
| CHK-003 | Stack | AUTO | Tailwind configurado (`tailwind.config.*` ou `@tailwindcss` no CSS v4) |
| CHK-004 | Stack | SEMI | Variáveis Supabase presentes (`NEXT_PUBLIC_SUPABASE_URL`, anon key) e **service key NUNCA exposta com prefixo NEXT_PUBLIC** |
| CHK-005 | RNF-Seg | AUTO | Nenhum segredo hardcoded no repo (grep por `sk-`, `service_role`, senhas) |

## Bloco A — Landing page e conversão (Épico A)

### US-01 — Entender e contatar em segundos
| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-010 | AUTO | `/` responde 200 |
| CHK-011 | AUTO | Hero da home contém "Fonoaudióloga Infantil" (ou "Fonoaudiologia Infantil") + "São Gabriel do Oeste" no **H1 ou no primeiro H2**. Emenda de 2026-07-09: o Manual de Identidade v2.0 (§07) define o H1 como "Toda criança tem uma voz. Vamos soltar a sua?"; as palavras-chave ficam no H2, no `<title>` e na meta description |
| CHK-012 | AUTO | Existe `<img>`/`next/image` com alt referenciando Stella no hero |
| CHK-013 | AUTO | Link `wa.me` ou `api.whatsapp.com` presente no HTML do hero (primeira dobra estrutural) |
| CHK-014 | MANUAL | Botão WhatsApp visível **sem rolar** em viewport 390×844 (verificação visual/screenshot) |
| CHK-015 | SEMI | LCP < 2s em 4G simulado: `lighthouse http://localhost:3000 --throttling.cpuSlowdownMultiplier=4 --preset=perf` — PRD pede "perceptível < 2s"; use LCP < 2000ms como proxy |

### US-02 — Credenciais
| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-020 | AUTO | Seção "Sobre" existe (heading contendo "Sobre") |
| CHK-021 | AUTO | Texto contém "USP" e "Ribeirão Preto" |
| CHK-022 | AUTO | Texto contém "Distúrbios de Fala e Linguagem" (pós) |
| CHK-023 | AUTO | Número CRFa presente (regex `CRFa[\s-]*\d`) — também exigido por RNF-Conformidade |
| CHK-024 | MANUAL | Tom acolhedor do texto + foto aprovados por Stella (D3) |

### US-03 — Sinais de alerta por idade
| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-030 | AUTO | Seção de marcos/sinais existe com as 5 faixas: 0-12 meses, 1-2, 2-3, 3-4, 4+ anos |
| CHK-031 | AUTO | CTA ao final da seção com link WhatsApp (texto tipo "Identificou algum sinal") |
| CHK-032 | MANUAL | Linguagem sem jargão técnico — revisão da Stella (conteúdo clínico é dela) |

### US-04 — Depoimentos
| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-040 | AUTO | Seção de depoimentos com ≥ 3 itens renderizados |
| CHK-041 | AUTO | Nenhuma `<img>` na seção de depoimentos (sem foto de menores, RNF-LGPD) |
| CHK-042 | AUTO | Nomes em formato abreviado + cidade (heurística: padrão `Nome X.` — se detectar nome completo, FAIL para revisão) |
| CHK-043 | MANUAL | Os 3+ depoimentos são reais e autorizados pelos responsáveis (D3, LGPD) — placeholder = FAIL |

### US-05 — FAQ
| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-050 | AUTO | FAQ com ≥ 6 perguntas renderizadas |
| CHK-051 | AUTO | JSON-LD `@type: FAQPage` presente e parseável, com ≥ 6 `Question` cujo texto bate com o DOM |
| CHK-052 | MANUAL | Perguntas/respostas definidas com Stella (convênio, primeira consulta, idade mínima, duração no mínimo) |

### US-06 / RF-02 — WhatsApp onipresente
| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-060 | AUTO | Botão flutuante de WhatsApp presente em TODAS as rotas públicas (/, /teleconsulta, /blog, /blog/[slug], 404) |
| CHK-061 | AUTO | Todos os links `wa.me` têm parâmetro `text=` URL-encoded contendo "vim pelo site" |
| CHK-062 | AUTO | Identificador de origem distinto por seção (hero ≠ sinais ≠ FAQ ≠ blog ≠ flutuante) — via `text` ou atributo de evento |

### RF-07 — 404
| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-070 | AUTO | Rota inexistente retorna status 404 com página personalizada (não a default do Next) e CTA de retorno para `/` |

### RF-08 — Localização
| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-080 | AUTO | Seção de localização com mapa (iframe Google Maps ou equivalente) e endereço em São Gabriel do Oeste |

## Bloco B — Teleconsulta (Épico B)

| ID | Ref | Tipo | Verificação |
|----|-----|------|-------------|
| CHK-100 | US-07 | AUTO | `/teleconsulta` responde 200 com headings de formato, indicações e limitações |
| CHK-101 | US-07 | MANUAL | Conteúdo clínico (o que é atendível, formato, duração, valor) definido por Stella (D4) — placeholder = FAIL |
| CHK-102 | US-08/RF-19 | AUTO | Embed Cal.com presente (`cal.com` no HTML: iframe, script `embed.js` ou componente `@calcom/embed-react`) |
| CHK-103 | RF-19 | MANUAL | Evento Cal.com configurado: duração, buffer, antecedência mínima (conta da Stella; validar D5 free tier — 1 tipo de evento) |
| CHK-104 | RF-20 | MANUAL | Agendamento de teste realizado: e-mail de confirmação chega com link de videochamada |
| CHK-105 | US-08 | AUTO | Nenhum fluxo de pagamento no site (RF-21 é V2) — presença de checkout = desvio de escopo, FAIL |

## Bloco C — Blog e painel admin (Épico C)

### Blog público (US-09, RF-04)
| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-110 | AUTO | `/blog` lista artigos publicados; rascunhos NÃO aparecem |
| CHK-111 | AUTO | Artigo individual acessível por slug amigável `/blog/{slug}` (200) |
| CHK-112 | AUTO | Página do artigo tem `<title>`, `meta description`, `og:title`, `og:description`, `og:image` |
| CHK-113 | AUTO | JSON-LD `@type: Article` parseável em cada post |
| CHK-114 | AUTO | CTA de WhatsApp ao final de cada artigo (com origem = blog, ver CHK-062) |
| CHK-115 | AUTO | Acessar slug de rascunho ou inexistente → 404 (rascunho não pode vazar) |

### Auth (US-10, RF-11)
| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-120 | AUTO | `/admin` sem sessão redireciona para login (não expõe conteúdo) |
| CHK-121 | SEMI | Login e-mail/senha via Supabase Auth funciona para o e-mail da Stella |
| CHK-122 | SEMI | Segundo usuário criado no Supabase NÃO acessa `/admin` (restrição por e-mail, não só por "estar logado") |
| CHK-123 | SEMI | Fluxo de recuperação de senha envia e-mail e permite redefinir |
| CHK-124 | SEMI | Sessão persiste após fechar/reabrir navegador |

### CRUD e editor (US-11, RF-12, RF-13, RF-14)
| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-130 | SEMI | Criar artigo → salvar rascunho → publicar → editar → despublicar → excluir: ciclo completo sem erro |
| CHK-131 | SEMI | Editor suporta negrito, itálico, títulos, listas, links e imagens (inserir cada um e verificar HTML renderizado no post público) |
| CHK-132 | SEMI | Upload de imagem vai para Supabase Storage e é servida redimensionada/otimizada (verificar dimensões/peso da URL final) |
| CHK-133 | SEMI | Publicar artigo dispara revalidação: novo artigo aparece em `/blog` e no sitemap **sem redeploy** (RNF-Performance ISR) |
| CHK-134 | MANUAL | Painel utilizável em celular real (RF-16) — teste da Stella: "publicar um artigo sozinha em < 15 min" (job-to-be-done da persona 3) |

### SEO por artigo (US-12, RF-15)
| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-140 | SEMI | Campos título, slug (auto-gerado E editável), meta description e imagem de capa existem no painel e refletem no HTML público |
| CHK-141 | SEMI | Pré-visualização de compartilhamento existe no painel |

### Gestão de conteúdo (RF-17 — Should Have)
| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-150 | SEMI | Depoimentos e FAQ editáveis pelo painel; alteração reflete no site sem deploy |

### Segurança de dados (RNF-Segurança)
| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-160 | SEMI | RLS ativo: `select relrowsecurity from pg_class` para tabelas de posts/depoimentos/faq = true |
| CHK-161 | SEMI | Com **anon key**, INSERT/UPDATE/DELETE em qualquer tabela falha por policy (curl direto na REST API do Supabase) |
| CHK-162 | SEMI | Com token do segundo usuário (não-Stella), escrita também falha |
| CHK-163 | SEMI | SELECT anônimo retorna apenas artigos `published` (rascunho invisível também via API, não só na UI) |
| CHK-164 | SEMI | Bucket do Storage: escrita restrita à Stella; leitura pública apenas do necessário |

## Bloco D — Medição (Épico D, US-13)

| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-170 | AUTO | Script de analytics presente (Vercel Analytics ou Umami) em todas as páginas públicas |
| CHK-171 | SEMI | Clique em cada CTA de WhatsApp dispara evento com identificação da seção de origem (inspecionar payload de rede ou chamada `track()`) |
| CHK-172 | MANUAL | Google Search Console configurado e sitemap submetido (pós-deploy, domínio D1) |
| CHK-173 | MANUAL | Rotina mensal definida: consolidar cliques + agendamentos Cal.com (KPI primário, O1: baseline mês 1, +20%/mês) |

## Bloco E — SEO e infraestrutura (RF-05, RF-06, RNF-SEO)

| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-180 | AUTO | `/sitemap.xml` responde 200, XML válido, inclui home, /teleconsulta, /blog e cada artigo publicado |
| CHK-181 | AUTO | `/robots.txt` responde 200, permite indexação do público e bloqueia `/admin` |
| CHK-182 | AUTO | JSON-LD `LocalBusiness` ou `MedicalBusiness` na home, com nome, endereço (São Gabriel do Oeste) e telefone |
| CHK-183 | AUTO | Toda página pública tem `<link rel="canonical">` |
| CHK-184 | AUTO | Meta tags + Open Graph em todas as páginas públicas (title, description, og:*) |
| CHK-185 | AUTO | Páginas públicas são estáticas/ISR: `next build` mostra `○` ou `●`/ISR para rotas públicas (não `ƒ` dynamic) |
| CHK-186 | AUTO | Imagens via `next/image` (grep por `<img` cru fora de exceções justificadas) |

## Bloco F — Performance (RNF-Performance)

| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-190 | SEMI | Lighthouse mobile: LCP < 2,5s, CLS < 0.1, INP/TBT na faixa verde (rodar 3x, usar mediana) |
| CHK-191 | AUTO | Imagens servidas em formato moderno (resposta com `content-type: image/webp` ou `avif`) |
| CHK-192 | MANUAL | Teste em rede 4G real ou throttling no dispositivo, percepção < 2s no hero (US-01) |

## Bloco G — LGPD, privacidade e ética (RNF-Segurança, RNF-Conformidade)

| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-200 | AUTO | Nenhum formulário próprio coletando dados (além do embed Cal.com) — form detectado = FAIL de escopo |
| CHK-201 | AUTO | Aviso de privacidade presente e mencionando processamento de dados de agendamento pelo Cal.com |
| CHK-202 | AUTO | HTTPS obrigatório em produção (redirect http→https; nativo Vercel — verificar pós-deploy) |
| CHK-203 | AUTO | Grep de conformidade CFFa no conteúdo público: FAIL se encontrar "garantimos", "garantia de resultado", "cura", "antes e depois", "100%", "resultado garantido" |
| CHK-204 | AUTO | CRFa visível no site (mesmo check do CHK-023, obrigatório também no rodapé) |
| CHK-205 | MANUAL | Diretriz editorial documentada e entregue à Stella (mitigação R6): sem promessa de resultado, sem caso clínico identificável |
| CHK-206 | MANUAL | Consentimento dos responsáveis pelos depoimentos arquivado (print/mensagem) |

## Bloco H — Compatibilidade (RNF-Compatibilidade)

| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-210 | MANUAL | Site testado em Chrome, Safari, Firefox e Edge (visual + WhatsApp CTA funcionando) |
| CHK-211 | MANUAL | Painel testado em iOS e Android |
| CHK-212 | AUTO | Viewport meta tag presente; layout mobile-first (sem overflow horizontal em 390px — verificável via Playwright se disponível) |

## Bloco I — Decisões pendentes e escopo (Seção 8 do PRD)

| ID | Tipo | Verificação |
|----|------|-------------|
| CHK-220 | MANUAL | D1: domínio registrado e apontado para a Vercel |
| CHK-221 | MANUAL | D2: identidade visual (paleta, tipografia, logo) definida ANTES do design das páginas |
| CHK-222 | MANUAL | D3: conteúdo inicial completo (sobre, FAQ, teleconsulta, valores, 3+ depoimentos) |
| CHK-223 | MANUAL | D4: definição clínica da teleconsulta entregue por Stella |
| CHK-224 | MANUAL | D5: plano Cal.com validado (free tier = 1 tipo de evento suficiente?) |
| CHK-225 | AUTO | Nada de V2 implementado no MVP: sem quiz (RF-10), sem pagamento (RF-21), sem dashboard de métricas (RF-18), sem newsletter — presença = FAIL de escopo (R4) |
| CHK-226 | MANUAL | Banco de 5 pautas prontas para o blog entregue no lançamento (mitigação R2) |
| CHK-227 | MANUAL | Google Business Profile criado/otimizado (mitigação R5 — complemento obrigatório) |
| CHK-228 | AUTO | Embed Cal.com isolado em componente próprio (mitigação R3): existe um único componente wrapper, não chamadas espalhadas |
| CHK-229 | MANUAL | Rotina de exportação manual mensal dos artigos definida (RNF-Disponibilidade) |

---

## Mapa rápido PRD → checklist

| PRD | Itens |
|-----|-------|
| US-01 | 010–015 · US-02 | 020–024 · US-03 | 030–032 · US-04 | 040–043 · US-05 | 050–052 · US-06 | 060–062 |
| US-07 | 100–101 · US-08 | 102–105 · US-09 | 110–115 · US-10 | 120–124 · US-11 | 130–134 · US-12 | 140–141 · US-13 | 170–173 |
| RF-01..09 | blocos A/E · RF-11..17 | bloco C · RF-19/20 | bloco B · RF-10/18/21 | 225 (não implementar) |
| RNF Perf | 015, 133, 185–186, 190–192 · RNF SEO | 180–186 · RNF Seg/LGPD | 005, 160–164, 200–206 |
| RNF Compat | 210–212 · RNF Conformidade | 023, 203–205 · Riscos R1–R6 | 105, 226, 228, 205, 227 |
