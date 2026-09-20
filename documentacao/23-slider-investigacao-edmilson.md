# 23 — Investigação: "Edmilson Costa, o mais rico, não aparece" (20/09/2026)

## Veredito
**O slider está correto; a premissa estava errada.** Edmilson Costa NÃO é o mais rico.

## Evidências
Patrimônios coletados do G1 (presidente), ordenados:
| # | Candidato | Patrimônio |
|---|---|---|
| 1 | Leonardo Avalanche | R$ 495.030.000 |
| 2 | Escritor Augusto Cury | R$ 242.593.012 |
| 3 | Zema | R$ 178.707.610 |
| … | … | … |
| 10 | **Edmilson Costa** | **R$ 454.485,68** (4 bens, soma conferida em re-coleta) |
| 13 | Rui Costa Pimenta | sem valor declarado (NULL) |

- Re-coleta do perfil do Edmilson em 20/09/2026: mesmos 4 bens, mesmo total → dado completo.
- API: `patrimonio_min=100000` → 11 resultados **com** Edmilson; `patrimonio_min=1000000` → 8
  **sem** Edmilson (R$ 454 mil < R$ 1 mi — exclusão correta).
- Ou seja: ele some do filtro exatamente quando o mínimo passa de R$ 454 mil, como deve ser.

## Ajuste aplicado (problema real encontrado no caminho)
Candidatos **sem valor declarado** (ex.: Rui Costa Pimenta, NULL) somem sob qualquer faixa de
patrimônio, sem explicação. Adicionada legenda no filtro:
"Candidatos sem valor declarado ficam de fora enquanto este filtro estiver ativo."

## Arquivos
- `frontend/src/pages/Home.jsx`: legenda explicativa (1 linha).
