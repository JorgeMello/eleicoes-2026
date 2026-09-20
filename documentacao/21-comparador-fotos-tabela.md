# 21 — Fotos na tabela do Comparador (20/09/2026)

## Ideação
Na tela Comparar, as colunas eram identificadas só pelo nome. Agora cada cabeçalho exibe a
**foto (avatar) + nome** do candidato, facilitando o reconhecimento — mesma convenção do
`CandidateCard` (foto local primeiro, inicial do nome como fallback).

## Documentação técnica
- `frontend/src/pages/Comparador.jsx`: import `fotoUrl`; `<th>` vira bloco flex com avatar
  `h-10 w-10 rounded-full` + nome. Selects nativos seguem texto puro (limitação do `<option>`).

## Verificação
- `npm run build` OK.
- Teste Playwright: `/presidente/comparar?a=lula&b=zema` → 2 `<img>` nos `<th>` da tabela.
