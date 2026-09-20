# 16 — Destaque do título + bandeira no menu (20/09/2026)

## Pedido
1. Na dashboard, o título com o cargo ("… · presidente") deve aparecer em **MAIÚSCULAS** para dar
   mais destaque.
2. No menu superior, exibir a **bandeira do Brasil ao lado do texto "Dashboard"**.

## Decisão
- Maiúsculas via classe CSS `uppercase` (visual em caixa alta, sem alterar o dado `cargo` —
  rotas, API e filtros seguem minúsculos). Aplicado nos 3 títulos que exibem o cargo:
  Home ("Candidatos · PRESIDENTE"), Comparador e Rankings (mesmo padrão, consistência).
- Bandeira em **SVG inline** (retângulo verde, losango amarelo, globo azul — versão simplificada
  sem estrelas/faixa), sem dependência externa nem emoji; `role="img"` + `aria-label` para
  acessibilidade; posicionada **logo após o texto "Dashboard"** na marca do cabeçalho.

## Arquivos
- `frontend/src/components/Layout.jsx`: componente `BandeiraBrasil` + marca com `inline-flex`
  para alinhar bandeira e texto.
- `frontend/src/pages/Home.jsx`, `Comparador.jsx`, `Rankings.jsx`: `<span className="uppercase">`
  em volta do `{cargo}` nos `<h1>`.

## Verificação
- `npm run build` OK.
- Teste Playwright: `text-transform` computado do cargo = `uppercase`; SVG da bandeira presente
  no header com `aria-label="Bandeira do Brasil"`; screenshot do cabeçalho conferido visualmente.
