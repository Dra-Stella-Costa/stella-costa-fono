# Blog Público — Tasks

**Design**: `.specs/features/blog-publico/design.md`
**Status**: Done (2026-07-10) — T1–T12, T14 e T15 concluídos; do T13 falta só o artigo de teste
(envs confirmadas na Vercel; INSERT depende do SQL editor do Supabase — CLI sem link).
Com o artigo de teste no banco, re-verificar CHK-111..114 (hoje WARN).

---

## Execution Plan

```
Fase 1 (sequencial):   T1 → T2 → T3
Fase 2 (paralelo):     T4 [P]  T5 [P]  T6 [P]  T7 [P]  T8 [P]  T9 [P]
Fase 3 (integração):   T10 → T11 → T12
Fase 4 (validação):    T13 → T14 → T15
```

---

## Task Breakdown

### T1: Instalar dependências

**What**: `@supabase/supabase-js`, `sanitize-html` + `@types/sanitize-html`, `@tailwindcss/typography`.
**Where**: `package.json`
**Depends on**: None
**Done when**:

- [ ] `npm install` sem erro e `npm run build` continua verde (TS pinado em ^5 — L-001)

---

### T2: Cliente Supabase

**What**: Singleton anon, sem persistência de sessão; env ausente lança erro apontando a variável.
**Where**: `lib/supabase.ts` (novo)
**Depends on**: T1
**Done when**:

- [ ] `import { supabase }` funciona em server component; sem `NEXT_PUBLIC_SUPABASE_URL` o build falha com mensagem clara

---

### T3: Camada de dados do blog

**What**: Tipos `Article`/`ArticleResumo` + `getPublishedArticles()` + `getArticleBySlug()`.
**Where**: `lib/blog.ts` (novo)
**Depends on**: T2
**Done when**:

- [ ] Listagem ordenada por `published_at desc`, só campos do resumo; slug inexistente retorna `null` (sem throw)

---

### T4: Host do Storage no next/image [P]

**What**: `images.remotePatterns` para `odanxowwlxijkugpfxhv.supabase.co`.
**Where**: `next.config.ts`
**Depends on**: T1
**Done when**:

- [ ] `next/image` aceita URL de capa do bucket `media` sem erro de host

---

### T5: Tipografia do artigo [P]

**What**: `@plugin "@tailwindcss/typography"` + ajustes `prose` com a paleta v2.0 (links coral, headings petróleo, Baloo 2).
**Where**: `app/globals.css`
**Depends on**: T1
**Done when**:

- [ ] Classe `prose` disponível e alinhada à identidade (conferir contra tokens existentes)

---

### T6: ArticleCard [P]

**What**: Card de listagem (capa com fallback, título, resumo, data pt-BR) linkando `/blog/[slug]`.
**Where**: `components/blog/ArticleCard.tsx` (novo)
**Depends on**: T3
**Reuses**: linguagem visual de `components/landing/Depoimentos.tsx`
**Done when**:

- [ ] Renderiza com e sem `cover_url`/`excerpt`; `next/image` com `sizes`

---

### T7: SchemaArticle [P]

**What**: JSON-LD `Article` (headline, image, datas, author Person, mainEntityOfPage).
**Where**: `components/blog/SchemaArticle.tsx` (novo)
**Depends on**: T3
**Reuses**: padrão de `components/landing/SchemaLocalBusiness.tsx`
**Done when**:

- [ ] JSON-LD válido no [validator.schema.org](https://validator.schema.org) para o artigo de teste

---

### T8: CompartilharArtigo [P] (P2)

**What**: Client component — Web Share API; fallback WhatsApp + copiar link.
**Where**: `components/blog/CompartilharArtigo.tsx` (novo)
**Depends on**: T1
**Done when**:

- [ ] Com `navigator.share`: abre share sheet; sem: mostra botões WhatsApp/copiar; "copiado" tem feedback visual

---

### T9: Link Blog no Header [P]

**What**: Item "Blog" na navegação.
**Where**: `components/Header.tsx`
**Depends on**: None
**Done when**:

- [ ] Link visível no desktop e mobile, apontando para `/blog`

---

### T10: Listagem /blog

**What**: Página com ISR 60s, metadata + canônica, estado vazio amigável (CTA `blog:vazio`), grid de cards.
**Where**: `app/blog/page.tsx` (novo)
**Depends on**: T3, T6
**Done when**:

- [ ] Com 0 artigos: estado vazio (não erro); com N: cards do mais recente ao mais antigo

---

### T11: Página do artigo /blog/[slug]

**What**: ISR 60s, `generateStaticParams` + `dynamicParams = true`, `generateMetadata` (meta/OG/canônica com fallbacks), conteúdo sanitizado (`sanitize-html` allowlist), SchemaArticle, CompartilharArtigo, CTA `blog:[slug]`, `notFound()` para null.
**Where**: `app/blog/[slug]/page.tsx` (novo)
**Depends on**: T3, T5, T7, T8
**Done when**:

- [ ] Artigo de teste renderiza completo; slug inexistente → 404; OG com capa (fallback foto institucional)

---

### T12: Sitemap com artigos

**What**: `sitemap()` async concatenando slugs publicados (`lastModified = updated_at`) + entrada `/blog`.
**Where**: `app/sitemap.ts`
**Depends on**: T3
**Done when**:

- [ ] `/sitemap.xml` lista home, teleconsulta, /blog e cada artigo publicado

---

### T13: Envs na Vercel + artigo de teste

**What**: Confirmar `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY` no painel Vercel (`vercel env ls` — lembrar L-003: valores mascarados, conferir existência/escopo). Inserir 1 artigo de teste publicado via SQL (dashboard Supabase ou CLI).
**Where**: Vercel + Supabase
**Depends on**: T2
**Done when**:

- [ ] Envs presentes em Production; artigo de teste visível em `/blog` local

---

### T14: Verificação PRD

**What**: Rodar o loop de verificação (skill `prd-verification-loop`) cobrindo os checks do blog; estender `verify.mjs` se os CHKs do blog ainda não existirem.
**Where**: `verify.mjs` / skill
**Depends on**: T10, T11, T12, T13
**Tools**: Skill `prd-verification-loop`
**Done when**:

- [ ] Loop reporta PASS nos checks do blog (JSON-LD, OG, canônica, 404 de rascunho, sitemap)

---

### T15: Deploy + validação em produção + estado

**What**: Commit/push (deploy automático), validar `/blog` e artigo em produção, despublicar/apagar artigo de teste, atualizar `ROADMAP.md`/`STATE.md`.
**Where**: git / produção / `.specs/project/`
**Depends on**: T14
**Done when**:

- [ ] `/blog` no ar com estado vazio limpo; ROADMAP marca blog-publico DONE; STATE aponta próximo passo (painel-admin)

---

## Task Granularity Check

| Task | Scope | Status |
| --- | --- | --- |
| T1–T9 | 1 arquivo/comando cada | ✅ |
| T10–T12 | 1 página/arquivo cada | ✅ |
| T13–T15 | operacionais, 1 objetivo cada | ✅ |
