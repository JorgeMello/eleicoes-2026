# 01 — Modelagem de dados proposta (MySQL + CodeIgniter 4)

## Tabelas

### `candidatos`
| campo | tipo | obs |
|---|---|---|
| id | INT PK AI | |
| slug | VARCHAR(80) UNIQUE | ex. `lula`, `flavio-bolsonaro` (derivado da URL G1) |
| nome | VARCHAR(120) | nome de urna |
| nome_completo | VARCHAR(180) NULL | via TSE, se disponível |
| partido | VARCHAR(20) | sigla: PT, PL, NOVO... |
| numero | TINYINT UNSIGNED | 13, 22, 30... |
| cargo | VARCHAR(20) DEFAULT 'presidente' | permite expandir p/ governador depois |
| foto_url_original | TEXT NULL | URL `s2-g1.glbimg.com...` |
| foto_local | VARCHAR(255) NULL | `/uploads/candidatos/lula.jpeg` |
| perfil_g1_url | TEXT | URL canônica do perfil |
| profissao | VARCHAR(120) NULL | ex. `torneiro mecânico` |
| genero | VARCHAR(20) NULL | filtro G1 tem Feminino/Masculino |
| cor_etnia | VARCHAR(30) NULL | branca, preta, parda, amarela, indígena |
| grau_instrucao | VARCHAR(60) NULL | |
| plano_governo_url | TEXT NULL | link TSE divulgacandcontas |
| vice_nome | VARCHAR(120) NULL | |
| vice_partido | VARCHAR(20) NULL | |
| patrimonio_total | DECIMAL(15,2) NULL | soma calculada ou valor exibido |
| receitas_total | DECIMAL(15,2) NULL | contas 2026 |
| despesas_total | DECIMAL(15,2) NULL | |
| limite_gastos | DECIMAL(15,2) NULL | |
| coletado_em | DATETIME | timestamp da coleta |
| fonte_atualizado_em | VARCHAR(60) NULL | ex. `18/09/2026 20:42` exibido no G1 |
| raw_json | JSON NULL | snapshot bruto p/ auditoria |

### `bens`
| campo | tipo | obs |
|---|---|---|
| id | INT PK AI | |
| candidato_id | INT FK -> candidatos.id | ON DELETE CASCADE |
| tipo | VARCHAR(120) | `Apartamento`, `Terreno`, `VGBL`... |
| descricao | TEXT | `50% do apartamento em São Bernardo...` |
| valor | DECIMAL(15,2) NULL | confirmar se G1 renderiza via JS — Playwright deve extrair |

### `candidaturas_anteriores`
| campo | tipo | obs |
|---|---|---|
| id | INT PK AI | |
| candidato_id | INT FK | |
| ano | SMALLINT | 2022, 2018, 2006... |
| cargo | VARCHAR(60) | |
| partido | VARCHAR(20) | |
| resultado | VARCHAR(30) | Eleito, Não eleito, Inapto... |

### `doadores` (ranking doadores)
| campo | tipo | obs |
|---|---|---|
| id | INT PK AI | |
| candidato_id | INT FK | |
| nome | VARCHAR(180) | `Direção Nacional - Pt` |
| valor | DECIMAL(15,2) NULL | se só houver %, guardar % e estimar valor via receitas_total |
| percentual | DECIMAL(5,2) NULL | `97.1` |

### `gastos` (ranking gastos / fornecedores)
Mesma estrutura de `doadores`: `nome, valor NULL, percentual NULL`.

### `coletas` (log de scraping)
| campo | tipo | obs |
|---|---|---|
| id | INT PK AI | |
| iniciado_em / finalizado_em | DATETIME | |
| total_lista | TINYINT | esperado 13 |
| total_perfis_ok | TINYINT | |
| total_falhas | TINYINT | |
| detalhes | JSON NULL | lista de slugs com erro |

## Migrations CodeIgniter 4 (a criar)
- `app/Database/Migrations/2026-09-19-000001_CreateCandidatos.php`
- `..._CreateBens.php`, `..._CreateCandidaturasAnteriores.php`, `..._CreateDoadores.php`, `..._CreateGastos.php`, `..._CreateColetas.php`

## Índices sugeridos
- `candidatos.slug` UNIQUE, `candidatos.numero` UNIQUE, `candidatos.partido` INDEX
- `bens.candidato_id`, `doadores.candidato_id`, etc. INDEX

## Observações de coleta
- Valores monetários no G1-lista vêm com filtro min/max de patrimônio, mas nos perfis o HTML estático nem sempre traz o número — o Playwright com `waitForSelector` + avaliação JS precisa confirmar. Fallback: API TSE DivulgaCand.
- `genero` não aparece no perfil individual (só como filtro da lista) — cruzar com TSE ou inferir? **Não inferir:** deixar NULL e preencher via TSE.
