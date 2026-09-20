# 25 — Botão comparar com Lula, Flávio e Augusto Cury (20/09/2026)

## Ideação
O CTA "Comparar" usava os 2 primeiros da lista alfabética (Clariana, Edmilson). Passa a
comparar os 3 nomes de maior interesse, **nesta ordem: Augusto Cury, Flávio Bolsonaro e Lula**
(`?a=escritor-augusto-cury&b=flavio-bolsonaro&c=lula`), com as 3 fotos no botão.
Se algum slug não existir nos dados (ex.: outro cargo), cai para os 3 primeiros da lista.

## Documentação técnica
- `frontend/src/pages/Home.jsx`: `DESTAQUES_COMPARAR` (slugs fixos só p/ presidente) +
  `resolveComparar()` (slug → candidato, fallback lista); CTA com 3 avatares e nomes.
- **Empilhamento (20/09/2026):** no overlap, o último da ordem DOM pinta por cima — Lula (3º)
  ficava em destaque. Corrigido com `zIndex` decrescente: Augusto Cury (1º) no topo,
  Lula (3º) ao fundo (`style={{ zIndex: total - i }}` + `relative`).
- **Tamanho (20/09/2026):** botão em largura total (`w-full`, texto base, sem `truncate`).

## Verificação
- `npm run build` OK.
- Teste Playwright: href com os 3 slugs, 3 `<img>`, nomes no texto.
