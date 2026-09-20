# 14 — Helpers de critério no Comparador (20/09/2026)

## Ideação
**Problema:** na tela Comparar (`/:cargo/comparar`), as linhas (Partido, Patrimônio, Receitas…)
são siglas e termos eleitorais que nem todo eleitor entende. Cada critério precisa de um ícone
de ajuda ao lado explicando o significado.

**Opções avaliadas:**
1. Tooltip flutuante (hover) — descartado como único meio: a tabela vive dentro de um contêiner
   com `overflow-x-auto`, que recorta balões posicionados absolutamente; além disso não funciona
   em telas touch.
2. Caixa de ajuda fixa (adotada): o ícone ⓘ (SVG, sem emoji) tem `title` nativo para hover e, ao
   **clicar**, exibe a explicação numa caixa destacada acima da tabela, com botão de fechar.
   Funciona em mouse, teclado e touch, sem recorte, nos dois temas.

**Decisão:** ícone SVG "i" ao lado de cada critério + caixa de ajuda contextual + `title` de apoio.

## Textos dos critérios
| Critério | Ajuda |
|---|---|
| Partido | Legenda pela qual o candidato concorre em 2026 (fonte: TSE via G1). |
| Número | Número digitado na urna eletrônica (2 dígitos para presidente e governador). |
| Profissão | Ocupação declarada pelo candidato no registro do TSE. |
| Instrução | Grau de instrução declarado no registro do TSE. |
| Cor/etnia | Autodeclaração de cor/etnia do registro do TSE. |
| Vice | Companheiro de chapa (vice-presidente/vice-governador) declarado ao TSE. |
| Patrimônio | Soma dos valores dos bens declarados ao TSE. Pode estar parcial se algum bem veio sem valor. |
| Receitas | Total arrecadado pela campanha em 2026 (prestação de contas ao TSE). |
| Despesas | Total gasto pela campanha em 2026 (prestação de contas ao TSE). |
| Nº bens | Quantidade de itens na lista de bens declarados ao TSE. |
| Eleições disputadas | Candidaturas anteriores encontradas no histórico do candidato. |

## Documentação técnica
- Arquivo: `frontend/src/pages/Comparador.jsx`.
- `LINHAS` virou array de objetos `{ label, get, ajuda }` (antes: pares `[label, fn]`).
- Estado `ajudaSel` (rótulo do critério selecionado ou `null`); clicar no ícone alterna;
  clicar de novo ou no ✕ fecha.
- Acessibilidade: botão com `aria-label="O que significa X?"` + `aria-expanded`; caixa com
  `role="status"`; funciona por teclado (botão nativo focável).
- Tema escuro: caixa `dark:border-slate-700 dark:bg-slate-800`; ícone herda a cor do texto.

## Verificação
- `npm run build` OK.
- Teste Playwright: abrir `/presidente/comparar?a=lula&b=zema`, clicar no ⓘ de Patrimônio,
  caixa aparece com o texto; clicar de novo fecha.
