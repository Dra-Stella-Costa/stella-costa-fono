# Teleconsulta — Specification

## Problem Statement

Pais fora da região (ou sem especialista na cidade) precisam entender se a teleconsulta serve para o caso deles e agendar sozinhos, sem troca de mensagens. Hoje isso não existe de forma estruturada. Cobre US-07, US-08 e RF-03, RF-19, RF-20.

## Goals

- [ ] Página /teleconsulta explica formato, indicações e limitações antes do agendamento
- [ ] Visitante agenda sozinho pelo Cal.com embutido, com confirmação automática por e-mail
- [ ] Primeiros agendamentos no mês 1 pós-lançamento (O4)

## Out of Scope

- Pagamento online antecipado (V2, RF-21) — pagamento combinado diretamente entre Stella e responsável
- Videochamada própria (usa a nativa do Cal.com)
- Prontuário/histórico de pacientes

---

## User Stories

### P1: Página explicativa ⭐ MVP

**User Story**: Como pai fora da região, quero entender como funciona a teleconsulta (formato, duração, valor, o que é tratável a distância), para decidir se serve para meu caso. (US-07)

**Why P1**: Sem contexto clínico claro, o agendamento gera expectativa errada e no-show.

**Acceptance Criteria**:

1. WHEN /teleconsulta é acessada THEN a página SHALL exibir formato, duração, valor (ou faixa), indicações e limitações clínicas definidas por Stella (D4)
2. WHEN o conteúdo clínico ainda não estiver definido THEN a página SHALL usar placeholders marcados TODO e NÃO SHALL ir a produção assim
3. WHEN o visitante rola a página THEN um CTA SHALL levar à seção de agendamento

**Independent Test**: Página renderiza todas as seções; CTA rola até o agendamento.

---

### P1: Agendamento self-service via Cal.com ⭐ MVP

**User Story**: Como pai fora da região, quero escolher um horário disponível e agendar sozinho, para não depender de troca de mensagens. (US-08)

**Why P1**: É a função central da feature (RF-19/RF-20 Must Have).

**Acceptance Criteria**:

1. WHEN a seção de agendamento carrega THEN o embed do Cal.com SHALL exibir a agenda configurada por Stella (duração, buffer, antecedência mínima)
2. WHEN um horário é confirmado THEN o Cal.com SHALL enviar e-mail automático de confirmação com o link da videochamada
3. WHEN o embed é implementado THEN ele SHALL estar isolado em componente próprio, trocável sem retrabalho estrutural (mitigação R3)
4. WHEN o embed falhar ao carregar THEN a página SHALL exibir fallback com link direto para a página do Cal.com e CTA de WhatsApp

**Independent Test**: Fazer um agendamento de teste ponta a ponta e receber o e-mail com link; simular bloqueio do script e ver o fallback.

---

### P2: Rastreamento de agendamentos

**User Story**: Como Leonardo, quero medir visualizações da página e agendamentos iniciados/concluídos, para compor o KPI primário.

**Why P2**: Medição é essencial mas pode entrar logo após o embed funcionar.

**Acceptance Criteria**:

1. WHEN o visitante interage com o embed (evento de booking do Cal.com) THEN o sistema SHALL registrar evento no analytics
2. WHEN um CTA de WhatsApp da página é clicado THEN o evento SHALL identificar origem "teleconsulta"

**Independent Test**: Eventos aparecem no analytics após agendamento de teste.

---

## Edge Cases

- WHEN não houver horários disponíveis THEN o embed SHALL comunicar isso claramente (comportamento nativo Cal.com — validar) e a página SHALL manter CTA de WhatsApp como alternativa
- WHEN o visitante acessa de fuso horário diferente THEN os horários SHALL exibir no fuso do visitante (nativo Cal.com — validar na configuração)
- WHEN o free tier do Cal.com não atender (D5/B-003) THEN a decisão de plano pago SHALL ser registrada em STATE.md antes do lançamento

---

## Success Criteria

- [ ] Agendamento de teste ponta a ponta concluído com e-mail de confirmação
- [ ] Aviso de privacidade do site menciona processamento de dados pelo Cal.com (LGPD)
- [ ] Componente do embed isolado (troca de fornecedor não toca no resto da página)
