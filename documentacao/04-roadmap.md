# 04 — Roadmap de execução

## Fase 0 — Confirmações (você)
- [ ] Informar: nome do banco MySQL, usuário/senha, `app.baseURL` desejada
- [ ] Responder às perguntas em `05-perguntas.md`
- [ ] Confirmar: React via Vite? Tailwind v3 ou v4? Recharts ou Chart.js?

## Fase 1 — Backend (CodeIgniter 4)
1. Configurar `.env` + `Database.php` com credenciais reais
2. Criar Migrations (ver `01-modelagem-dados.md`) + `php spark migrate`
3. Criar Models (`CandidatoModel`, `BemModel`...) + Controllers API (`Api\Candidatos`, `Api\Rankings`, `Api\Estatisticas`)
4. Criar `POST /api/coletas` com `X-API-Key` + comando `php spark eleicoes:importar scraper/out/candidatos.json`
5. Testar endpoints via Thunder Client/cURL

## Fase 2 — Scraper (Playwright)
1. `npm init -y && npm i playwright && npx playwright install chromium`
2. Implementar `src/lista.js` → validar 13 candidatos
3. Implementar `src/perfil.js` + `src/fotos.js` → gerar `out/candidatos.json`
4. Rodar coleta real, revisar `erros.json`, importar no banco

## Fase 3 — Frontend (React + Tailwind)
1. `npm create vite@latest frontend -- --template react` (na pasta atual vazia, usar remediar: criar em temp e mover) + `npm i -D tailwindcss postcss autoprefixer` + `react-router-dom` + `recharts`
2. Telas: `Home (cards+filtros+KPIs)`, `Perfil (:slug com abas)`, `Comparador`, `Rankings`
3. Componentes: `CandidateCard`, `FilterBar`, `KpiHeader`, `PatrimonioChart`, `DoadoresBar`, `TimelineHistorico`
4. Integrar `VITE_API_URL` → backend; estado de loading/erro; imagens locais com fallback para URL original
5. Responsivo mobile-first; modo escuro? (decidir em perguntas)

## Fase 4 — Polish
- [ ] Rodapé de fonte + disclaimer apartidário
- [ ] SEO básico + share cards
- [ ] README raiz com como rodar os 3 módulos
- [ ] Re-coleta semanal até outubro/2026 (2º turno 25/10/2026)

## Riscos
- G1 muda layout → scraper quebra → mitigado pela API TSE como fallback
- Valores de bens/receitas ausentes no HTML → preencher via TSE
- Fotos com hotlink bloqueado → já previsto download local
- Dados sensíveis/eleitorais: manter apenas dados públicos de candidatura
