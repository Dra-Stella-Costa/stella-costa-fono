# Identidade visual — Stella Costa Fonoaudiologia Infantil

> **Status:** proposta inicial (resolve D2 tecnicamente; aguarda aprovação da Stella).
> Fonte de verdade dos tokens: `app/globals.css` (bloco `@theme`).
> Regra: qualquer mudança nos tokens atualiza este doc na mesma alteração.

## Conceito

Saúde infantil com acolhimento: verde-água transmite calma e cuidado clínico;
coral quente traz a energia lúdica da infância sem infantilizar a marca.
Tipografia arredondada (Nunito) reforça proximidade e leitura fácil no mobile.

## Paleta

| Token | Hex | Uso |
|-------|-----|-----|
| `brand-50` | `#f0fafa` | fundos suaves de seção |
| `brand-100` | `#d9f2f2` | bordas, divisores |
| `brand-200` | `#b3e4e4` | hover suave |
| `brand-300` | `#7fcfd0` | detalhes decorativos |
| `brand-400` | `#4ab5b7` | ícones |
| `brand-500` | `#2b9a9c` | texto de apoio sobre claro |
| `brand-600` | `#217e81` | botões primários, links |
| `brand-700` | `#1e6567` | hover de botões, títulos |
| `brand-800` | `#1d5152` | títulos principais |
| `brand-900` | `#1b4344` | texto corrido |
| `accent-100..600` | `#ffe8e1` → `#e05236` | destaques pontuais, CTAs secundários |
| `whatsapp` / `whatsapp-dark` | `#25d366` / `#1ebe5b` | exclusivo para CTAs de WhatsApp |

## Tipografia

- **Família:** Nunito (Google Fonts, via `next/font` — self-hosted no build)
- **Pesos:** 400 (texto), 600 (apoio), 700 (botões/subtítulos), 800 (títulos)
- **Fallback:** ui-sans-serif, system-ui

## Logo

Pendente (D2 parcial): por ora a marca é tipográfica ("Stella Costa" em
Nunito 800, `brand-700`). Quando houver logo, documentar aqui área de
proteção, versões e tamanhos mínimos.
