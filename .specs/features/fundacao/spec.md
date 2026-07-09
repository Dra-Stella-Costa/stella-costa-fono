# Fundação Técnica — Specification

## Problem Statement

Nenhuma feature pode ser construída sem o projeto base: app Next.js deployado, identidade visual traduzida em tokens, banco Supabase com schema e segurança, e o esqueleto de layout compartilhado por todas as páginas. Esta feature resolve as pendências D2 (identidade visual) do PRD.

## Goals

- [ ] App Next.js (App Router, TypeScript, Tailwind) deployado na Vercel com HTTPS
- [ ] Identidade visual definida e aplicada como tokens do Tailwind (paleta, tipografia)
- [ ] Supabase provisionado: tabelas `articles`, `testimonials`, `faqs` com RLS ativo e bucket de Storage
- [ ] Layout base (header, footer, botão WhatsApp flutuante, 404) reutilizado por todas as rotas

## Out of Scope

- Conteúdo real das seções (features landing-page/blog)
- Registro de domínio (feature lancamento, D1)
- Autenticação do painel (feature painel-admin)

---

## User Stories

### P1: Projeto deployado e estilizado ⭐ MVP

**User Story**: Como Leonardo, quero o esqueleto do site no ar com a identidade visual aplicada, para construir as features sobre uma base estável.

**Why P1**: Pré-requisito de todo o resto.

**Acceptance Criteria**:

1. WHEN um commit chega à branch principal THEN a Vercel SHALL fazer deploy automático com HTTPS
2. WHEN qualquer página é renderizada THEN ela SHALL usar os tokens de paleta e tipografia definidos no Tailwind config (nenhuma cor/fonte hardcoded fora dos tokens)
3. WHEN a home é acessada em mobile 4G THEN o LCP SHALL ser <2,5s (base vazia deve sobrar folga)

**Independent Test**: Acessar URL vercel.app, ver página estilizada com a identidade, Lighthouse mobile ≥90 em performance.

---

### P1: Banco seguro no Supabase ⭐ MVP

**User Story**: Como Leonardo, quero o schema com Row Level Security desde o início, para que a segurança não seja retrofit.

**Why P1**: LGPD e RF-11/RLS são Must Have; retrofit de RLS é arriscado.

**Acceptance Criteria**:

1. WHEN um cliente anônimo consulta `articles` THEN o Supabase SHALL retornar apenas registros com status `published`
2. WHEN um cliente anônimo tenta INSERT/UPDATE/DELETE em qualquer tabela THEN o Supabase SHALL negar a operação
3. WHEN o usuário autenticado com o e-mail da Stella escreve em `articles`, `testimonials` ou `faqs` THEN o Supabase SHALL permitir
4. WHEN qualquer outro usuário autenticado tenta escrever THEN o Supabase SHALL negar

**Independent Test**: Rodar queries com anon key (leitura ok de publicados, escrita negada) e com sessão da Stella (escrita ok).

---

### P1: Layout base com WhatsApp flutuante ⭐ MVP

**User Story**: Como visitante mobile, quero acionar o WhatsApp de qualquer ponto do site, para não procurar o contato. (US-06)

**Why P1**: RF-02 é Must Have e o botão é o principal mecanismo de conversão.

**Acceptance Criteria**:

1. WHEN qualquer página pública é exibida THEN o botão flutuante de WhatsApp SHALL estar visível e fixo
2. WHEN o botão é clicado THEN o sistema SHALL abrir wa.me com mensagem pré-preenchida "Olá, vim pelo site..." incluindo identificador de origem (página/seção)
3. WHEN uma rota inexistente é acessada THEN o sistema SHALL exibir 404 personalizada com CTA de retorno à home (RF-07)

**Independent Test**: Navegar por 3 rotas + uma inválida; botão presente em todas; clique abre WhatsApp com mensagem e origem corretas.

---

### P2: Identidade visual documentada

**User Story**: Como Leonardo, quero a paleta, tipografia e logo documentadas, para manter consistência em site, painel e materiais.

**Why P2**: O MVP funciona com tokens definidos; a documentação formal pode evoluir.

**Acceptance Criteria**:

1. WHEN a identidade for definida THEN o repositório SHALL conter um doc com paleta (hex), tipografia (famílias/pesos) e uso do logo
2. WHEN os tokens mudarem THEN o doc SHALL ser atualizado na mesma alteração

**Independent Test**: Doc existe e bate com o tailwind.config.

---

## Edge Cases

- WHEN o Supabase estiver indisponível THEN as páginas públicas (estáticas) SHALL continuar servindo o último build
- WHEN variáveis de ambiente faltarem no build THEN o build SHALL falhar com mensagem clara (não deployar quebrado)

---

## Success Criteria

- [ ] Deploy verde na Vercel com identidade aplicada
- [ ] Testes de RLS passando (anon não escreve; Stella escreve; anon só lê publicados)
- [ ] Botão WhatsApp funcional em todas as rotas, incluindo 404
