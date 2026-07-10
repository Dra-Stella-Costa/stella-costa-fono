# Roadmap

**Current Milestone:** M2 — Conversão
**Status:** M1 concluído em 2026-07-09 (deploy em https://stella-costa-fono.vercel.app, Supabase com RLS testado, identidade v2.0 aplicada). Próximo: landing-page.

---

## M1 — Fundação

**Goal:** Projeto rodando na Vercel com stack configurado, identidade visual definida e base de dados pronta — pré-requisito de todas as features.
**Target:** Deploy de "hello world" estilizado + Supabase provisionado com schema e RLS.

### Features

**fundacao** - DONE (2026-07-09)

- Deploy: https://stella-costa-fono.vercel.app · repo `Dra-Stella-Costa/stella-costa-fono` (público) conectado, deploy automático por commit, HTTPS + HSTS
- Supabase `odanxowwlxijkugpfxhv`: migration 0001 aplicada, RLS testado (CHK-160..164 PASS)
- Identidade visual v2.0 aplicada (D2 resolvido) + foto institucional no hero
- Loop F1: 0 FAIL. Pendências que migram para M4: número real do WhatsApp, CRFa, favicon, SVGs oficiais do logo

- Setup Next.js (App Router) + TypeScript + Tailwind, deploy Vercel
- Identidade visual: paleta, tipografia, tokens no Tailwind (resolve D2)
- Supabase provisionado: tabelas (articles, testimonials, faqs), RLS, Storage bucket
- Layout base: header, footer, botão flutuante WhatsApp, página 404

---

## M2 — Conversão (núcleo do MVP)

**Goal:** Site público capaz de gerar contatos: landing completa + teleconsulta agendável. Já é lançável.
**Target:** Landing e /teleconsulta no ar com domínio, medindo cliques.

### Features

**landing-page** - DONE em estrutura, BLOQUEADA por conteúdo (2026-07-09)

- Seções: hero, sobre (USP/pós/CRFa), sinais por faixa etária, depoimentos (balão, sem foto), FAQ (`<details>` + schema FAQPage), localização com mapa lazy, schema MedicalBusiness
- Loop F2: 34 PASS / 3 FAIL — os 3 dependem da Stella (CRFa em CHK-023/204; conteúdo real em CHK-043)
- Sinais, depoimentos e FAQ ficam atrás de `NEXT_PUBLIC_MOSTRAR_RASCUNHO` (só local). Produção serve apenas conteúdo factual até D3

- Hero com "Fonoaudióloga Infantil" + cidade, foto, CTA WhatsApp above the fold
- Seções: sobre (credenciais/CRFa), sinais de alerta por faixa etária, depoimentos, FAQ, localização/mapa
- Schema LocalBusiness + FAQPage, Open Graph, LCP <2,5s

**teleconsulta** - DONE em estrutura, BLOQUEADA por conteúdo (2026-07-09)

- `/teleconsulta`: formato, indicações, limitações (rascunho D4), CTA âncora para agendamento
- `CalcomEmbed` isolado (mitigação R3) com fallback: link direto + WhatsApp
- Rota responde 404 em produção e fica fora do sitemap até D4 (spec US-07 AC2)
- Pendente: conteúdo clínico da Stella, link real do evento (`NEXT_PUBLIC_CALCOM_LINK`), validação do free tier (D5) e agendamento de teste ponta a ponta (CHK-104)

- Página /teleconsulta com formato, indicações e limitações clínicas
- Cal.com embutido (evento configurado: duração, buffer, antecedência)
- Confirmação automática por e-mail com link da videochamada (nativo Cal.com)

**analytics-seo** - PLANNED

- Eventos de clique em todos os CTAs WhatsApp com seção de origem
- Vercel Analytics ou Umami + Google Search Console
- Sitemap.xml, robots.txt, URLs canônicas

---

## M3 — Conteúdo

**Goal:** Blog público + painel administrativo para Stella publicar de forma autônoma.
**Target:** Stella publica um artigo real sozinha, do celular, em <15 min.

### Features

**blog-publico** - PLANNED

- /blog com listagem e páginas individuais (URL amigável)
- Meta tags, Open Graph e schema Article por post; CTA WhatsApp ao final
- SSG/ISR com revalidação ao publicar; artigos no sitemap

**painel-admin** - PLANNED

- Login Supabase Auth restrito ao e-mail da Stella, recuperação de senha
- CRUD de artigos: rascunho/publicado, editar, despublicar, excluir
- Editor rico mobile com upload de imagem (Storage + redimensionamento)
- Campos SEO: título, slug editável, meta description, capa, preview de compartilhamento
- Gestão de depoimentos e FAQ pelo painel

---

## M4 — Lançamento

**Goal:** Go-live completo com conteúdo real e medição validada.
**Target:** Domínio apontado, conteúdo da Stella no ar, KPIs coletando.

### Features

**lancamento** - PLANNED

- Domínio registrado e configurado (resolve D1)
- Conteúdo real: sobre, FAQ (≥6), ≥3 depoimentos, textos de teleconsulta (D3/D4)
- 5 pautas iniciais de blog prontas + diretriz editorial CFFa entregue à Stella
- Google Business Profile configurado
- Checklist final: Core Web Vitals verde, schema validado, aviso de privacidade

---

## Future Considerations (V2)

- Pagamento online antecipado no agendamento (Pix/cartão) — prioridade se no-show >30%
- Quiz interativo de marcos de desenvolvimento
- Dashboard de métricas no painel (artigos, visualizações)
- Newsletter / captura de e-mail
- Área de materiais ricos (e-books, checklists)
