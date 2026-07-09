# Landing Page de Conversão — Specification

## Problem Statement

Mães preocupadas pesquisam no Google em momentos de ansiedade e decidem rápido quando encontram uma profissional que transmite confiança. A landing precisa, em segundos, apresentar Stella, provar credibilidade e converter em contato via WhatsApp. Cobre US-01 a US-06 e RF-01, RF-06, RF-08.

## Goals

- [ ] Visitante entende quem é a profissional e como contatá-la sem rolar a página
- [ ] Taxa de conversão visitante→contato mensurável (referência de mercado: 2–5%)
- [ ] Rich snippets de FAQ no Google (schema FAQPage válido)
- [ ] LCP <2,5s em mobile 4G, Core Web Vitals verde

## Out of Scope

- Quiz interativo de marcos (V2, RF-10)
- Página de teleconsulta (feature própria)
- Gestão de depoimentos/FAQ pelo painel (feature painel-admin; aqui podem vir do banco já, com seed manual)

---

## User Stories

### P1: Hero de conversão ⭐ MVP

**User Story**: Como mãe preocupada, quero entender em segundos quem é a profissional e como falar com ela, para resolver minha dúvida sem esforço. (US-01)

**Why P1**: É o momento de decisão; sem isso não há conversão.

**Acceptance Criteria**:

1. WHEN a home carrega em mobile THEN o hero SHALL exibir título contendo "Fonoaudióloga Infantil" + "São Gabriel do Oeste", foto profissional de Stella e botão de WhatsApp, tudo above the fold
2. WHEN o CTA do hero é clicado THEN o sistema SHALL abrir WhatsApp com mensagem pré-preenchida identificando origem "hero"
3. WHEN a página carrega em 4G THEN o carregamento perceptível SHALL ser <2s (imagem hero otimizada via next/image, prioridade LCP)

**Independent Test**: Abrir em viewport 375px; título, foto e CTA visíveis sem rolar; Lighthouse LCP <2,5s.

---

### P1: Seção Sobre com credenciais ⭐ MVP

**User Story**: Como mãe preocupada, quero verificar as credenciais da profissional, para confiar antes de entrar em contato. (US-02)

**Why P1**: Confiança é o critério de decisão da persona; CRFa visível é exigência ética (CFFa).

**Acceptance Criteria**:

1. WHEN a seção Sobre é exibida THEN ela SHALL conter formação (USP Ribeirão Preto), pós em Distúrbios de Fala e Linguagem, número do registro CRFa e foto
2. WHEN o texto é renderizado THEN ele SHALL estar em tom acolhedor, sem promessa de resultado (conformidade CFFa)

**Independent Test**: Seção presente com todos os elementos; CRFa legível.

---

### P1: Sinais de alerta por faixa etária ⭐ MVP

**User Story**: Como mãe em dúvida, quero consultar sinais de alerta por faixa etária, para decidir se devo procurar avaliação. (US-03)

**Why P1**: É o conteúdo que responde à dor da persona ("é normal ou preciso agir?") e alimenta o CTA.

**Acceptance Criteria**:

1. WHEN a seção é exibida THEN ela SHALL organizar marcos por faixas: 0–12 meses, 1–2, 2–3, 3–4 e 4+ anos
2. WHEN o conteúdo é lido THEN ele SHALL usar linguagem acessível, sem jargão técnico
3. WHEN o usuário chega ao fim da seção THEN o sistema SHALL exibir CTA "Identificou algum sinal? Fale comigo" abrindo WhatsApp com origem "sinais"

**Independent Test**: 5 faixas presentes; CTA final funcional com origem correta.

---

### P1: Depoimentos ⭐ MVP

**User Story**: Como visitante, quero ler depoimentos de outros pais, para reduzir minha insegurança. (US-04)

**Why P1**: Prova social é decisiva para a persona; Must Have no PRD.

**Acceptance Criteria**:

1. WHEN a seção é exibida THEN ela SHALL mostrar no mínimo 3 depoimentos com nome abreviado e cidade
2. WHEN um depoimento é publicado THEN ele SHALL ter consentimento registrado e NÃO SHALL conter foto de menores (LGPD/PRD §6)
3. WHEN não houver depoimentos cadastrados THEN a seção SHALL ser omitida (nunca renderizar vazia)

**Independent Test**: Com seed de 3 depoimentos, seção renderiza; com banco vazio, seção some.

---

### P1: FAQ com rich snippets ⭐ MVP

**User Story**: Como visitante, quero respostas para dúvidas comuns (convênio, primeira consulta, idade mínima, duração), para não precisar perguntar o básico. (US-05)

**Why P1**: Reduz atrito de contato e gera rich snippet (SEO).

**Acceptance Criteria**:

1. WHEN o FAQ é exibido THEN ele SHALL conter no mínimo 6 perguntas definidas com Stella
2. WHEN a página é renderizada THEN o HTML SHALL conter schema.org FAQPage (JSON-LD) válido no teste de rich results do Google
3. WHEN uma pergunta é tocada em mobile THEN a resposta SHALL expandir/recolher acessivelmente (teclado e leitor de tela)

**Independent Test**: Validar JSON-LD no Rich Results Test; interagir por teclado.

---

### P2: Localização com mapa

**User Story**: Como mãe local, quero ver onde fica o consultório, para avaliar a distância. (RF-08)

**Why P2**: Should Have; relevante para SEO local mas não bloqueia conversão.

**Acceptance Criteria**:

1. WHEN a seção é exibida THEN ela SHALL mostrar endereço do consultório e mapa embutido de São Gabriel do Oeste
2. WHEN o mapa é carregado THEN ele SHALL usar lazy loading (não afetar LCP)

**Independent Test**: Mapa aparece ao rolar; Lighthouse não regride.

---

### P2: Schema LocalBusiness

**User Story**: Como Leonardo, quero marcação LocalBusiness/MedicalBusiness na home, para melhorar o SEO local. (RF-06)

**Why P2**: Should/Must para SEO, invisível ao usuário.

**Acceptance Criteria**:

1. WHEN a home é renderizada THEN o HTML SHALL conter JSON-LD LocalBusiness (ou MedicalBusiness) com nome, endereço, telefone, área de atendimento e URL, válido no Rich Results Test

**Independent Test**: Validador do Google sem erros.

---

## Edge Cases

- WHEN o banco (depoimentos/FAQ) estiver indisponível no build THEN o build SHALL usar último conteúdo válido ou falhar explicitamente (nunca publicar seção vazia/quebrada)
- WHEN o visitante estiver em desktop THEN o clique no WhatsApp SHALL abrir WhatsApp Web
- WHEN JavaScript estiver desabilitado THEN o conteúdo textual e os links de WhatsApp SHALL continuar funcionais (âncoras `wa.me`)

---

## Success Criteria

- [ ] Core Web Vitals verde em mobile (LCP <2,5s)
- [ ] FAQPage e LocalBusiness válidos no Rich Results Test
- [ ] Todos os CTAs disparam evento de analytics com seção de origem
- [ ] Nenhuma promessa de resultado ou foto de menor no conteúdo
