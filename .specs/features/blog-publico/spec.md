# Blog Público — Specification

## Problem Statement

Mães pesquisam dúvidas específicas no Google ("meu filho de 2 anos não fala"). Artigos que respondem essas dúvidas geram tráfego orgânico qualificado nacional e apresentam a profissional. Cobre US-09 e RF-04, RF-05 (parte artigos), RF-06 (Article), RF-09.

## Goals

- [ ] Artigos publicados no painel aparecem no site em URL amigável, indexáveis
- [ ] Cada artigo converte: CTA de WhatsApp ao final com origem rastreada
- [ ] Compartilhamento no WhatsApp/Instagram exibe preview correto (Open Graph)

## Out of Scope

- Painel de escrita (feature painel-admin)
- Comentários, busca interna, categorias/tags (avaliar em V2)
- Newsletter (V2)

---

## User Stories

### P1: Página de artigo otimizada ⭐ MVP

**User Story**: Como mãe pesquisando no Google, quero encontrar um artigo que responda minha dúvida específica, para me orientar e conhecer a profissional. (US-09)

**Why P1**: É o motor de aquisição orgânica do projeto.

**Acceptance Criteria**:

1. WHEN um artigo publicado é acessado em /blog/[slug] THEN o sistema SHALL renderizar título, capa, conteúdo formatado e data, de forma estática (SSG/ISR)
2. WHEN a página é renderizada THEN o HTML SHALL conter meta title, meta description, Open Graph (título, descrição, imagem de capa), URL canônica e JSON-LD Article válido
3. WHEN o leitor chega ao fim do artigo THEN o sistema SHALL exibir CTA de WhatsApp com origem "blog:[slug]"
4. WHEN um artigo em rascunho ou despublicado é acessado por URL direta THEN o sistema SHALL retornar 404

**Independent Test**: Publicar artigo de teste; acessar URL, validar JSON-LD e OG no debugger; despublicar e ver 404.

---

### P1: Listagem do blog ⭐ MVP

**User Story**: Como visitante, quero navegar pelos artigos disponíveis, para explorar os temas.

**Why P1**: Porta de entrada do conteúdo; sem listagem não há navegação interna.

**Acceptance Criteria**:

1. WHEN /blog é acessado THEN o sistema SHALL listar apenas artigos publicados, do mais recente ao mais antigo, com capa, título e resumo
2. WHEN não houver artigos publicados THEN a página SHALL exibir estado vazio amigável (não erro)
3. WHEN um card é clicado THEN o sistema SHALL navegar para /blog/[slug]

**Independent Test**: Com 0 e com N artigos, listagem se comporta corretamente.

---

### P1: Revalidação ao publicar ⭐ MVP

**User Story**: Como Stella, quero que meu artigo apareça no site logo após publicar, para compartilhar imediatamente no Instagram.

**Why P1**: SSG sem revalidação quebraria o fluxo de publicação autônoma.

**Acceptance Criteria**:

1. WHEN um artigo é publicado/editado/despublicado no painel THEN o site SHALL refletir a mudança em no máximo 60s (ISR on-demand ou revalidação curta)
2. WHEN um artigo novo é publicado THEN ele SHALL constar no sitemap.xml na próxima geração

**Independent Test**: Publicar no painel e recarregar /blog em até 60s.

---

### P2: Compartilhamento social

**User Story**: Como leitor, quero compartilhar o artigo no WhatsApp, para enviar a outros pais. (RF-09)

**Why P2**: Should Have; amplifica alcance mas não bloqueia lançamento.

**Acceptance Criteria**:

1. WHEN o leitor toca em compartilhar THEN o sistema SHALL oferecer WhatsApp e copiar link (Web Share API quando disponível, fallback para botões)
2. WHEN o link é colado no WhatsApp THEN o preview SHALL exibir capa, título e resumo corretos

**Independent Test**: Compartilhar em um aparelho real e conferir o preview.

---

## Edge Cases

- WHEN o slug contiver caracteres inválidos/duplicados THEN a geração SHALL sanitizar e garantir unicidade (responsabilidade compartilhada com painel-admin)
- WHEN o artigo não tiver imagem de capa THEN o OG SHALL usar imagem padrão do site
- WHEN o conteúdo contiver imagem quebrada THEN o layout SHALL degradar sem quebrar (alt text)

---

## Success Criteria

- [ ] Artigo de teste indexável: Article e OG válidos, canônica correta, no sitemap
- [ ] Publicação reflete no site em ≤60s sem deploy manual
- [ ] CTA final dispara evento com slug de origem
