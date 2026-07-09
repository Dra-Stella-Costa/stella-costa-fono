# Site Stella Costa — Fonoaudiologia Infantil

**Vision:** Site de conversão que transforma buscas de pais preocupados em contatos qualificados (WhatsApp + teleconsulta), com blog autogerido pela Stella para tráfego orgânico contínuo.
**For:** Pais de crianças de 1–7 anos em São Gabriel do Oeste/MS e região (local) e em todo o Brasil (teleconsulta); Stella como administradora não técnica.
**Solves:** Stella depende exclusivamente do Instagram — sem canal próprio de captação, sem posicionamento no Google, sem estrutura organizada de teleconsulta.

## Goals

- Gerar contatos qualificados: baseline no mês 1, +20%/mês nos meses 2–3 (cliques WhatsApp + agendamentos Cal.com)
- Primeira página do Google para "fonoaudióloga infantil São Gabriel do Oeste" em 3 meses (Search Console)
- Stella publica ≥2 artigos/mês sozinha pelo painel, em <15 min por artigo, inclusive do celular
- Agenda de teleconsulta ativa com primeiros agendamentos no mês 1

## Tech Stack

**Core:**

- Framework: Next.js (App Router) + Tailwind CSS
- Linguagem: TypeScript
- Banco/Auth/Storage: Supabase (free tier, RLS ativo)

**Key dependencies:** Cal.com (embed de agendamento), Vercel (hosting + Analytics ou Umami), next/image, editor rich text (a definir no design — ex.: Tiptap)

## Scope

**v1 includes:**

- Landing page de conversão (hero, sobre, sinais de alerta por idade, depoimentos, FAQ, CTAs WhatsApp)
- Botão flutuante de WhatsApp em todas as páginas com rastreamento de origem
- Página /teleconsulta com Cal.com embutido
- Blog público (/blog) com SSG/ISR, URLs amigáveis, schema Article
- Painel /admin (Supabase Auth restrito ao e-mail da Stella): CRUD de artigos, editor rico mobile, campos SEO, rascunho/publicado
- SEO técnico: sitemap, robots, schema LocalBusiness/FAQPage/Article, Open Graph
- Analytics de eventos (cliques WhatsApp por seção) + Google Search Console

**Explicitly out of scope (backlog V2):**

- Pagamento online antecipado (Pix/cartão) no agendamento
- Quiz interativo de marcos de desenvolvimento
- Dashboard de métricas no painel
- Newsletter / captura de e-mail
- Materiais ricos para download (e-books, checklists)

## Constraints

- Timeline: sem prazo crítico — projeto pessoal em fluxo contínuo; escopo do MVP fechado (adições vão para V2)
- Técnico: free tier Supabase/Vercel; LCP <2,5s mobile 4G; mobile-first (80%+ tráfego mobile); conteúdo público 100% estático (SSG/ISR)
- Legal/ético: LGPD (nenhum dado de criança coletado; depoimentos com nome abreviado e consentimento; aviso de privacidade sobre Cal.com) + Código de Ética CFFa (sem promessa de resultado, sem antes/depois, CRFa visível)
- Pendências (PRD §8): domínio (D1), identidade visual (D2), conteúdos da Stella (D3/D4), validação do free tier Cal.com (D5)
