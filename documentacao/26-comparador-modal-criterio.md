# 26 — Modal explicativa + análise por critério (Comparador) (20/09/2026)

## Ideação
O ⓘ de cada critério abria só uma caixinha com 1 frase. Agora abre um **modal extremamente
informativo** com 2 seções: **"O que é"** (explicação didática em 2–3 frases) e **"Análise"**
(leitura pronta dos dados dos candidatos comparados: ranking, diferenças, total).
Padrão visual do modal de Rankings (doc 18): overlay, ESC, scroll travado, dark mode.

## Documentação técnica
- `frontend/src/pages/Comparador.jsx`: itens de `LINHAS` ganham `sobre` (texto longo) e
  `num` (valor numérico p/ análise; `moeda: true` em Patrimônio/Receitas/Despesas).
- `analisa(item, validos)`: critérios numéricos → ranking + diferença líder↔2º (absoluta e %)
  + soma; categóricos → valor de cada um + aviso quando todos são iguais.
- Estado `ajudaSel` passa a abrir o modal (caixa antiga removida); fecha por ✕/overlay/ESC.

## Fotos na análise (20/09/2026)
Cada linha da Análise referente a um candidato exibe seu **avatar** (foto local via `fotoUrl()`,
fallback inicial do nome); linhas-resumo (diferença, soma, "todos iguais") seguem só texto.
Para isso `analisa()` retorna objetos `{ foto, texto }` em vez de strings.

## Verificação
- `npm run build` OK.
- Teste Playwright: ⓘ Patrimônio → modal com "O que é", "Análise", nomes e valores; ESC fecha.
