# 02 — Contrato API (CodeIgniter 4 → React)

Base URL dev (XAMPP): `http://localhost/eleicoes2026/backend/public/index.php/api`
Ou com VirtualHost: `http://eleicoes2026.test/api` (recomendado — ver roadmap).

## Endpoints v1

| Método | Rota | Descrição | Query params |
|---|---|---|---|
| GET | `/candidatos` | lista resumida p/ cards + filtros | `?busca=lula&partido=PT&ordenar=patrimonio_desc&profissao=&instrucao=&cor=` |
| GET | `/candidatos/:slug` | perfil completo (candidato + bens + histórico + doadores + gastos) | — |
| GET | `/candidatos/:slug/bens` | só bens (paginação futura) | — |
| GET | `/rankings/patrimonio` | top por patrimônio | `?limite=13` |
| GET | `/rankings/receitas` | top receitas/despesas | — |
| GET | `/estatisticas` | agregados p/ KPIs e gráficos | — |
| POST | `/coletas` | dispara importação do JSON do scraper (protegido por API key) | body: `{ lote: [...] }` |

## Exemplo `GET /candidatos`
```json
[
  {
    "slug": "lula",
    "nome": "Lula",
    "partido": "PT",
    "numero": 13,
    "foto_local": "/uploads/candidatos/lula.jpeg",
    "profissao": "torneiro mecânico",
    "cor_etnia": "branca",
    "grau_instrucao": "ensino fundamental completo",
    "patrimonio_total": null,
    "perfil_g1_url": "https://g1.globo.com/.../lula.ghtml"
  }
]
```

## Exemplo `GET /candidatos/lula`
```json
{
  "candidato": { "...": "...", "vice_nome": "Geraldo Alckmin", "vice_partido": "PSB" },
  "bens": [{ "tipo": "Apartamento", "descricao": "50% do apartamento...", "valor": null }],
  "historico": [{ "ano": 2022, "cargo": "Presidente", "partido": "PT", "resultado": "Eleito" }],
  "doadores": [{ "nome": "Direção Nacional - Pt", "percentual": 97.1 }],
  "gastos": [{ "nome": "delta3 comunicacao e projetos ltda", "percentual": 47.2 }]
}
```

## Regras
- Sempre JSON, `charset=utf-8`, CORS liberado apenas para `http://localhost:5173` (Vite) em dev.
- Cache de 1h em `/estatisticas` e `/rankings` (CodeIgniter Cache ou header).
- `POST /coletas` exige `X-API-Key` do `.env` — nunca expor no frontend.
