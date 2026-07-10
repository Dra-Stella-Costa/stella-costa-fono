# State

**Last Updated:** 2026-07-09
**Current Work:** M1 concluído. Site no ar em https://stella-costa-fono.vercel.app (Vercel Hobby, conta leo123-pixel, repo conectado com deploy automático). Supabase com RLS testado; identidade v2.0 aplicada. Próximo: M2 → feature `landing-page`.

---

## Recent Decisions (Last 60 days)

### AD-001: Stack Next.js + Supabase + Cal.com + Vercel (2026-07-08)

**Decision:** Next.js App Router + Tailwind na Vercel; Supabase para banco/auth/storage; Cal.com embed para agendamento.
**Reason:** Free tiers cobrem o volume projetado por anos; SSG/ISR atende SEO; Supabase Auth resolve painel restrito sem backend próprio.
**Trade-off:** Dependência de terceiro (Cal.com) para função crítica.
**Impact:** Embed do Cal.com deve ficar isolado em componente próprio para troca futura sem retrabalho (mitigação R3).

### AD-002: Pagamento fora do sistema no MVP (2026-07-08)

**Decision:** Pagamento da teleconsulta combinado diretamente entre Stella e responsável; sem cobrança online.
**Reason:** Decisão de negócio para simplificar o MVP.
**Trade-off:** Risco de no-show (R1, severidade alta).
**Impact:** Lembretes automáticos do Cal.com obrigatórios; pagamento online vira prioridade V2 se no-show >30%.

### AD-004: H1 da marca, palavras-chave no H2 (2026-07-09)

**Decision:** O H1 do hero é "Toda criança tem uma voz. Vamos soltar a sua?" (Manual de Identidade v2.0 §07). As palavras-chave de SEO ("Fonoaudióloga Infantil", "São Gabriel do Oeste") ficam no primeiro H2, no `<title>` e na meta description.
**Reason:** Conflito entre o PRD (CHK-011 exigia keywords no H1) e o brandbook. A frase da marca carrega a conversão emocional; o title tag já ancora a busca.
**Trade-off:** H1 sem keyword exata é um sinal de SEO um pouco mais fraco.
**Impact:** CHK-011 emendado no checklist e no `verify.mjs` para aceitar H1 ou primeiro H2. Reavaliar se o ranking para "fonoaudióloga infantil São Gabriel do Oeste" não subir em 3 meses (meta O2).

### AD-005: Identidade visual v2.0 aplicada (2026-07-09)

**Decision:** Paleta Coral/Petróleo/Sol/Creme + Baloo 2/Figtree, conforme Manual de Identidade Visual v2.0 (jul/2026). Resolve D2.
**Reason:** O brandbook chegou depois da fundação; a paleta provisória (verde-água + Nunito) foi descartada.
**Trade-off:** Retrabalho de todos os componentes do layout base.
**Impact:** Tokens em `app/globals.css`; símbolo e grafismos reconstruídos em SVG (`components/Pipa.tsx`, `components/OndaDeVoz.tsx`) até os assets oficiais do designer chegarem.

### AD-003: Roadmap em 4 milestones (2026-07-09)

**Decision:** M1 Fundação → M2 Conversão (landing + teleconsulta + analytics) → M3 Conteúdo (blog + painel) → M4 Lançamento.
**Reason:** M2 já é lançável e ataca o KPI primário antes do blog; painel só faz sentido com blog público pronto.
**Trade-off:** Blog (motor de SEO de longo prazo) chega depois.
**Impact:** Ordem de implementação das features; specs criadas por feature.

---

## Active Blockers

### AD-007: Teleconsulta publicada sem o conteúdo clínico (2026-07-09)

**Decision:** `/teleconsulta` vai a produção com o embed do Cal.com funcionando, mas as listas de formato, indicações e limitações ficam ocultas até a revisão da Stella (D4). Em produção o texto é factual ("atendimento por videochamada, confirmação por e-mail").
**Reason:** O Cal.com foi configurado (`stella-viwuxq/teleconsulta`) e o botão do hero caía no WhatsApp. Publicar a página destrava a conversão; publicar as listas colocaria afirmações clínicas não revisadas sob a assinatura profissional dela.
**Trade-off:** CHK-100 (headings de formato/indicações/limitações) fica FAIL em produção até D4.
**Impact:** Ao receber os textos, virar `CONTEUDO_VALIDADO = true` em `lib/landing-content.ts`.

### B-007: `vercel env add` gravou strings vazias

**Discovered:** 2026-07-09
**Impact:** Variáveis na Vercel podem estar vazias. Com `??`, string vazia é valor válido — os links viravam `wa.me/?text=` e o embed apontaria para `cal.com/`. Falha silenciosa que mataria o KPI primário.
**Workaround:** Código passou a usar `||` nos fallbacks, então valores vazios caem no padrão correto.
**Resolution:** Conferir no painel da Vercel (Settings → Environment Variables) se `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CALCOM_LINK`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` têm valor. A anon key **não** tem padrão no código e será necessária no M3 (blog/admin).

### AD-006: Rascunho gated por variável de ambiente (2026-07-09)

**Decision:** Sinais de alerta, depoimentos e FAQ só renderizam com `NEXT_PUBLIC_MOSTRAR_RASCUNHO=1`, presente apenas no `.env.local`.
**Reason:** O deploy é automático a cada push. Sem o gate, um commit publicaria depoimentos inventados (LGPD) e afirmações clínicas/comerciais não validadas com a assinatura profissional da Stella.
**Trade-off:** A home em produção fica curta (hero, sobre, localização) até o D3.
**Impact:** Ao receber o conteúdo real, virar `CONTEUDO_VALIDADO = true` em `lib/landing-content.ts` e remover a variável. CHK-043 é o guard automatizado.

### B-001: Conteúdos dependem da Stella (D3/D4)

**Discovered:** 2026-07-08
**Impact:** Bloqueia M4 (lançamento). Em produção hoje: sinais/depoimentos/FAQ não renderizam e `/teleconsulta` responde 404 (gate AD-006).
**Workaround:** Rascunho renderiza só localmente, atrás de `NEXT_PUBLIC_MOSTRAR_RASCUNHO`.
**Resolution:** Leonardo coletar com Stella: **número do CRFa** (bloqueia CHK-023/204 e o CFFa), FAQ (≥6), ≥3 depoimentos autorizados com consentimento arquivado, sinais de alerta revisados, indicações/limitações/duração/valor da teleconsulta. Depois: `CONTEUDO_VALIDADO = true` em `lib/landing-content.ts`.

### B-006: WhatsApp com nono dígito inferido

**Discovered:** 2026-07-09
**Impact:** Se o número estiver errado, todos os CTAs do site levam a um contato inválido — o KPI primário morre silenciosamente.
**Workaround:** Nenhum.
**Resolution:** Leonardo informou `+55 67 9311-2092` (8 dígitos após o DDD). Assumido `99311-2092` com base no cartão de visita do brandbook. **Confirmar enviando uma mensagem de teste pelo botão do site antes do lançamento.**

### B-005: Repositório público exige disciplina com segredos

**Discovered:** 2026-07-09
**Impact:** `Dra-Stella-Costa/stella-costa-fono` é público (exigência do plano Hobby da Vercel para repos de organização). Qualquer segredo commitado fica exposto para sempre no histórico.
**Workaround:** `.env*` no .gitignore; variáveis vivem no painel da Vercel.
**Resolution:** Regra permanente — nunca commitar `service_role` key, senha ou dado de paciente. A anon key é pública por design; quem protege o banco é o RLS.

### B-002: Domínio não registrado (D1)

**Discovered:** 2026-07-08
**Impact:** Bloqueia go-live e Search Console definitivo; não bloqueia dev (preview Vercel).
**Workaround:** Deploy em subdomínio vercel.app durante desenvolvimento.
**Resolution:** Decidir entre fonostellacosta.com.br / stellacostafono.com.br e registrar.

### B-004: Limpeza pós-teste de RLS no Supabase

**Discovered:** 2026-07-09
**Impact:** "Confirm email" está DESATIVADO no Auth (foi desligado para viabilizar o teste CHK-162). Deixar assim em produção permite cadastro sem verificação de e-mail.
**Workaround:** Nenhum — precisa ser revertido antes do go-live.
**Resolution:** Leonardo religar "Confirm email" e deletar os usuários de teste `comercial.servicoaki+rlstest@gmail.com` e `comercial.servicoaki+rls2@gmail.com`.

### B-003: Free tier Cal.com não validado (D5)

**Discovered:** 2026-07-08
**Impact:** Pode exigir plano pago se precisar de mais de 1 tipo de evento.
**Workaround:** MVP usa 1 único tipo de evento (teleconsulta).
**Resolution:** Leonardo validar limites do free tier ao configurar a conta.

---

## Lessons Learned

### L-001: TypeScript 7 quebra o Next 15 (2026-07-09)

`npm install typescript` sem pin trouxe o TS 7 (port nativo), que quebra o carregamento de `next.config.ts` ("Cannot read properties of undefined (reading 'fileExists')"). Manter `typescript@^5` até o Next suportar TS 7.

### L-002: verify.mjs precisa ignorar .claude/.specs (2026-07-09)

O grep de segredos (CHK-005) dava falso positivo lendo a própria skill de verificação. Corrigido no skip list do `walk()`.

---

## Preferences

**Model Guidance Shown:** never
**Idioma:** Português (BR) em toda a documentação de specs.
