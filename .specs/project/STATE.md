# State

**Last Updated:** 2026-07-09
**Current Work:** M1 Fundação implementada e verificada (loop F1: 0 FAIL). Repo `Dra-Stella-Costa/stella-costa-fono` publicado; Supabase provisionado com migration 0001 aplicada e RLS testado ponta a ponta (CHK-160..164 PASS, incl. CHK-162 com usuário autenticado não-Stella). Próximo: deploy Vercel, aprovação da identidade visual (D2), então M2 (landing-page).

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

### AD-003: Roadmap em 4 milestones (2026-07-09)

**Decision:** M1 Fundação → M2 Conversão (landing + teleconsulta + analytics) → M3 Conteúdo (blog + painel) → M4 Lançamento.
**Reason:** M2 já é lançável e ataca o KPI primário antes do blog; painel só faz sentido com blog público pronto.
**Trade-off:** Blog (motor de SEO de longo prazo) chega depois.
**Impact:** Ordem de implementação das features; specs criadas por feature.

---

## Active Blockers

### B-001: Conteúdos dependem da Stella (D3/D4)

**Discovered:** 2026-07-08
**Impact:** Bloqueia M4 (lançamento) e textos finais de landing/teleconsulta; não bloqueia desenvolvimento (usar placeholders).
**Workaround:** Desenvolver com conteúdo placeholder marcado com TODO.
**Resolution:** Leonardo coletar com Stella: sobre, FAQ (≥6), ≥3 depoimentos autorizados, indicações/limitações e valores da teleconsulta.

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
