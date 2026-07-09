---
name: prd-verification-loop
description: Executa loops de verificação (verify → report → fix → re-verify) do site Stella Costa Fonoaudiologia Infantil contra o PRD v1.0. Use esta skill SEMPRE que o usuário pedir para verificar, validar, auditar, revisar ou conferir o projeto contra o PRD, mencionar "loop de verificação", "checklist do PRD", "QA do site", "verificar requisitos", "está pronto para lançar?", ou após implementar qualquer feature dos módulos site público, painel admin ou agendamento. Também use antes de qualquer deploy para produção.
---

# PRD Verification Loop — Site Stella Costa (Fono Infantil)

Skill de verificação iterativa do projeto contra o **PRD v1.0 (08/07/2026)**.
O objetivo não é rodar um checklist uma vez: é rodar um **loop de engenharia**
até que todos os itens automatizáveis passem e todos os itens manuais estejam
explicitamente aprovados ou registrados como pendência consciente.

## O loop

```
┌─> 1. VERIFY   — rodar scripts/verify.mjs + checagens manuais da fase atual
│   2. REPORT   — gerar relatório com status por item (PASS / FAIL / MANUAL / N/A)
│   3. TRIAGE   — classificar falhas: bug de código | conteúdo faltante | decisão pendente
│   4. FIX      — corrigir apenas bugs de código nesta iteração (menor mudança possível)
└── 5. RE-VERIFY — voltar ao passo 1. Sair só quando: 0 FAIL automatizáveis
                   e itens MANUAL listados no relatório final para aprovação humana.
```

Regras do loop:

- **Uma causa-raiz por iteração.** Corrija, re-rode, confirme que passou e que
  nada regrediu, só então ataque a próxima falha. Isso evita mascarar falhas
  interdependentes (ex.: schema quebrado por meta tag ausente).
- **Nunca marque PASS sem evidência.** Cada PASS precisa de saída de comando,
  trecho de HTML, screenshot ou query. "Parece implementado" = FAIL.
- **Conteúdo não se inventa.** Itens que dependem de conteúdo real da Stella
  (depoimentos, FAQ, textos de teleconsulta, valores) são `MANUAL`, nunca
  preencha com placeholder e marque como PASS. Placeholder presente = FAIL
  com nota "aguardando conteúdo D3/D4".
- **Escopo congelado.** Se durante o fix surgir ideia de melhoria fora do PRD,
  registre em `BACKLOG-V2.md` e siga. O PRD define isso explicitamente (R4).
- **Limite de iterações:** se após 5 iterações o mesmo item continua FAIL,
  pare, documente a hipótese e peça decisão ao usuário.

## Fontes de verdade

1. `references/prd-checklist.md` — **leia antes da primeira iteração.** Contém
   todos os pontos do PRD decompostos em itens verificáveis (US-01..13,
   RF-01..21, RNFs, KPIs, riscos com mitigação verificável), cada um com ID,
   método de verificação e classificação AUTO/SEMI/MANUAL.
2. `scripts/verify.mjs` — verificador automatizado. Roda contra um servidor
   local (`npm run build && npm run start`, ou `next dev` em último caso) e
   contra o filesystem do repo.

## Como executar uma iteração

```bash
# 1. Build de produção (build quebrado = FAIL geral, pare aqui)
npm run build

# 2. Subir servidor de produção em background
npm run start &   # porta 3000 por padrão

# 3. Rodar o verificador
node scripts/verify.mjs --base http://localhost:3000 --repo .

# 4. Ler o relatório gerado em verify-report.md
```

O script cobre os itens `AUTO`. Para itens `SEMI` (ex.: RLS no Supabase,
evento de analytics disparando), siga as instruções por item no checklist —
geralmente uma query SQL, um curl autenticado ou inspeção de payload.
Itens `MANUAL` apenas liste no relatório com o que precisa ser confirmado
e por quem (Stella, Leonardo).

## Fases de verificação

Nem tudo é verificável desde o dia 1. Rode o loop no escopo da fase atual:

| Fase | Escopo do loop | Itens do checklist |
|------|----------------|--------------------|
| F1 — Fundação | Build, rotas, 404, sitemap, robots, HTTPS/headers | RF-04, RF-05, RF-07, RNF-SEO parcial |
| F2 — Landing | Hero, sobre, sinais, depoimentos, FAQ, CTAs, schema | US-01..06, RF-01, RF-02, RF-06, RF-08 |
| F3 — Blog + Admin | Auth, CRUD, editor, SEO por artigo, RLS | US-09..12, RF-11..17, RNF-Segurança |
| F4 — Teleconsulta | Página, embed Cal.com, confirmação | US-07, US-08, RF-19, RF-20 |
| F5 — Medição | Eventos WhatsApp, analytics, GSC | US-13, KPIs |
| F6 — Pré-lançamento | **Loop completo**: todos os itens, incluindo performance real (LCP 4G), Lighthouse, LGPD, CFFa | Tudo |

Antes do deploy de produção, a F6 é obrigatória e o relatório final deve ser
apresentado ao usuário com os MANUAL pendentes destacados.

## Formato do relatório (REPORT)

Gere `verify-report.md` (o script já gera a parte AUTO; complete com SEMI/MANUAL):

```markdown
# Relatório de verificação PRD — Iteração N — {data}
Fase: F{n} | Automatizados: {pass}/{total} | Falhas: {n} | Manuais pendentes: {n}

## FAIL (bloqueiam)
- [CHK-042] RF-06 Schema FAQPage ausente em /
  Evidência: nenhum <script type="application/ld+json"> com @type FAQPage
  Causa provável: ... | Fix proposto: ...

## MANUAL (aprovação humana)
- [CHK-071] US-04 Depoimentos: 3 textos reais autorizados — aguardando Stella (D3)

## PASS
- [CHK-001] Build de produção sem erros ✓
...
```

## Critérios de saída do loop (Definition of Done por fase)

- **0 FAIL** em itens AUTO e SEMI da fase.
- Itens MANUAL da fase listados com responsável e status.
- Nenhuma regressão: itens PASS de fases anteriores re-verificados (o script
  roda tudo sempre; regressão aparece sozinha).
- Para F6: Core Web Vitals verde em mobile (LCP < 2,5s), zero placeholder em
  produção, CRFa visível, aviso de privacidade presente, RLS testado com
  usuário anônimo E com usuário autenticado não-Stella.

## Armadilhas conhecidas deste projeto

- **SSG/ISR:** `next build` pode pré-renderizar páginas de blog no build; após
  publicar artigo pelo painel, verifique a revalidação (RNF-Performance) — o
  artigo novo precisa aparecer sem redeploy. Teste criando artigo e dando GET
  na listagem e no sitemap.
- **RLS ≠ auth no frontend.** Esconder botão de admin não é segurança. O teste
  válido é chamada direta à API do Supabase com anon key tentando INSERT/UPDATE
  em `posts` — deve retornar erro de policy.
- **Restrição por e-mail (RF-11):** criar um segundo usuário no Supabase Auth e
  confirmar que ele NÃO acessa o painel nem escreve no banco.
- **Mensagem pré-preenchida do WhatsApp (US-06/RF-02):** verifique que o
  parâmetro `text` está URL-encoded e que cada seção usa identificador de
  origem distinto — é isso que alimenta o KPI primário (US-13).
- **Schema.org:** validar JSON-LD com parser (o script faz), não a olho. Tipos
  exigidos: LocalBusiness/MedicalBusiness (home), FAQPage (FAQ), Article (posts).
- **CFFa (RNF-Conformidade):** grep por padrões de promessa de resultado
  ("garantimos", "cura", "resultado garantido", "antes e depois") no conteúdo —
  presença = FAIL de conformidade, escale para revisão da Stella.
- **LGPD:** nenhum formulário do site próprio deve coletar dados de criança;
  se algum form existir além do Cal.com embed, é desvio de escopo — FAIL.

## Quando o usuário pedir "verificar tudo"

1. Leia `references/prd-checklist.md` inteiro.
2. Detecte a fase atual pelo estado do repo (quais rotas/módulos existem).
3. Rode o loop na fase detectada + regressão das anteriores.
4. Entregue o relatório e, se houver FAIL, pergunte se inicia o ciclo de FIX
   ou apresente o plano de correção priorizado (Must Have primeiro, na ordem
   RF-01..RF-21; Should Have depois; Nice to Have/V2 são N/A no MVP).
