# 22 — Slider de patrimônio 0–500 milhões (Home) (20/09/2026)

## Ideação
O filtro de patrimônio com digitação de números é hostil para o público idoso. Troca por
**2 sliders (mínimo e máximo) de R$ 0 a R$ 500 milhões** — teto cobre o maior patrimônio
coletado (~R$ 495 mi): extremidade **"R$ 500 milhões" em destaque** (negrito, verde, fonte
maior) e valor atual de cada slider exibido formatado por extenso ("R$ 41,3 milhões").
Passo de R$ 100 mil (preciso p/ patrimônios pequenos, usável p/ grandes).

## Documentação técnica
- `frontend/src/pages/Home.jsx`: bloco Patrimônio vira 2 `<input type="range" min=0
  max=500000000 step=100000>` com `accent-emerald-600`; `fmtFaixa()` formata por extenso;
  `upd()` mantém querystring (`patrimonio_min/max` em reais — API inalterada); ao mover um
  slider além do outro, o par é ajustado (faixa sempre válida).

## Verificação
- `npm run build` OK.
- Teste Playwright: sliders presentes, teto "R$ 500 milhões" visível; mín=100M filtra a lista.
