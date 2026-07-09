# Analytics e SEO Técnico — Specification

## Problem Statement

O KPI primário (contatos/mês = cliques WhatsApp + agendamentos) só existe se cada CTA for medido com origem, e o objetivo de primeira página no Google exige a infraestrutura técnica de SEO desde o dia 1. Cobre US-13 e RF-05, parte de RF-06.

## Goals

- [ ] Todo clique em CTA de WhatsApp gera evento com seção de origem
- [ ] Sitemap dinâmico (incluindo artigos) e robots.txt automáticos
- [ ] Google Search Console ativo coletando impressões/posições

## Out of Scope

- Dashboard próprio de métricas (V2) — consulta direto no Vercel Analytics/Umami, Cal.com e Search Console
- Consolidação mensal automatizada (processo manual do Leonardo)

---

## User Stories

### P1: Eventos de conversão ⭐ MVP

**User Story**: Como Leonardo, quero medir cliques no WhatsApp com origem, para acompanhar o KPI primário. (US-13)

**Why P1**: Sem medição, as metas O1/O2 são inauditáveis; mês 1 é o baseline.

**Acceptance Criteria**:

1. WHEN qualquer CTA de WhatsApp é clicado THEN o sistema SHALL registrar evento com identificador da seção de origem (hero, sinais, faq, flutuante, blog:[slug], teleconsulta, 404)
2. WHEN o analytics é implementado THEN ele SHALL ser leve (Vercel Analytics ou Umami), sem cookies de rastreamento invasivo (LGPD: sem banner de consentimento necessário)
3. WHEN um agendamento é concluído no Cal.com THEN o número SHALL ser recuperável no relatório do Cal.com (validar evento de callback para registrar também no analytics)

**Independent Test**: Clicar em cada CTA e ver os eventos com origens distintas no painel do analytics.

---

### P1: Sitemap e robots ⭐ MVP

**User Story**: Como Leonardo, quero sitemap.xml e robots.txt gerados automaticamente, para o Google indexar tudo sem manutenção. (RF-05)

**Why P1**: Base da indexação; Must Have.

**Acceptance Criteria**:

1. WHEN /sitemap.xml é acessado THEN ele SHALL listar home, /teleconsulta, /blog e todos os artigos publicados com lastmod
2. WHEN um artigo é publicado/despublicado THEN o sitemap SHALL refletir na próxima geração (≤60s, alinhado ao ISR)
3. WHEN /robots.txt é acessado THEN ele SHALL permitir indexação do site público, bloquear /admin e apontar o sitemap
4. WHEN qualquer página pública é renderizada THEN ela SHALL conter URL canônica

**Independent Test**: Acessar ambos os arquivos; publicar artigo e vê-lo no sitemap.

---

### P2: Google Search Console

**User Story**: Como Leonardo, quero o Search Console configurado, para acompanhar posição média e cliques orgânicos (O2).

**Why P2**: Depende do domínio definitivo (B-002); configuração externa ao código.

**Acceptance Criteria**:

1. WHEN o domínio estiver ativo THEN a propriedade SHALL estar verificada no Search Console com sitemap submetido
2. WHEN houver erros de indexação/rich results THEN eles SHALL ser triados mensalmente

**Independent Test**: Propriedade verificada; sitemap com status "Success".

---

## Edge Cases

- WHEN o script de analytics for bloqueado por adblocker THEN os links de WhatsApp SHALL continuar funcionando (medição degradada, função intacta)
- WHEN houver tráfego de bots THEN os relatórios SHALL usar a filtragem nativa da ferramenta (documentar limitação no baseline)

---

## Success Criteria

- [ ] Consolidado mensal possível: eventos por origem (analytics) + agendamentos (Cal.com) + orgânico (GSC)
- [ ] Sitemap válido no Search Console, sem páginas /admin indexadas
- [ ] Baseline do mês 1 registrado em STATE.md após lançamento
