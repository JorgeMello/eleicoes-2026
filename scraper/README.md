# Scraper Eleições 2026

Playwright (Node 20+) — G1 para slugs/fotos/textos + TSE para valores oficiais.

## Uso

```bash
cd scraper
npm install
npx playwright install chromium
npm run coletar
```

Saída: `out/candidatos.json` + `out/erros.json`.

## Importar no backend

```bash
cd ../backend
php spark eleicoes:importar ../scraper/out/candidatos.json
```

Ou via API:

```bash
curl -X POST http://localhost/eleicoes2026/backend/public/index.php/api/coletas \
  -H "Content-Type: application/json" \
  -H "X-API-Key: eleicoes2026-dev-key-troque-em-producao" \
  -d @out/candidatos.json
```

(O corpo aceita array direto ou `{ "lote": [...] }`.)

## Fotos

Baixadas localmente em `../backend/public/uploads/candidatos/{slug}.jpeg`.
O campo `foto_local` (`/uploads/candidatos/...`) é o que o frontend usa — sem hotlink.

## TSE

`src/tse.js` tenta `divulgacandcontas.tse.jus.br/divulga/rest/v2/...`.
Se o código da eleição 2026 divergir, ajuste a URL lá — a coleta G1 continua funcionando
e os campos numéricos ficam `null` até o enriquecimento.
