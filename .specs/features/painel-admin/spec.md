# Painel Administrativo — Specification

## Problem Statement

Stella é usuária não técnica; se depender de terceiros para publicar, o blog morre (risco R2, severidade alta). Ela precisa escrever, ilustrar e publicar um artigo sozinha, do celular, em menos de 15 minutos. Cobre US-10 a US-12 e RF-11 a RF-17.

## Goals

- [ ] Stella publica um artigo completo sozinha, do celular, em <15 min
- [ ] Acesso restrito exclusivamente ao e-mail dela (RLS + Auth)
- [ ] Depoimentos e FAQ editáveis sem deploy

## Out of Scope

- Dashboard de métricas (V2, RF-18)
- Múltiplos usuários/papéis
- Agendamento de publicação futura (avaliar V2)

---

## User Stories

### P1: Login seguro ⭐ MVP

**User Story**: Como Stella, quero fazer login em uma área restrita, para gerenciar meus artigos com segurança. (US-10)

**Why P1**: Porta de entrada do painel; segurança é Must Have.

**Acceptance Criteria**:

1. WHEN Stella acessa /admin sem sessão THEN o sistema SHALL exibir tela de login (e-mail/senha via Supabase Auth)
2. WHEN credenciais corretas são enviadas THEN o sistema SHALL criar sessão persistente (sobrevive a fechar o navegador)
3. WHEN qualquer e-mail diferente do de Stella tenta logar ou acessar rotas /admin THEN o sistema SHALL negar acesso
4. WHEN Stella solicita recuperação de senha THEN o sistema SHALL enviar e-mail de redefinição funcional

**Independent Test**: Logar com e-mail dela (ok), com outro e-mail (negado), recuperar senha ponta a ponta.

---

### P1: CRUD de artigos com editor rico ⭐ MVP

**User Story**: Como Stella, quero escrever, salvar rascunho, publicar e editar artigos em um editor simples, para manter o blog ativo sem ajuda técnica. (US-11)

**Why P1**: Núcleo da autonomia dela; RF-12/13/14 Must Have.

**Acceptance Criteria**:

1. WHEN Stella cria um artigo THEN o editor SHALL oferecer negrito, itálico, títulos, listas, links e imagens
2. WHEN Stella insere uma imagem THEN o sistema SHALL fazer upload ao Supabase Storage com redimensionamento automático (limite de largura/peso definido no design)
3. WHEN Stella salva THEN o artigo SHALL persistir como rascunho, invisível no site público
4. WHEN Stella publica THEN o artigo SHALL aparecer no site (ver blog-publico: revalidação ≤60s)
5. WHEN Stella despublica ou exclui THEN o artigo SHALL sumir do site e a exclusão SHALL pedir confirmação
6. WHEN o painel é usado em tela de celular THEN todas as ações acima SHALL ser executáveis sem quebra de layout (RF-16)

**Independent Test**: Ciclo completo rascunho→publicar→editar→despublicar→excluir, executado num smartphone.

---

### P1: Campos de SEO por artigo ⭐ MVP

**User Story**: Como Stella, quero definir título, imagem de capa e resumo, para o artigo aparecer bem no Google e ao compartilhar. (US-12)

**Why P1**: Sem isso o blog não cumpre a função de SEO (RF-15 Must Have).

**Acceptance Criteria**:

1. WHEN Stella digita o título THEN o sistema SHALL gerar slug automaticamente, editável antes de publicar
2. WHEN o slug editado colidir com um existente THEN o sistema SHALL avisar e impedir a publicação
3. WHEN Stella preenche resumo/meta description e capa THEN o sistema SHALL exibir pré-visualização de como ficará o compartilhamento (card estilo WhatsApp/Google)
4. WHEN campos obrigatórios (título, slug) faltarem THEN o sistema SHALL impedir publicação com mensagem clara (rascunho pode salvar incompleto)

**Independent Test**: Criar artigo, editar slug, ver preview, tentar publicar sem título (bloqueado).

---

### P2: Gestão de depoimentos e FAQ

**User Story**: Como Stella, quero gerenciar depoimentos e perguntas do FAQ pelo painel, para atualizar o site sem depender do Leonardo. (RF-17)

**Why P2**: Should Have; no lançamento podem ser cadastrados via seed.

**Acceptance Criteria**:

1. WHEN Stella cria/edita/remove um depoimento (nome abreviado, cidade, texto) THEN a landing SHALL refletir em ≤60s
2. WHEN Stella cria/edita/reordena perguntas do FAQ THEN a landing e o schema FAQPage SHALL refletir em ≤60s
3. WHEN um depoimento é criado THEN o formulário SHALL exibir lembrete de consentimento do responsável (LGPD)

**Independent Test**: Alterar um depoimento no painel e ver na landing sem deploy.

---

## Edge Cases

- WHEN a sessão expirar durante a escrita THEN o sistema SHALL preservar o conteúdo não salvo (autosave local ou aviso antes de perder)
- WHEN o upload de imagem falhar (rede móvel instável) THEN o editor SHALL manter o texto e permitir nova tentativa
- WHEN uma imagem exceder o tamanho máximo THEN o sistema SHALL redimensionar ou rejeitar com mensagem clara
- WHEN Stella abrir o mesmo artigo em duas abas THEN a última gravação SHALL prevalecer sem corromper o conteúdo (documentar comportamento)

---

## Success Criteria

- [ ] Teste com a própria Stella: artigo real publicado do celular em <15 min sem ajuda
- [ ] Nenhuma rota/ação de escrita acessível fora do e-mail dela (verificado também no nível RLS)
- [ ] Diretriz editorial (ética CFFa) entregue junto com o acesso ao painel
