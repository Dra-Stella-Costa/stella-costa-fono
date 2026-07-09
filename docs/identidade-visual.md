# Identidade visual — Stella Costa Fonoaudiologia Infantil

> **Fonte de verdade:** Manual de Identidade Visual v2.0 (julho/2026), entregue em PDF.
> Este doc é o espelho técnico do manual. Os tokens vivem em `app/globals.css` (`@theme`).
> Regra: mudou o token, atualiza este doc na mesma alteração. Resolve D2.

## Conceito

"A pipa que carrega a voz." O símbolo une a pipa (infância, leveza — já presente na bio da
Stella) e a onda sonora na linha da pipa (fala, escuta, comunicação). A criança solta a pipa;
a Stella solta a voz.

## Cores

Proporção alvo em qualquer peça: **Creme 55% · Petróleo 25% · Coral 12% · Sol 8%**.
Se o Coral passar de ~12% da área, a peça grita.

| Nome | Hex | Token | Uso |
|------|-----|-------|-----|
| Coral Fala | `#FF6F61` | `coral-500` | Botões primários, links, destaque de palavra em títulos, símbolo |
| Petróleo Confiança | `#17527B` | `petroleo-600` | Títulos, rodapé, fundos institucionais, textos de autoridade |
| Sol de Quintal | `#FFC145` | `sol-500` | Acentos, doodles, hovers, linha da pipa. **Nunca em texto pequeno** |
| Creme Algodão | `#FDF8F2` | `creme` | Fundo principal. **Nunca branco puro** |
| Areia | `#F4EADD` | `areia` | Cartões, bordas. **Nunca cinza frio** |
| Grafite Quente | `#2E2A26` | `grafite` | Texto corrido. **Nunca preto puro** |
| Sucesso / Erro | `#3E8E5A` / `#D64545` | `sucesso` / `erro` | Só feedback de sistema |

Tons derivados (`coral-100/300/600/700`, `petroleo-100/300/500/700`, `sol-100/300/600`) existem
para profundidade sem sair do sistema.

**Acessibilidade (WCAG):** Grafite sobre Creme 12,1:1 (AAA). Petróleo sobre Creme 6,8:1 (AA em
qualquer tamanho). Branco sobre Coral 3,2:1 — usar **somente** em texto ≥18px bold (botões e
títulos). Sol nunca carrega texto menor que 20px.

## Tipografia

- **Títulos:** Baloo 2 (700/800) — token `font-display`
- **Texto:** Figtree (400/600/700) — token `font-sans`
- Ambas Google Fonts, carregadas via `next/font` (self-hosted no build, sem custo de licença)

| Papel | Fonte | Token | Especificação |
|-------|-------|-------|---------------|
| Display / H1 | Baloo 2 800 | `text-display` | clamp 36→54px · lh 1.08 · tracking -0.5% |
| H2 seções | Baloo 2 700 | `text-h2` | clamp 27→37px · lh 1.15 |
| H3 blocos | Baloo 2 700 | `text-h3` | clamp 20→25px · lh 1.25 |
| Corpo | Figtree 400/600 | `text-corpo` | 17px · lh 1.65 · máx. 62 caracteres/linha (`.medida-leitura`) |
| Apoio | Figtree 400 | `text-apoio` | 14,5px · lh 1.6 |
| Eyebrow | Figtree 700 | `text-eyebrow` | 12px · caps · tracking 14% |

**Regras de composição:** títulos sempre em Petróleo com no máximo uma palavra/expressão em
Coral. Nunca Baloo 2 em texto corrido acima de duas linhas. Nunca caixa alta em Baloo 2.
Telefones e horários sempre em Figtree 600.

## Grafismos (§04)

Máximo **dois grafismos por tela**, sempre em apoio, nunca competindo com foto ou título.

- **Onda de voz** (`components/OndaDeVoz.tsx`) — divisor, detalhe de cartão, bullet. Coral ou Sol.
- **Balão de conversa** — moldura de depoimentos e FAQ, cauda sempre à esquerda. _(a implementar)_
- **Pipa solta** (`components/Pipa.tsx`) — carimbo em cantos. Uma por tela, nunca sobre rosto.
- **Linha de percurso** — conecta etapas (como funciona, marcos por idade). _(a implementar)_

**Molduras de foto:** arco de pipa — topo em arco alto, base com cantos de 24px, contorno
tracejado em Sol deslocado 10px.

**Ícones:** outline, traço 2.5px, terminais arredondados, raio 4, cor Petróleo. Biblioteca
recomendada: Lucide.

## Componentes (§06)

- **Botões:** raio 999px, Baloo 2 700. Primário (Coral) **único por tela**; secundário
  (contorno Petróleo) acompanha; terciário (Sol) só em cards. Hover eleva 2px e escurece um
  tom. Foco de teclado: anel Petróleo claro de 4px.
- **Formulário:** mensagens de erro dizem o que fazer, nunca só "campo inválido".
- **Chips de categoria do blog:** fundo tom 100, texto tom 600 — navegação por cor.
- **Depoimentos:** formato balão de conversa, com onda de voz.

## Fotografia (§05)

Luz natural, tons quentes que conversam com o Creme, crianças em interação real. Três tipos:
institucional (Stella olhando para a câmera — hero e "Sobre"), editorial (criança em ação
espontânea, nunca posada), detalhe (mãos, jogos, materiais — resolve LGPD sem autorização).

**Ética e LGPD:** imagem de paciente só com termo assinado pelos responsáveis. Proibido
antes/depois e qualquer imagem que exponha diagnóstico de criança identificável (CFFa).

## Pendências

- Assets do logo (SVG/PNG oficiais) e favicon — hoje o símbolo é reconstruído em
  `components/Pipa.tsx`; substituir pelo SVG do designer quando disponível.
- Fotos institucionais e editoriais aprovadas (D3).
- Cartão de visita e templates de social não fazem parte do escopo do site.
