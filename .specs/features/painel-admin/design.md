# Painel Administrativo — Design

**Spec**: `.specs/features/painel-admin/spec.md`
**Status**: Draft

---

## Architecture Overview

Painel em `/admin/*` no mesmo app Next. Sessão por cookie com `@supabase/ssr`: o middleware
renova a sessão e redireciona anônimos para `/admin/login`; o layout do admin nega qualquer
e-mail ≠ Stella. **A segurança real é o RLS** (`is_stella()`, migration 0001, já testado) —
middleware e layout são conveniência de UX; mesmo burlados, o banco recusa a escrita.

Escritas via **Server Actions** com o client de cookies (o JWT da Stella vai na chamada, o RLS
decide). Publicar/despublicar/excluir chama `revalidatePath` — o site público reflete na hora,
melhor que os ≤60s do ISR.

```mermaid
graph TD
    A[Stella no celular] --> B[middleware /admin/*]
    B -- sem sessão --> C[/admin/login]
    B -- sessão ok --> D[/admin artigos]
    D --> E[FormArtigo + EditorArtigo Tiptap]
    E -- upload capa/imagem --> F[redimensiona no browser → Storage media]
    E -- salvar/publicar --> G[Server Action c/ sessão]
    G --> H[(Supabase RLS is_stella)]
    G -- revalidatePath /blog, /blog/slug, / --> I[Site público]
```

---

## Code Reuse Analysis

### Existing Components to Leverage

| Component | Location | How to Use |
| --- | --- | --- |
| Tabelas `articles`/`testimonials`/`faqs` + RLS + bucket `media` | `supabase/migrations/0001` | Prontas — **zero migration nova**. Storage já restringe escrita à Stella |
| Tipo `Article` | `lib/blog.ts` | Base do tipo de edição (admin enxerga também `status`) |
| `SANITIZE_OPTS` | `app/blog/[slug]/page.tsx` | Extrair para `lib/sanitize.ts` e reusar no preview do painel |
| Botões/tokens v2.0 | `Header.tsx`, `app/page.tsx` | Mesma linguagem visual nos forms (coral primário, contorno petróleo) |
| `whatsappLink`, `SITE_URL` | `lib/site.ts` | Preview de compartilhamento usa a URL canônica real |

### Integration Points

| System | Integration Method |
| --- | --- |
| Supabase Auth | E-mail/senha; usuária criada **manualmente no dashboard** (signup público desabilitado — operacional, junto com religar "Confirm email", B-004). Recuperação de senha nativa com `redirectTo` `/admin/atualizar-senha` |
| blog-publico | `revalidatePath('/blog')`, `/blog/[slug]` e `/sitemap.xml` ao mudar status — fecha o gancho previsto no design do blog |
| Landing (P2) | `Depoimentos.tsx`/`Faq.tsx` passam a ler do Supabase (linhas `published = true`, ISR 60s). **Conteúdo do banco = validado pela Stella** → renderiza em produção e resolve o gate AD-006 para essas duas seções (sinais de alerta seguem estáticos/gated — conteúdo clínico) |
| robots.txt | `/admin` já bloqueado (CHK-181) — nada a fazer |

---

## Components

### `lib/supabase/server.ts` + `lib/supabase/browser.ts` + `middleware.ts`

- **Purpose**: Trio padrão `@supabase/ssr` — client de Server Component/Action (cookies), client de browser, e middleware que renova sessão e protege `/admin/*` (exceto `/admin/login` e `/admin/atualizar-senha`).
- **Interfaces**: `createClient()` em cada contexto; `STELLA_EMAIL` em `lib/site.ts` (espelho do `is_stella()` — trocar e-mail = mudar nos dois).
- **Reuses**: `lib/supabase.ts` (anon, site público) permanece intocado.

### `app/admin/layout.tsx`

- **Purpose**: Guarda de sessão + e-mail (redireciona ≠ Stella para login com aviso) e navegação mobile-first (Artigos · Depoimentos · FAQ · Sair). `metadata: { robots: noindex }`.

### `app/admin/login/page.tsx`

- **Purpose**: Login e-mail/senha + "esqueci a senha" (`resetPasswordForEmail`). Client component; erros em pt-BR amigável.

### `app/admin/atualizar-senha/page.tsx`

- **Purpose**: Destino do e-mail de recuperação; `updateUser({ password })` com a sessão temporária do link.

### `app/admin/page.tsx`

- **Purpose**: Lista de artigos (todos os status — a sessão da Stella enxerga rascunhos via RLS) com badge rascunho/publicado, editar, novo.

### `app/admin/artigos/novo/page.tsx` e `app/admin/artigos/[id]/page.tsx`

- **Purpose**: Criar/editar — ambos renderizam `FormArtigo`.

### `components/admin/FormArtigo.tsx` (client)

- **Purpose**: Orquestra o formulário: título → slug automático (editável até a 1ª publicação), resumo, meta description, capa, editor, ações (salvar rascunho / publicar / despublicar / excluir com `confirm`).
- **Comportamentos**: publicar exige título+slug (rascunho salva incompleto); colisão de slug → aviso e bloqueio (pré-checagem + fallback no erro da constraint unique); **autosave em localStorage** por artigo (recupera se a sessão cair — edge case do spec); última gravação prevalece (documentado).
- **Reuses**: server actions de `actions.ts`.

### `components/admin/EditorArtigo.tsx` (client)

- **Purpose**: Tiptap (StarterKit + Link + Image + Placeholder) emitindo HTML — o mesmo formato que o blog sanitiza e renderiza. Toolbar mínima e mobile: negrito, itálico, H2/H3, listas, link, imagem.
- **Dependencies**: `@tiptap/react`, `@tiptap/starter-kit`, extensões link/image/placeholder.

### `components/admin/UploadImagem.tsx` (client)

- **Purpose**: Upload de capa e de imagens do corpo: redimensiona **no browser** (canvas, máx. 1600px, WebP qualidade ~0.8 — sem função server, free tier) e sobe ao bucket `media` (`artigos/{uuid}.webp`) com o client autenticado. Falha de rede → mantém estado e oferece nova tentativa.

### `components/admin/PreviewCompartilhamento.tsx`

- **Purpose**: Card estilo WhatsApp/Google com capa, título (meta_title ∥ title), descrição e URL — espelha os fallbacks reais do `generateMetadata` do blog.

### `app/admin/artigos/actions.ts` (Server Actions)

- **Interfaces**: `salvarArtigo(dados) → {id}` (upsert rascunho) · `publicarArtigo(id)` · `despublicarArtigo(id)` · `excluirArtigo(id)` — as três últimas revalidam `/blog`, `/blog/[slug]` e `/sitemap.xml`. `publicarArtigo` seta `published_at` na primeira publicação.

### P2 — `app/admin/depoimentos/` e `app/admin/faq/` (+ `actions.ts` de cada)

- **Purpose**: CRUD simples (sem editor rico): depoimento = nome abreviado/cidade/texto + **lembrete LGPD de consentimento no form**; FAQ = pergunta/resposta + reordenar (`sort_order`, botões ↑↓). Ações revalidam `/`.

### P2 — `components/landing/Depoimentos.tsx` e `Faq.tsx` (alteração)

- **Purpose**: Lerem do Supabase (`published = true`, ordem `sort_order`); com 0 linhas no banco, mantêm o comportamento atual (rascunho gated / seção oculta). Home ganha `revalidate = 60`.

---

## Data Models

Tabelas existentes; tipos de edição no admin:

```typescript
// lib/admin/tipos.ts
interface ArtigoEditavel extends Omit<Article, "updated_at"> {
  status: "draft" | "published";
}
interface Depoimento { id: string; author_name: string; city: string | null; quote: string; sort_order: number; published: boolean; }
interface Faq { id: string; question: string; answer: string; sort_order: number; published: boolean; }
```

---

## Error Handling Strategy

| Error Scenario | Handling | User Impact |
| --- | --- | --- |
| Credencial errada / e-mail ≠ Stella | Mensagem única "e-mail ou senha inválidos" (não vaza qual campo) | Fica no login |
| Sessão expira escrevendo | Middleware redireciona no próximo request; autosave local preserva o texto | Reloga e recupera o rascunho |
| Upload falha (rede móvel) | Estado do form intacto; botão "tentar de novo" | Não perde o artigo |
| Imagem gigante | Redimensionada no browser antes do upload; formato não suportado → mensagem clara | Nunca sobe arquivo pesado |
| Slug duplicado | Pré-checagem no blur + captura do erro da unique constraint | Aviso e publicação bloqueada |
| Escrita negada (RLS) | Action devolve erro legível | "Sem permissão — confira o login" |
| Publicar sem título/slug | Validação na action (não só no client) | Botão explica o que falta |

---

## Tech Decisions (only non-obvious ones)

| Decision | Choice | Rationale |
| --- | --- | --- |
| Sessão | `@supabase/ssr` (cookies) e não localStorage | Server Actions e middleware precisam da sessão no server; sobrevive a fechar navegador (AC2) |
| Escritas | Server Actions com o JWT da sessão | RLS continua sendo a única autoridade; zero API routes próprias |
| Editor | Tiptap | Já apontado no PROJECT.md; HTML compatível com o render sanitizado do blog; bom no mobile |
| Redimensionar imagem | Canvas no browser (não Sharp/server) | Free tier sem função de servidor; celular aguenta 1600px |
| Revalidação | `revalidatePath` nas actions | Publicação instantânea no site (supera o AC de ≤60s) e destrava o gancho do blog-publico |
| Gate de conteúdo (P2) | Depoimentos/FAQ do banco renderizam em produção | Cadastro via painel = validação da Stella; o gate AD-006 fica restrito aos textos estáticos (sinais/teleconsulta). Registrar como AD-008 ao implementar |
| Signup | Desabilitado no dashboard; usuária criada manualmente | Painel de usuária única; menos superfície. Junto: religar "Confirm email" e apagar usuários de teste (B-004) |
