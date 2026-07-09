# Lançamento — Specification

## Problem Statement

O go-live depende de itens fora do código: domínio (D1), conteúdo real da Stella (D3/D4), Google Business Profile e verificações finais de qualidade/conformidade. Esta feature agrupa esses critérios para que o lançamento seja um checklist verificável, não um evento improvisado.

## Goals

- [ ] Site no ar no domínio definitivo com conteúdo 100% real (zero placeholder)
- [ ] Conformidade verificada: LGPD, ética CFFa, Core Web Vitals, schema
- [ ] Stella equipada para operar sozinha (acesso, diretriz editorial, 5 pautas)

## Out of Scope

- Qualquer item do backlog V2
- Campanhas de tráfego pago

---

## User Stories

### P1: Go-live no domínio definitivo ⭐ MVP

**User Story**: Como Leonardo, quero o site publicado no domínio próprio com HTTPS e redirecionamentos corretos, para iniciar a captação e o SEO.

**Why P1**: Sem domínio não há lançamento nem Search Console definitivo.

**Acceptance Criteria**:

1. WHEN o domínio for decidido (D1) e registrado THEN a Vercel SHALL servir o site nele com HTTPS
2. WHEN variações (www/apex) forem acessadas THEN o sistema SHALL redirecionar 301 para a URL canônica
3. WHEN o domínio estiver ativo THEN o Search Console SHALL ser migrado/verificado nele

**Independent Test**: Acessar apex e www; ambos resolvem com HTTPS na canônica.

---

### P1: Conteúdo real completo ⭐ MVP

**User Story**: Como visitante, quero ver informações reais e completas, para confiar na profissional.

**Why P1**: Placeholders em produção destroem a credibilidade — o ativo central do site.

**Acceptance Criteria**:

1. WHEN o site vai a produção THEN sobre, FAQ (≥6), depoimentos (≥3, autorizados), sinais de alerta e textos de teleconsulta (indicações/limitações/valores) SHALL estar com conteúdo real aprovado pela Stella
2. WHEN o conteúdo é revisado THEN ele NÃO SHALL conter promessa de resultado, antes/depois de pacientes ou caso clínico identificável (CFFa) e o CRFa SHALL estar visível
3. WHEN o rodapé é exibido THEN ele SHALL conter aviso de privacidade mencionando o processamento de dados de agendamento pelo Cal.com (LGPD)

**Independent Test**: Busca por "TODO"/"placeholder" no build retorna vazio; checklist de conformidade assinado.

---

### P1: Stella operacional ⭐ MVP

**User Story**: Como Stella, quero começar o lançamento já sabendo operar o painel e com pautas prontas, para não abandonar o blog (R2).

**Why P1**: Mitigação direta do risco de blog abandonado (severidade alta).

**Acceptance Criteria**:

1. WHEN o site lançar THEN Stella SHALL ter publicado ao menos 1 artigo real sozinha (teste de usabilidade do painel)
2. WHEN o painel for entregue THEN Stella SHALL receber a diretriz editorial (ética CFFa) e banco de 5 pautas prontas
3. WHEN a agenda lançar THEN o Cal.com SHALL estar configurado com horários reais, lembretes automáticos ativos e um agendamento de teste concluído

**Independent Test**: Stella publica artigo do celular sem ajuda; agendamento de teste recebe lembrete.

---

### P2: Presença local complementar

**User Story**: Como Leonardo, quero o Google Business Profile ativo apontando para o site, para reforçar o SEO local (mitigação R5).

**Why P2**: Complemento obrigatório do PRD, mas externo ao site.

**Acceptance Criteria**:

1. WHEN o perfil for criado/reivindicado THEN ele SHALL conter endereço, telefone, link do site e categoria correta (fonoaudiólogo)
2. WHEN o perfil estiver ativo THEN os dados SHALL ser consistentes com o schema LocalBusiness do site (NAP idêntico)

**Independent Test**: Buscar a ficha no Google Maps; dados batem com o site.

---

## Edge Cases

- WHEN o conteúdo da Stella atrasar (B-001) THEN o lançamento SHALL ser adiado em vez de publicar placeholder (decisão default; alterar só com registro em STATE.md)
- WHEN o Core Web Vitals regredir com conteúdo real (fotos pesadas) THEN as imagens SHALL ser reotimizadas antes do go-live

---

## Success Criteria

- [ ] Checklist de lançamento 100%: domínio, HTTPS, conteúdo real, schema válido, CWV verde, aviso de privacidade, GSC, GBP
- [ ] Baseline de KPIs começando a coletar no dia do lançamento
- [ ] STATE.md atualizado com data de lançamento e pendências remanescentes
