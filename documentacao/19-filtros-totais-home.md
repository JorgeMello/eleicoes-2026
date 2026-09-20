# 19 — Card de filtros + totais nos gráficos (Home) (20/09/2026)

## Ideação
**Pedido (tela governador):** abaixo dos gráficos, um card de filtros chamativo e explicativo
para o público idoso (patrimônio, alfabética, partido, instrução etc.); nos gráficos, a
contagem total junto ao título.

**Decisões:**
- Filtros saíram do topo e viraram um **card destacado** (borda verde, ícone de lupa, título
  "Filtrar candidatos", texto explicativo): Buscar, UF (só p/ cargos estaduais), Partido,
  Profissão, Instrução, Cor/etnia, Patrimônio mín–máx (R$) e Ordem — cada campo com rótulo
  grande e legenda de ajuda ("Ex.: Lula ou 13").
- Patrimônio exigiu **backend novo** (`patrimonio_min/max` em `GET /candidatos`); valores nulos
  ficam de fora quando a faixa é usada (documentado no card? não — comportamento padrão de
  filtro numérico; registrado aqui).
- Badge "N filtros ativos" + botão "Limpar filtros"; subtítulo mostra "X de Y candidaturas".
- Totais nos 3 donuts: "N candidaturas em K grupos" sob cada título.

## Documentação técnica
- `backend/app/Controllers/Api/Candidatos.php`: `patrimonio_min/max` numéricos (`>=`, `<=`).
- `frontend/src/pages/Home.jsx`: estados `instrucao/cor/profissao/patMin/patMax` via querystring
  (filtros sobrevivem a reload/compartilhamento); opções derivadas de `estatisticas`;
  `totalGrupos()` p/ os totais; `campo` centraliza o estilo dos inputs.

## Verificação
- API: `patrimonio_min=1000000` → 8 presidentes.
- Playwright (`/governador?uf=SP` + mín 100000): card presente, 3 totais, URL com o filtro,
  lista 7→2 (Haddad, Tarcísio); screenshot conferido.
