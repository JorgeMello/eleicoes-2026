# 24 — Card de filtros expansível (Home) (20/09/2026)

## Ideação
O card "Filtrar candidatos" ocupava muito espaço vertical. Agora nasce **recolhido**; clicar
no cabeçalho abre/fecha. Se a URL já chega com filtros (link compartilhado), abre sozinho.

## Documentação técnica
- `frontend/src/pages/Home.jsx`: estado `filtrosAbertos` (inicial = há filtros na querystring);
  cabeçalho vira `<button aria-expanded>` com chevron que gira; corpo com `hidden` quando
  fechado; badge de filtros ativos continua visível no cabeçalho.

## Verificação
- `npm run build` OK.
- Teste Playwright: `/presidente` abre recolhido; clique abre; `/presidente?busca=lula` abre expandido.
