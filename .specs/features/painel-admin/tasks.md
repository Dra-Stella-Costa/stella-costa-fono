# Painel Administrativo — Tasks

**Design**: `.specs/features/painel-admin/design.md`
**Status**: Done (2026-07-10) — T1–T19 concluídos e verificados (F3: CHK-120 PASS, CHK-110..115
PASS, RLS 42501 nas 3 tabelas para anon). Pendências operacionais do T20 (Leonardo no dashboard
Supabase): criar usuária `drastellacosta@gmail.com`, desabilitar signup, religar Confirm email,
apagar usuários de teste (B-004). Teste ponta a ponta com a Stella (celular, <15 min) = MANUAL.

---

## Execution Plan

```
Fase 1 fundação (seq):    T1 → T2 → T3 → T4
Fase 2 auth (seq):        T5 → T6 → T7
Fase 3 artigos (par/seq): T8 → T9..T12 [P] → T13 → T14
Fase 4 P2 (par):          T15 [P] T16 [P] → T17
Fase 5 validação (seq):   T18 → T19 → T20
```

## Task Breakdown

- **T1 Dependências** — `@supabase/ssr`, Tiptap (`react`, `pm`, `starter-kit`, ext. `link`/`image`/`placeholder`). Done when: install + build verdes.
- **T2 `lib/sanitize.ts`** — extrair `SANITIZE_OPTS` do blog; blog importa de lá. Done when: build verde, HTML do artigo de exemplo inalterado.
- **T3 `STELLA_EMAIL`** em `lib/site.ts` (espelho do `is_stella()`).
- **T4 Clients ssr** — `lib/supabase/server.ts` (cookies) + `lib/supabase/browser.ts` (singleton).
- **T5 `middleware.ts`** — renova sessão; `/admin/*` sem sessão ou e-mail ≠ Stella → `/admin/login` (exceto login/atualizar-senha). Done when: GET /admin anônimo redireciona (fecha CHK-120).
- **T6 Login + recuperação** — `app/admin/login/page.tsx` (signInWithPassword, resetPasswordForEmail, erros pt-BR).
- **T7 Atualizar senha** — `app/admin/atualizar-senha/page.tsx` (updateUser via link de recovery).
- **T8 `app/admin/layout.tsx`** — guarda (sessão + e-mail), nav mobile-first, noindex, sair.
- **T9 [P] Actions de artigos** — `app/admin/artigos/actions.ts`: salvar (upsert rascunho), publicar (valida título/slug, seta `published_at` na 1ª vez), despublicar, excluir; revalidam `/blog`, `/blog/[slug]`, `/sitemap.xml`.
- **T10 [P] `UploadImagem`** — resize canvas (máx 1600px, WebP ~0.8) + upload bucket `media`; retry em falha.
- **T11 [P] `EditorArtigo`** — Tiptap HTML, toolbar mobile (b/i/H2/H3/listas/link/imagem).
- **T12 [P] `PreviewCompartilhamento`** — card WhatsApp/Google com fallbacks reais do metadata do blog.
- **T13 `FormArtigo`** — título→slug auto (editável, colisão bloqueia), resumo/meta/capa, autosave localStorage, ações com confirm de exclusão.
- **T14 Páginas de artigos** — `app/admin/page.tsx` (lista com badges) + `artigos/novo` + `artigos/[id]`.
- **T15 [P] Depoimentos CRUD** — página + actions (lembrete LGPD no form), revalida `/`.
- **T16 [P] FAQ CRUD** — página + actions com reordenar (`sort_order` ↑↓), revalida `/`.
- **T17 Landing lê do banco** — `Depoimentos.tsx`/`Faq.tsx` com dados publicados do Supabase (fallback: comportamento gated atual com 0 linhas); home `revalidate = 60`; registrar **AD-008** no STATE.
- **T18 Build + smoke local** — build verde; /admin redireciona; login renderiza.
- **T19 Loop PRD F3** — CHK-120 PASS; RLS negativo (anon INSERT falha) já coberto pelos testes da fundação; sem regressão no blog.
- **T20 Deploy + operacional + estado** — push; checklist para Leonardo no dashboard Supabase: criar usuária `drastellacosta@gmail.com`, desabilitar signup, religar Confirm email, apagar usuários de teste (B-004). Atualizar ROADMAP/STATE. Teste ponta a ponta com a Stella (celular, <15 min) fica MANUAL.
