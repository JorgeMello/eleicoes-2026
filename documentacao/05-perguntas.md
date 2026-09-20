# 05 — Perguntas, dicas e pontos de decisão

## Perguntas (responda quando puder — bloqueiam próximas fases)
1. **Banco de dados:** qual nome do banco, host/porta, usuário/senha? Posso já ligar o `.env` + testar conexão?
2. **Frontend:** pode ser Vite + React + Tailwind? Tailwind v3 (estável) ou v4 (nova)? Biblioteca de gráficos: Recharts ou Chart.js?
3. **Escopo:** só presidente ou já preparar para governador/senador/deputados (mesma fonte G1)?
4. **Comparador 2–3 candidatos** é desejado no MVP ou deixo para v2?
5. **Fonte numérica:** topa usar API oficial do TSE como fonte primária de valores e G1 só para slugs/fotos? (recomendo SIM)
6. **Fotos:** baixar localmente (recomendado) ou hotlink G1?
7. **Atualização:** coleta única ou re-coleta periódica até o 2º turno (25/10/2026)?

## Dicas / sugestões
- Crie um VirtualHost `eleicoes2026.test` apontando para `backend/public` em vez de usar `localhost/eleicoes2026/.../index.php` — URLs da API ficam limpas.
- Não inicialize o Vite direto na pasta `frontend/` vazia sem backup — o `npm create vite` reclama de diretório não vazio em alguns casos; faremos via temp + move.
- Guarde o `out/candidatos.json` de cada coleta com data (`candidatos-2026-09-19.json`) para comparar evolução de patrimônio/receitas.
- Adicione `slug` derivado da URL G1 como chave estável — nome pode ter variação de acento.

## Críticas / considerações honestas
- Dizer que "bd e backend estão configurados" não confere hoje: `.env` comentado + `Database.php` vazio + `Routes.php` mínimo. Precisamos da Fase 1 antes do dashboard funcionar.
- Scraping puro do G1 para valores é frágil; sem o TSE como fallback, o dashboard pode exibir patrimônio/receitas nulos.
- 13 candidatos é pouco volume — não precisa de paginação complexa nem cache agressivo no MVP; foque em filtros e comparador, que dão mais valor.

## Próximo passo proposto
Assim que responder as perguntas acima, eu: (1) configuro backend+Migrations, (2) crio `scraper/` Playwright funcional, (3) inicializo React+Tailwind e as telas base.
