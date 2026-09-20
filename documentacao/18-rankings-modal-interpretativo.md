# 18 — Helper interpretativo nos Rankings (modal) (20/09/2026)

## Ideação
**Pedido:** em cada card de ranking, ao lado do título, um helper que abre um **modal com
informações completas já interpretadas** — texto corrido que a pessoa lê e entende ("tal
candidato tem tanto…"), não só números.

**Por que modal e não tooltip/caixa:** o conteúdo é longo (líder, vice, diferença, soma, média,
faltantes, fonte) — precisa de espaço de leitura; modal centralizado com overlay funciona em
mouse, teclado e touch, sem o problema de recorte do `overflow` (decisão análoga ao doc 14).

**Conteúdo gerado automaticamente** (a partir dos dados do próprio ranking):
1. Líder: "X (PARTIDO número) lidera com R$ Y."
2. Segundo + diferença (se houver): "Z vem em segundo com R$ W — diferença de R$ D."
3. Agregado: "Somados, os N candidatos com dados acumulam R$ T (média de R$ M)."
4. Faltantes (se houver): "K ainda sem valor coletado: nomes."
5. Fonte: "Fonte: TSE via G1 (coleta Playwright). Valores sujeitos a atualização."

## Documentação técnica
- Arquivo: `frontend/src/pages/Rankings.jsx`.
- Botão ⓘ (SVG) ao lado de cada título de card → estado `ajudaRank` (`'patrimonio' | 'receitas' | null`).
- `interpreta(rows, chave)`: filtra nulos, ordena desc, monta as frases (usa `brl()`).
- Modal: overlay `fixed inset-0 bg-black/50`, painel central `role="dialog" aria-modal`,
  fecha por ✕, clique no overlay e tecla ESC; trava o scroll do body enquanto aberto; dark mode.
- Sem nova requisição: usa os `rows` já carregados.

## Bloco "O que é receita" (20/09/2026)
No modal de **Maiores receitas**, antes do texto interpretado, há um bloco de definição em
destaque: fundo verde-claro com borda (`emerald`), ícone SVG de moeda para chamar atenção e
texto em **negrito**: receita de campanha = todo o dinheiro arrecadado para financiar a
campanha (doações dentro da lei, recursos do partido, Fundo Eleitoral, financiamento coletivo),
tudo declarado ao TSE na prestação de contas.

## Verificação
- `npm run build` OK.
- Teste Playwright: clicar no ⓘ de "Maior patrimônio" → modal visível contendo líder + valor;
  ESC fecha.
