# Atualização do Banco de Dados para Publicação no Servidor Web (Hostinger)

> **Data:** 21/09/2026  
> **Status:** Banco de Dados Atualizado e Homologado  
> **Arquivo Gerado:** `database/dump_eleicoes2026_hostinger.sql` (26,0 MB)  
> **Script de Conferência:** `database/verificar_banco_eleicoes2026.sql`  

---

## 1. O Que Foi Atualizado no Database

O dump consolidado em `database/dump_eleicoes2026_hostinger.sql` foi inteiramente regenerado a partir da base local, contemplando:

1. **Novos Índices Compostos de Extrema Performance:**
   * `idx_cand_cargo_uf_nome` em `candidatos(cargo, uf, nome)` — elimina `filesort` e permite ordenação alfabética submilissegundo (< 1ms).
   * `idx_cand_cargo_uf_numero` em `candidatos(cargo, uf, numero)` — acelera buscas por número de urna.
   * `idx_cand_cargo_uf_partido` em `candidatos(cargo, uf, partido)` — acelera filtros partidários e estatísticas agregadas.
   * `idx_bens_cand_valor` em `bens(candidato_id, valor)` — acelera soma e listagem de patrimônio dos candidatos.
2. **Registro de Todas as 16 Migrações do CodeIgniter 4:**
   * Inclui a migração `2026-09-20-000016_AddPerformanceIndexes` na tabela `migrations`.
3. **Dados Enriquecidos e 100% Homologados:**
   * 19.088 candidatos (13 Pres, 192 Gov, 308 Sen, 7.393 Dep. Federais, 11.182 Dep. Estaduais/Distritais).
   * 616 suplentes de senador (308 de 1º e 308 de 2º).
   * 19.088 registros de auditoria com o TSE (`candidatos_tse`).
   * 69.729 bens patrimoniais declarados.
   * 3.470 registros de doadores/receitas.
   * 3.743 registros de gastos/despesas.

---

## 2. Métricas Consolidadas do Banco de Dados

Execução auditada pelo script `database/verificar_banco_eleicoes2026.sql`:

| Tabela | Registros | Descrição |
| :--- | :--- | :--- |
| **`candidatos`** | **19.088** | 5 cargos, 27 UFs (Pres, Gov, Sen, Dep. Fed, Dep. Est/Dist) |
| **`candidato_suplentes`** | **616** | 308 primeiros e 308 segundos suplentes de Senador |
| **`candidatos_tse`** | **19.088** | Vínculos e homologação de tetos de gastos pelo TSE |
| **`bens`** | **69.729** | Declarações de bens detalhadas de todos os candidatos |
| **`doadores`** | **3.470** | Receitas e financiamento de campanha |
| **`gastos`** | **3.743** | Fornecedores e despesas contratadas |
| **`candidaturas_anteriores`**| **143** | Históricos de disputas eleitorais pregressas |
| **`pesquisas`** | **11** | Levantamentos e intenções de voto |
| **`pesquisa_resultados`** | **73** | Resultados estimulados dos levantamentos |
| **`institutos`** | **2** | Institutos cadastrados |
| **`migrations`** | **16** | 100% das migrações do framework registradas |

---

## 3. Instruções Passo a Passo para Publicação na Hostinger

### Opção A: Importação via phpMyAdmin (Recomendado)

1. Acesse o **hPanel da Hostinger** e entre no **phpMyAdmin** do banco de dados de produção (ex: `u899691051_eleicoes2026`).
2. Clique no nome do banco de dados na barra lateral esquerda.
3. Clique na aba superior **Importar**.
4. Clique em **Escolher arquivo** e selecione o arquivo local:
   `c:\xampp3\htdocs\eleicoes2026\database\dump_eleicoes2026_hostinger.sql`
5. Certifique-se de que o conjunto de caracteres esteja em **utf-8** (ou **utf8mb4**).
6. Clique no botão **Importar** (ou **Executar**) no final da página.
7. Aguarde a mensagem verde de sucesso: *"A importação foi finalizada com sucesso..."*.

---

### Opção B: Importação via Terminal SSH (Avançado / Muito Rápido)

Caso você tenha acesso SSH à Hostinger:

1. Envie o arquivo `dump_eleicoes2026_hostinger.sql` para o servidor (via FTP ou SCP).
2. Execute o comando de importação:
   ```bash
   mysql -u u899691051_tsehomologado -p u899691051_eleicoes2026 < dump_eleicoes2026_hostinger.sql
   ```
3. Digite a senha do banco de dados quando solicitada. A importação via terminal é concluída em poucos segundos.

---

## 4. Conferência Pós-Deploy

Após importar, acesse a aba **SQL** no phpMyAdmin e execute o conteúdo do arquivo:
`database/verificar_banco_eleicoes2026.sql`

O painel exibirá:
* Total de Candidatos: **19.088**
* Homologados TSE: **19.088** (100%)
* Total de Bens: **69.729**
* Migrations: **16**
* Índices B-Tree cobridores ativos para resposta instantânea da API.
