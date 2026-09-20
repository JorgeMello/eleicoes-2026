# 20 — Fotos no botão "Comparar candidatos" (Home) (20/09/2026)

## Ideação
O botão "Comparar candidatos" levava a `/comparar?a=X&b=Y` (2 primeiros da lista) mas não
dizia **quem** seria comparado. Agora exibe as **fotos sobrepostas** dos 2 candidatos + os
nomes ("Comparar A e B"), eliminando a dúvida antes do clique. Fotos via `fotoUrl()` (local
primeiro, fallback G1); sem foto, inicial do nome — mesmo padrão do `CandidateCard`.

## Documentação técnica
- `frontend/src/pages/Home.jsx`: import `fotoUrl`; bloco do CTA usa `lista[0]`/`lista[1]`
  (mesmos da URL) com avatares sobrepostos (`-space-x-3`, anel branco) e nomes truncados.

## Verificação
- `npm run build` OK.
- Teste Playwright: link contém 2 `<img>` e os nomes; href mantém `?a=&b=`.
