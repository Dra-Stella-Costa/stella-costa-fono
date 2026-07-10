---
name: implement-landing
description: Implementa a landing page de conversão (M2) do site Stella Costa Fonoaudiologia Infantil conforme .specs/features/landing-page e o Manual de Identidade v2.0. Use quando o usuário pedir para implementar a landing, seções Sobre/sinais/depoimentos/FAQ/mapa, schemas LocalBusiness/FAQPage, ou avançar M2 conversão da home.
---

# Implement Landing — Stella Costa (M2)

Skill de **implementação** da home de conversão. Complementa `prd-verification-loop`
(que só verifica). Fonte de requisitos: `.specs/features/landing-page/spec.md`.

## Antes de codar

1. Ler `.specs/features/landing-page/spec.md` (acceptance criteria).
2. Ler `docs/identidade-visual.md` (cores, tipografia, botões, grafismos).
3. Ler `lib/site.ts` — usar `whatsappLink(origem)` e `CRFA_NUMBER` (não hardcodar).
4. Confirmar placeholders: textos com `TODO (D3)` se conteúdo real da Stella faltar.
   **Nunca inventar depoimentos como se fossem reais** — use seed marcado placeholder
   ou omita a seção se vazio (spec US-04).

## Ordem de implementação (P1 primeiro)

| # | Seção | US/RF | Origem WhatsApp | Schema |
|---|--------|-------|-----------------|--------|
| 1 | Hero (já existe — só evoluir se necessário) | US-01 | `hero` | — |
| 2 | Sobre + credenciais + CRFa | US-02 | opcional | — |
| 3 | Sinais de alerta (5 faixas etárias) | US-03 | `sinais` | — |
| 4 | Depoimentos (≥3, nome abreviado, sem foto) | US-04 | — | — |
| 5 | FAQ (≥6, accordion acessível) | US-05 | `faq` | FAQPage JSON-LD |
| 6 | Localização + mapa lazy | RF-08 | — | — |
| 7 | LocalBusiness/MedicalBusiness na home | RF-06 | — | JSON-LD |

## Regras de design (obrigatórias)

- Tokens só de `app/globals.css` / Tailwind theme (Coral, Petróleo, Sol, Creme…).
- Primário Coral **único por tela** (hero já tem; CTAs de seção = secundário Petróleo
  ou terciário Sol em cards — ver manual §06).
- Títulos: Baloo 2 (`font-display`); corpo: Figtree; `.medida-leitura` no texto corrido.
- Máx. **2 grafismos** por tela (`OndaDeVoz`, `Pipa`).
- Imagens: só `next/image`; foto profissional com moldura `FotoArcoDePipa` se couber.
- CFFa: sem "garantimos", "cura", "antes e depois", "resultado garantido".
- LGPD: depoimentos sem foto de menores; nomes `Nome S.`; sem form próprio.

## Padrões de código

- Componentes de seção em `components/landing/` (ou `components/sections/`),
  importados por `app/page.tsx` — manter a page enxuta.
- Server Components por padrão; client só para accordion FAQ se precisar de estado.
- JSON-LD: `<script type="application/ld+json">` com `JSON.stringify` (sem XSS).
- CRFa: se `CRFA_NUMBER` for `null`, exibir placeholder visível `CRFa —` **não**
  forjar número. Enquanto D3 não chegar, **CHK-023 e CHK-204 ficam FAIL** — é o
  comportamento correto e esperado (o site não pode ir ao ar sem CRFa: RNF-Conformidade).
- Mapa: iframe com `loading="lazy"`; não no LCP.

### Exemplo de CTA com origem

```tsx
import { whatsappLink } from "@/lib/site";

<a href={whatsappLink("sinais")} target="_blank" rel="noopener noreferrer"
  className="rounded-full border-2 border-petroleo-600 ...">
  Identificou algum sinal? Fale comigo
</a>
```

### FAQ accordion (acessível)

Preferir `<details>`/`<summary>` nativo (funciona sem JS = edge case da spec).
Schema FAQPage deve espelhar as mesmas perguntas do DOM (CHK-051).

## Conteúdo placeholder (enquanto D3 pendente)

Marcar com comentário `{/* TODO (D3): revisar com Stella */}` e tom acolhedor.
Depoimentos: se usar seed, prefixar quote com `[placeholder]` no código-fonte
ou `published: false` no banco — **não** marque CHK-043 como PASS no relatório humano.

## Definition of Done desta skill

1. Seções P1 renderizam na home (Sobre, sinais, depoimentos se houver dados, FAQ).
2. `whatsappLink` com origens distintas (`hero`, `sinais`, `faq`, …).
3. JSON-LD FAQPage (± LocalBusiness) no HTML da home.
4. Sem regressão de identidade / CFFa / LGPD.
5. Rodar verificação da fase F2:

```bash
npm run build && npm run start
# outro terminal:
npm run verify:f2 -- --base http://localhost:3000
```

6. Entregar resumo: o que passou (CHK-*), o que ficou FAIL por conteúdo D3 (CRFa,
   depoimentos reais), e o que é N/A (blog, teleconsulta).

## Fora de escopo desta skill

- `/teleconsulta`, Cal.com → feature `teleconsulta`
- `/blog`, `/admin` → M3
- Analytics de eventos → `analytics-seo`
- Domínio, GSC, textos finais da Stella → M4 / D1–D4

Após landing estável, o usuário deve acionar `prd-verification-loop` (F2 ou F6).
