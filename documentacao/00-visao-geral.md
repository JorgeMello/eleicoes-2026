# Dashboard Candidatos a Presidente — Brasil 2026
## 00 — Visão geral e ideação

**Data:** 19/09/2026
**Fonte-alvo:** https://g1.globo.com/politica/eleicoes/2026/quem-sao-os-candidatos/presidente.ghtml
**Fonte oficial dos dados (por trás do G1):** TSE — Tribunal Superior Eleitoral
**Stack pretendida:** Backend CodeIgniter 4 (PHP 8.2+, XAMPP) + MySQL + Frontend React + Tailwind + Scraper Playwright (Node.js)

---

## 1. Objetivo

Criar um dashboard público/interno que centralize os **13 candidatos a presidente em 2026** (levantados em 19/09/2026) com perfil completo, comparáveis entre si:

| # | Candidato | Partido | Nº |
|---|-----------|---------|----|
| 1 | Clariana Barao | DC | 27 |
| 2 | Edmilson Costa | PCB | 21 |
| 3 | Escritor Augusto Cury | AVANTE | 70 |
| 4 | Flavio Bolsonaro | PL | 22 |
| 5 | Hertz Dias | PSTU | 16 |
| 6 | Leonardo Avalanche | PRTB | 28 |
| 7 | Lula | PT | 13 |
| 8 | Renan Santos | MISSÃO | 14 |
| 9 | Ronaldo Caiado | PSD | 55 |
| 10 | Rui Costa Pimenta | PCO | 29 |
| 11 | Samara | UP | 80 |
| 12 | Veterinário Wilson Grassi | DEMOCRATA | 35 |
| 13 | Zema | NOVO | 30 |

> Atenção: lista pode mudar (impugnações, desistências, troca de vice, atualização TSE). O scraper precisa ser **re-executável**.

## 2. O que cada página de perfil contém (ex.: `/presidente/lula.ghtml`)

Verificado via perfil do Lula em 19/09/2026:

1. **Cabeçalho:** nome, partido, número, foto, profissão, etnia/cor, grau de instrução
2. **Plano de governo:** link externo para `divulgacandcontas.tse.jus.br`
3. **Candidaturas anteriores:** ano, cargo, partido, resultado (Eleito/Inapto/etc.)
4. **Total de bens + lista de bens:** tipo + descrição (valores nem sempre visíveis no HTML simplificado — confirmar via Playwright com JS renderizado)
5. **Vice-presidente:** nome + partido
6. **Contas 2026:** receitas, total despesas, limite de gastos
7. **Ranking doadores + %** e **Ranking gastos + %**
8. **Filtros da página lista:** gênero, cor, partido, ocupação, grau instrução, patrimônio (min/max), busca nome/número, ordenação

Tudo isso é o **escopo mínimo do dashboard**.

## 3. Proposta de telas do dashboard (React + Tailwind)

### 3.1. Home / Visão geral
- Cards dos 13 candidatos: foto, nome, partido+número, profissão, patrimônio total
- Barra de busca + filtros (partido, profissão, instrução, cor, faixa patrimônio) — espelhando filtros do G1
- Ordenação: alfabética, número, patrimônio, idade (se coletarmos data nascimento via TSE)
- KPIs no topo: total candidatos, nº partidos, maior/menor patrimônio, distribuição por gênero/cor (gráficos donut/barra)

### 3.2. Página de perfil `/candidato/:slug`
- Hero com foto grande, nome, partido, número, vice, profissão, instrução, cor/gênero
- Abas: `Visão geral | Bens | Histórico eleitoral | Contas | Plano de governo`
- Bens: tabela + total + gráfico por tipo
- Histórico: timeline de candidaturas anteriores
- Contas: receitas x despesas x limite + top doadores + top fornecedores (barras horizontais)
- Botões: link original G1, link plano de governo TSE, compartilhar

### 3.3. Comparador (diferencial)
- Seleção de 2–3 candidatos lado a lado: patrimônio, nº bens, instrução, profissão, histórico, receitas/despesas
- Tabela comparativa + radar simples

### 3.4. Rankings
- Maior patrimônio, maiores receitas, maiores despesas, mais bens declarados
- Distribuição por partido / ocupação / instrução

## 4. Arquitetura proposta

```
[ G1 lista + 13 perfis ] --Playwright--> [ JSON bruto ] --> [ import PHP/Node ] --> [ MySQL via CodeIgniter 4 API ]
                                                                                              |
                                                                                              v
                                                                              [ React + Tailwind Dashboard ] --fetch--> [ /api/candidatos ... ]
```

- `scraper/` (Node.js + Playwright, fora de backend/frontend): `lista.js` + `perfil.js` + `fotos.js`
- `backend/` (CodeIgniter 4): Models + Controllers API REST JSON + Migrations + Seeder de importação
- `frontend/` (React + Vite + Tailwind + React Router + Recharts ou Chart.js): consome API
- `documentacao/`: ideação, modelagem, contratos API

### Por que separar o scraper do backend?
Playwright é Node.js; CodeIgniter é PHP. Manter `scraper/` isolado evita acoplar dependências e permite rodar coleta via cron sem derrubar a API.

## 5. Estado atual verificado (19/09/2026)

- `backend/`: CodeIgniter 4 padrão, **sem configuração real de banco** (`.env` todo comentado, `Config/Database.php` com credenciais vazias, `Routes.php` só com `/`). Não há Models/Migrations/Controllers de candidatos ainda.
- `frontend/`: **pasta vazia** — React + Tailwind ainda não inicializados.
- `documentacao/`: vazia antes desta ideação.
- Dizer "já criei o bd e configurei o backend" precisa de validação: informar nome do banco, usuário/senha e baseURL para eu ligar os pontos.

## 6. Decisões críticas / recomendações

1. **Prefira a API oficial do TSE (`divulgacandcontas.tse.jus.br`) como fonte primária e o G1 como espelho.** O G1 só republica o TSE. A API do TSE dá JSON limpo, evita quebra por mudança de layout e tem implicação legal menor. Playwright no G1 continua válido para foto + validação cruzada.
2. **Não hotlinke fotos do G1 (`s2-g1.glbimg.com`).** Baixe para `backend/public/uploads/candidatos/` ou `frontend/public/candidatos/` e sirva localmente (evita bloqueio/CORS e preserva histórico).
3. **Respeite robots/rate-limit:** delay 2–5s entre perfis, User-Agent identificável, 1 retry, log de erros. São só 13 páginas — não precisa paralelismo agressivo.
4. **Versionamento dos dados:** guardar `coletado_em` + `fonte_url` + JSON bruto por coleta para auditoria ("dados fornecidos pelo TSE, via G1 em 18/09/2026 20:42").
5. **Licença/ética:** exibir rodapé "Fonte: TSE via G1. Projeto educacional, sem vínculo partidário." Não deturpar dados; linkar perfil original.

Ver detalhes em: `01-modelagem-dados.md`, `02-contrato-api.md`, `03-plano-playwright.md`, `04-roadmap.md`.
