# 15 — Gráficos inline no Comparador (20/09/2026)

## Ideação
**Pedido:** na tela Comparar, ao lado do título ("Comparar até 3 candidatos · presidente"), um botão
"Gráficos" que exibe gráficos **na mesma tela, abaixo da tabela**, sem navegar.

**Público-alvo (idoso / cliente / interessado):** números como "R$ 41.350.925,55" em tabela são
difíceis de comparar de cabeça. Barras horizontais mostram de relance quem tem mais/menos.
Por isso os gráficos priorizam: barras horizontais (nomes legíveis, sem apertar), valores
escritos na ponta da barra em formato compacto ("R$ 41,3 mi"), legenda com as cores de cada
candidato e tooltip com o valor exato.

**Critérios escolhidos (da Profissão para baixo, só os comparáveis em número):**
| Gráfico | Critérios | Por quê |
|---|---|---|
| Dinheiro (R$) | Patrimônio, Receitas, Despesas | É a comparação que o eleitor mais pede; barra horizontal deixa a ordem visual óbvia |
| Contagens | Nº bens, Eleições disputadas | Mostra experiência (disputas) e volume patrimonial de forma simples |
| Fora | Partido, Número, Profissão, Instrução, Cor/etnia, Vice | Texto puro por candidato — gráfico de 2–3 fatias não informa nada; seguem só na tabela |

**UX:** botão toggle ao lado do título (ícone SVG de barras + "Gráficos"/"Ocultar gráficos",
`aria-expanded`); seção renderiza **abaixo da tabela** (a tabela não se move ao abrir);
usa os dados já carregados — nenhuma requisição nova; desabilitado até haver ao menos
1 candidato selecionado.

## Documentação técnica
- Arquivo: `frontend/src/pages/Comparador.jsx` (Recharts já usado nas outras telas).
- Estado `showGraficos` (bool, padrão fechado).
- Dados: `dinheiro = [{ criterio, [nomeCand]: Number(...) }]` e `contagens` no mesmo formato;
  nomes dos candidatos viram `dataKey` das `<Bar>` (paleta fixa com 3 cores distintas).
- `fmtMi(v)`: "R$ 41,3 mi" / "R$ 850 mil" / valor cheio abaixo de 1 mil — usado nos rótulos das
  barras (`<LabelList>`) e no tooltip (tooltip mostra também o valor exato via `brl()`).
- Barras horizontais (`layout="vertical"`), altura por linha, fonte dos eixos ≥ 12px,
  ticks herdam a cor do tema (regra global em `index.css`), nos dois temas.

## Ajustes de legibilidade (20/09/2026)
- **Legenda acima do gráfico:** `<Legend verticalAlign="top">` (padrão do Recharts é embaixo;
  em cima o eleitor identifica as cores antes de ler as barras).
- **Valores por extenso:** rótulos das barras de Dinheiro usam "R$ 41,3 milhões" (com plural
  "1 milhão" no singular) em vez da abreviação "mi"; "mil" mantido (já é palavra cheia);
  abaixo de mil, valor cheio via `brl()`. Tooltip segue com o valor exato.
- **Margem direita** (`margin.right = 110`) para os rótulos longos não serem cortados na borda.

## Verificação
- `npm run build` OK.
- Teste Playwright: `/presidente/comparar?a=lula&b=zema` — sem SVG antes do clique; após clicar
  em "Gráficos", 2 gráficos visíveis; reclique oculta.
- Re-teste pós-ajuste: legenda (`.recharts-legend-wrapper`) acima da área de plotagem e texto
  "milhões" presente nos rótulos (sem " mi" abreviado).
