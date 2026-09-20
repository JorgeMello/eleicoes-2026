# 07 — Status da implementação (20/09/2026)

## Backend (CodeIgniter 4 + MySQL `eleicoes`)
- `.env` ligado no banco `eleicoes` (root, XAMPP), `app.baseURL` + timezone `America/Sao_Paulo` corrigido
- Migrations 6 tabelas aplicadas; seed 13 presidentes; CORS liberado p/ `localhost:5173`
- API em `http://localhost/eleicoes2026/backend/public/index.php/api`:
  `GET /candidatos`, `/candidatos/:slug`, `/candidatos/:slug/bens`,
  `/rankings/patrimonio`, `/rankings/receitas`, `/estatisticas`, `POST /coletas` (X-API-Key)
- Comando: `php spark eleicoes:importar` (lê `../scraper/out/candidatos.json`)
- **Dados atuais:** 13 candidatos, 143 bens, 29 candidaturas anteriores, 105 doadores, 56 gastos

## Scraper (`scraper/`, Playwright + Chromium)
- `npm run coletar` → lista (13 slugs) + 13 perfis + fotos locais + enriquecimento TSE (best-effort)
- Validado: 13/13, 0 falhas; fotos 200x200 em `backend/public/uploads/candidatos/` (sem hotlink)
- Correções aplicadas: parser de número (meio do texto), nome via `h2`, foto via `background-image`
  (regex tolerante a parênteses), bens com valor extraído do `R$`, rankings com nome real (ignora CNPJ/CPF)

## Frontend (`frontend/`, Vite + React + Tailwind v4 + Recharts)
- Rotas multi-cargo: `/:cargo`, `/:cargo/:slug`, `/:cargo/comparar` (até 3), `/:cargo/rankings`
- `.env` com `VITE_API_URL` + `VITE_BACKEND_PUBLIC`; `npm run build` OK; `npm run dev` OK (:5173)

## Como rodar (ordem)
1. Apache + MySQL no XAMPP (portas 80/3306)
2. Backend já migrado e populado; re-coleta: `cd scraper && npm run coletar`, depois `cd ../backend && php spark eleicoes:importar`
3. Frontend: `cd frontend && npm install && npm run dev`

## Pendências / próximos passos
- TSE: `src/tse.js` é best-effort — confirmar código da eleição 2026 na API DivulgaCandContas para valores 100% oficiais
- Expandir coleta para governador/senador/deputados (modelagem e rotas já prontas; só parametrizar URLs G1)
- Re-coleta periódica até 25/10/2026; considerar code-splitting do bundle (recharts ~659KB)
