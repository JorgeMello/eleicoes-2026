# 🗳️ Eleições 2026 — Plataforma de Inteligência, Auditoria e Controle dos Dados Eleitorais

> Sistema integrado para acompanhamento, comparação analítica de candidaturas, prestação de contas, auditoria contábil oficial do Tribunal Superior Eleitoral (TSE), cruzamento de despesas e doações, controle dos dados de empresas fornecedoras, consolidação de pesquisas eleitorais, exportação cívica de dados abertos e otimização para agentes de IA (GEO / AIO) para as Eleições de 2026.

[![Website](https://img.shields.io/badge/Acesse_Online-eleicoes.osidosos.com.br-0070f3?style=for-the-badge&logo=google-chrome&logoColor=white)](https://eleicoes.osidosos.com.br)
[![Open Data](https://img.shields.io/badge/Open_Data-CSV_%7C_JSON-10b981?style=for-the-badge&logo=microsoftexcel&logoColor=white)](https://eleicoes.osidosos.com.br/llms.txt)
[![GEO / AIO Ready](https://img.shields.io/badge/AI_Ready-llms.txt-8b5cf6?style=for-the-badge&logo=openai&logoColor=white)](https://eleicoes.osidosos.com.br/llms.txt)
[![Instagram](https://img.shields.io/badge/Instagram-@cuidadorpessoaidosa-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/cuidadorpessoaidosa/)
[![GitHub](https://img.shields.io/badge/GitHub-Repositório_Oficial-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JorgeMello/eleicoes-2026)
[![License](https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌐 Acesso Online e Ecossistema

A plataforma está disponível online para livre navegação pública, com código aberto e acompanhamento institucional:

* 🚀 **Plataforma Online em Produção:**  
  👉 [**https://eleicoes.osidosos.com.br**](https://eleicoes.osidosos.com.br)  
  *(Acesse a versão em produção, com interface reativa, gráficos dinâmicos, comparador e consulta completa).*

* 🤖 **Padrão GEO / AIO para Agentes de IA (`llms.txt`):**  
  👉 [**https://eleicoes.osidosos.com.br/llms.txt**](https://eleicoes.osidosos.com.br/llms.txt)  
  *(Manifesto e guia estruturado para consumo direto por agentes como ChatGPT Search, Perplexity, Claude e Google Gemini).*

* 📖 **Manual do Usuário e Guia de Insights:**  
  👉 [**https://eleicoes.osidosos.com.br/manual**](https://eleicoes.osidosos.com.br/manual)  
  *(Guia didático com 7 capítulos e 8 estratégias práticas para extrair os melhores insights políticos da plataforma).*

* 📸 **Instagram Oficial:**  
  👉 [**@cuidadorpessoaidosa (instagram.com/cuidadorpessoaidosa)**](https://www.instagram.com/cuidadorpessoaidosa/)  
  *(Canal oficial no Instagram com notícias, esclarecimentos e atualizações periódicas).*

* 🤝 **Portal Parceiro:**  
  👉 [**https://cuidador.xyz**](https://cuidador.xyz/)  
  *(Iniciativa de acolhimento e suporte ao ecossistema da pessoa idosa).*

---

## 📌 Sumário
- [Acesso Online e Ecossistema](#-acesso-online-e-ecossistema)
- [Visão Geral](#-visão-geral)
- [Dados Abertos, Exportação Cívica e Padrão GEO / AIO (Fase 1)](#-dados-abertos-exportação-cívica-e-padrão-geo--aio-fase-1)
- [Engenharia de Performance e Carregamento Ultrarrápido (0ms)](#-engenharia-de-performance-e-carregamento-ultrarrápido-0ms)
- [Auditoria Contábil e Validação Oficial do TSE](#-auditoria-contábil-e-validação-oficial-do-tse-divulgacandcontas)
- [Página de Manual do Usuário e Insights](#-página-de-manual-do-usuário-e-insights)
- [Fontes de Dados Públicos](#-fontes-de-dados-públicos)
- [Métodos e Engenharia do Sistema](#-métodos-e-engenharia-do-sistema)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Passo a Passo de Instalação e Execução](#-passo-a-passo-de-instalação-e-execução)
  - [1. Pré-requisitos](#1-pré-requisitos)
  - [2. Banco de Dados MySQL](#2-banco-de-dados-mysql)
  - [3. Backend (API REST em CodeIgniter 4)](#3-backend-api-rest-em-codeigniter-4)
  - [4. Scraper e Validação TSE](#4-scraper-e-validação-tse)
  - [5. Frontend (SPA em React + Vite)](#5-frontend-spa-em-react--vite)
- [Comandos CLI de Auditoria do TSE](#-comandos-cli-de-auditoria-do-tse)
- [Contrato da API REST](#-contrato-da-api-rest)
- [Controle dos Dados e Rastreabilidade](#-controle-dos-dados-e-rastreabilidade)
- [Segurança e Blindagem de Infraestrutura](#-segurança-e-blindagem-de-infraestrutura)
- [Canais Oficiais](#-canais-oficiais)
- [Licença](#-licença)

---

## 🎯 Visão Geral

O projeto **Eleições 2026** centraliza, normaliza, audita e correlaciona dados públicos oficiais das eleições brasileiras. A aplicação permite aos cidadãos, pesquisadores e analistas:
* **Comparar candidaturas lado a lado** com 12 critérios objetivos (patrimônio declarado, histórico de mandatos, evolução contábil, receitas arrecadadas e despesas contratadas).
* **Exportar dados cívicos em formato aberto** (`.csv` otimizado para Excel e `.json` estruturado) com 1 clique.
* **Verificar a conformidade jurídica e fiscal com o TSE**, inspecionando selos oficiais, processos no PJe, CNPJ de campanha e limites legais de gastos.
* **Analisar a origem dos recursos de campanha**, diferenciando verbas públicas (Fundo Eleitoral FEFC / Fundo Partidário) de doações privadas de pessoas físicas e autofinanciamento.
* **Acompanhar séries históricas de pesquisas de intenção de voto** registradas no PesqEle/TSE com gráficos interativos.
* **Exercer o controle social dos dados**, identificando fornecedores compartilhados entre múltiplos concorrentes.

---

## 📊 Dados Abertos, Exportação Cívica e Padrão GEO / AIO (Fase 1)

A plataforma conta com uma camada dedicada de **Open Data** e compatibilidade com motores de Inteligência Artificial:

### 1. Padrão GEO / AIO (`/llms.txt`)
* Arquivo público padronizado em [`https://eleicoes.osidosos.com.br/llms.txt`](https://eleicoes.osidosos.com.br/llms.txt).
* Desenvolvido para que robôs e mecanismos de busca generativa (**ChatGPT Search**, **Perplexity**, **Claude**, **Google AI Overviews**) citem o projeto como fonte oficial de dados eleitorais.
* Contém especificação das rotas públicas, contratos REST com exemplos de parâmetros, contextualização jurídica do financiamento eleitoral e diretrizes de conformidade com a LGPD.

### 2. Motor de Exportação Cívica (`.csv` e `.json`)
* **100% Client-Side:** Todo o processamento ocorre no navegador do usuário via [`exportData.js`](frontend/src/lib/exportData.js), eliminando carga de processamento na hospedagem.
* **Compatibilidade Nativa com Microsoft Excel:** Exportação com delimitador ponto e vírgula (`;`) e Byte Order Mark (`\uFEFF`), garantindo acentuação e caracteres em português perfeitos sem configurações manuais de importação.
* **Pontos de Exportação na Interface:**
  * **Listagem Geral ([Home.jsx](frontend/src/pages/Home.jsx)):** Botão *"Exportar Candidatos"* que respeita os filtros ativos em tempo real (partido, patrimônio, busca).
  * **Declaração de Bens ([Perfil.jsx](frontend/src/pages/Perfil.jsx)):** Botão *"Exportar Bens"* na aba de patrimônio, exportando cada item discriminado com descrição oficial e valor declarado.
  * **Prestação de Contas ([Perfil.jsx](frontend/src/pages/Perfil.jsx)):** Botões *"Exportar Doadores"* e *"Exportar Gastos"* nas tabelas da aba Contas.

### 3. Card de Origem dos Recursos (`OrigemRecursosCard.jsx`)
* Mapeamento financeiro das receitas de campanha segundo a legislação vigente (Lei 9.504/97 e STF ADI 4650):
  * **Fundo Público (FEFC / Partidário):** Órgãos partidários e diretórios.
  * **Doações de Pessoas Físicas:** Cidadãos terceiros (limitadas a 10% do rendimento bruto).
  * **Recursos Próprios (Autofinanciamento):** Doações do próprio candidato (limitadas a 10% do teto).
  * **Vaquinha Eleitoral (Crowdfunding):** Plataformas credenciadas pelo TSE.
* Barra multi-tom empilhada, valores monetários em R$, percentuais e **Diagnóstico Cívico** em texto explicativo.

---

## ⚡ Engenharia de Performance e Carregamento Ultrarrápido (0ms)

A plataforma implementa uma suíte de otimização de performance para garantir carregamento instantâneo, mesmo em conexões móveis:

1. **Cache SWR no Cliente ([`clientCache.js`](frontend/src/lib/clientCache.js)):**
   * Padrão *Stale-While-Revalidate* em memória. Ao navegar entre cargos ou retornar à listagem, os dados prévios são renderizados em **0 milissegundos**, enquanto uma checagem silenciosa em segundo plano atualiza as informações se houver novidades.
2. **Skeleton Loaders Modernos:**
   * Componentes [`CandidateCardSkeleton.jsx`](frontend/src/components/CandidateCardSkeleton.jsx) e [`StatsSkeleton.jsx`](frontend/src/components/StatsSkeleton.jsx) eliminam telas em branco e mensagens de "carregando...", mantendo a fluidez visual da interface.
3. **HTTP Caching e Validação ETag no Backend:**
   * Cabeçalhos `Cache-Control: public, max-age=300, stale-while-revalidate=600` e validação de `ETag` (resposta `304 Not Modified`) nas rotas de candidatos e estatísticas, poupando CPU e banco de dados.
4. **Compressão e Cache Estático no Apache:**
   * Regras de compressão gzip / Brotli e cache de longo prazo (`ExpiresDefault "access plus 1 year"`) para bundles do Vite no `.htaccess`.

---

## ⚖️ Auditoria Contábil e Validação Oficial do TSE (DivulgaCandContas)

A plataforma conta com uma **suíte de auditoria e reconciliação contábil em 5 fases**, construída em conformidade estrita com as resoluções e limites do Tribunal Superior Eleitoral:

1. **Fase 1 — Descoberta de Endpoints e Conectividade Online:**
   * Script automatizado [`scraper/src/tse-divulga.js`](scraper/src/tse-divulga.js) que testa a conectividade direta com o portal *DivulgaCandContas* e valida online a integridade dos planos de governo em PDF (100% confirmados com HTTP 200).
2. **Fase 2 — Reconciliação Contábil e Auditoria Fiscal:**
   * Script [`scraper/src/reconciliar-tse.js`](scraper/src/reconciliar-tse.js) executando checagem matemática item a item dos bens declarados vs. patrimônio total, verificação de cumprimento do teto legal de gastos (R$ 88.944.030,80 para 1º turno de Presidente) e validação de documentos (CPF/CNPJ) de 100% dos doadores e fornecedores.
3. **Fase 3 — Modelagem Relacional Dedicada (`candidatos_tse`):**
   * Tabela relacional 1:1 criada via migration [`2026-09-20-000014_CreateCandidatosTse.php`](backend/app/Database/Migrations/2026-09-20-000014_CreateCandidatosTse.php), isolando os dados de certificação jurídica e fiscal dos cadastros gerais.
4. **Fase 4 — Ferramenta CLI de Sincronização em Produção:**
   * Comando `php spark tse:auditar` (e `composer tse:auditar`) com suporte a `--reconciliar`, `--slug`, `--dry-run`, `--verbose` e renderização de tabelas ASCII ricas.
5. **Fase 5 — Selo Visual, Chapa Presidencial e Painéis de Auditoria no Frontend:**
   * Etiqueta esmeralda **`Verificado TSE · Deferido`** exibida nos cards de listagem e no cabeçalho do perfil.
   * **Card Oficial da Chapa Presidencial:** Apresentação do Titular e do Vice-Presidente lado a lado no perfil e na aba "Geral", destacando as alianças partidárias da chapa majoritária indivisível (CF/88, art. 77) e modal de auditoria jurídica de sucessão (CF/88, art. 79) e processo unificado no PJe.
   * **Central do Plano de Governo Oficial (PDF do TSE):** Botão em destaque para download em 1 clique do documento original arquivado e homologado sob protocolo judicial autêntico no repositório público do TSE.
   * **Auditoria da Aba "Bens":** Banner institucional com checagem matemática (100% consistente, tolerância zero a desvios), pílulas de filtragem por categoria (Imóveis, Empresas/Quotas, Aplicações/Contas, Veículos), busca textual em tempo real e tabela enriquecida com badges `✓ TSE` e barras de participação percentual.
   * **Auditoria da Aba "Contas":** Painel oficial de prestação de contas no topo da aba com receitas arrecadadas, despesas contratadas, balanço financeiro de campanha, consumo do teto legal de gastos, badges *"✓ TSE"* em cada doador/fornecedor e selo de homologação no modal analítico de controle dos dados.
   * **Roteamento Canônico Nacional das Eleições 2026:** Links externos integrados diretamente ao código eleitoral oficial `20322002026` (`#/candidato/regiao/BR/20322002026`) no portal DivulgaCandContas, eliminando qualquer falha de carregamento.

---

## 📖 Página de Manual do Usuário e Insights

Disponível diretamente na rota [`/manual`](https://eleicoes.osidosos.com.br/manual) e acessível pela barra de navegação com o ícone de livro aberto, a plataforma disponibiliza um guia interativo estruturado em 7 capítulos:

1. **Introdução e Filosofia:** Transparência radical, dados oficiais auditados e combate à desinformação.
2. **Navegação Básica:** Como interpretar os cards, métricas principais e abas de perfil.
3. **Filtros Combinados:** Como utilizar buscas, filtros de partido, gênero, instrução, etnia, profissão e o controle deslizante de patrimônio.
4. **Ferramenta de Comparação Lado a Lado:** Seleção de até 3 candidatos simultâneos, gráficos de barras de bens e análise de 12 critérios objetivos.
5. **Pesquisas Eleitorais:** Como ler cenários estimulados, espontâneos, segundo turno e margem de erro.
6. **Controle dos Dados de Prestação de Contas:** Como abrir o modal detalhado de fornecedores e doadores e analisar cruzamentos de empresas contratadas por múltiplos adversários.
7. **8 Estratégias Práticas para Obter os Melhores Insights:** Dicas consolidadas de inteligência cívica para identificar padrões de financiamento, disparidades patrimoniais e consistência de campanha.

---

## 🌐 Fontes de Dados Públicos

Todos os dados consumidos, transformados e apresentados pelo sistema são originários de bases públicas governamentais e veículos autorizados (Lei 12.527/2011 - LAI):

1. **Tribunal Superior Eleitoral (TSE) — DivulgaCandContas & Dados Abertos:**
   * Dados oficiais de registro de candidatura (número de urna, partido, coligação, ocupação, certidões).
   * Declarações de bens discriminadas e evolução patrimonial histórica.
   * Prestação de contas oficial: receitas (doadores físicos e partidários) e despesas (fornecedores contratados).
   * Teto legal de gastos de campanha e situação jurídica do registro.
2. **Sistema de Registro de Pesquisas Eleitorais (PesqEle / TSE):**
   * Número de registro, período de campo, tamanho da amostra, margem de erro e nível de confiança.
3. **Portais de Comunicação e Cobertura Editorial (G1 Eleições / TSE):**
   * Fotos oficiais padronizadas em alta resolução e levantamentos dos principais institutos de pesquisa (Datafolha, Quaest, Paraná Pesquisas, Ipec, etc.).

---

## ⚙️ Métodos e Engenharia do Sistema

```text
┌────────────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
│ 1. Coleta & Auditoria  │  ──>  │ 2. Ingestão Relacional │  ──>  │ 3. API RESTful         │  ──>  │ 4. Interface Reativa   │
│ (Playwright / Node.js) │       │ (CLI Spark / MySQL)    │       │ (CodeIgniter 4 / PHP)  │       │ (React 19 / Vite / UI) │
│ • scraper/src/         │       │ • php spark tse:auditar│       │ • /api/candidatos      │       │ • Selo Verificado TSE  │
│ • Reconciliação TSE    │       │ • candidatos + tse     │       │ • /api/empresas        │       │ • Exportação CSV/JSON  │
│ • Validação de PDFs    │       │ • Cache HTTP & ETag    │       │ • Auth X-API-Key       │       │ • Cache SWR & Skeletons│
└────────────────────────┘       └────────────────────────┘       └────────────────────────┘       └────────────────────────┘
```

1. **Coleta Automatizada e Auditoria Contábil:**
   * Desenvolvida em Node.js com motor **Playwright (Chromium)** e módulos HTTP nativos com *rate limiting* preventivo.
   * Reconciliação matemática autônoma: soma dos bens declarados, cálculo de superávit/déficit e confronto com tetos oficiais do TSE.
2. **Ingestão e Normalização Relacional:**
   * Comandos de linha de comando (`php spark eleicoes:importar`, `php spark tse:auditar`).
   * Normalização estrita de documentos fiscais (limpeza e formatação de CPF de 11 dígitos e CNPJ de 14 dígitos).
   * Precisão monetária fixa (`DECIMAL(15,2)`) para evitar discrepâncias contábeis.
3. **Camada de Serviços e API REST:**
   * PHP 8.2+ com o framework CodeIgniter 4.
   * Endpoints RESTful rápidos com cache HTTP, validação de ETag, `LEFT JOIN` relacional para metadados de certificação e tipagem segura.
4. **Visualização e Controle Analítico:**
   * Single Page Application (SPA) construída com React 19, Vite e Tailwind CSS.
   * Gráficos dinâmicos com **Recharts**, tema claro/escuro persistente, skeletons modernos e botões de exportação cívica.

---

## 📂 Arquitetura do Projeto

O repositório está organizado no padrão **Monorepo**:

```text
eleicoes2026/
├── backend/                  # API RESTful em PHP 8.2 / CodeIgniter 4
│   ├── app/
│   │   ├── Commands/         # Comandos Spark CLI (EleicoesImportar, TseAuditar, etc.)
│   │   ├── Config/           # Configurações do framework (rotas, banco, CORS, filtros de segurança)
│   │   ├── Controllers/Api/  # Endpoints REST (Candidatos, Empresas, Pesquisas, Rankings)
│   │   ├── Database/         # Migrations versionadas (incluindo candidatos_tse)
│   │   └── Models/           # Entidades (CandidatoModel, CandidatoTseModel, BemModel, etc.)
│   ├── public/               # Ponto de entrada web (index.php, .htaccess blindado)
│   └── spark                 # Utilitário CLI do CodeIgniter
├── frontend/                 # Interface Web SPA Reativa
│   ├── public/               # Arquivos públicos estáticos
│   │   ├── llms.txt          # Manifesto de Inteligência Artificial (GEO / AIO)
│   │   └── .htaccess         # Regras de SPA, compressão e cache estático
│   ├── src/
│   │   ├── components/       # Componentes visuais (ExportButton, OrigemRecursosCard, TseBadge, etc.)
│   │   ├── pages/            # Páginas (Home, Perfil, Comparador, Rankings, Pesquisas, Manual)
│   │   └── lib/              # Utilitários (exportData.js, clientCache.js, api.js, formatadores BRL)
│   ├── index.html            # Ponto de entrada SPA
│   └── vite.config.js        # Configuração do Vite
├── scraper/                  # Robôs de Coleta e Auditoria
│   ├── src/
│   │   ├── index.js          # Coletor Playwright de candidatos e fotos
│   │   ├── tse-divulga.js    # Fase 1: Descoberta e teste de conectividade TSE
│   │   └── reconciliar-tse.js# Fase 2: Auditoria contábil e reconciliação fiscal
│   └── out/                  # Relatórios consolidados e bases JSON estruturadas
├── documentacao/             # Especificações técnicas e manuais de engenharia (ignorado no git)
├── .gitignore                # Exclusão estrita (documentacao, .env, credenciais, logs)
├── LICENSE                   # Licença de uso
└── README.md                 # Esta documentação
```

---

## 🚀 Passo a Passo de Instalação e Execução

### 1. Pré-requisitos
* **PHP 8.2 ou superior** com extensões ativas: `intl`, `mbstring`, `mysqli`, `curl`. (XAMPP recomendado no Windows).
* **MySQL 5.7+ ou MariaDB 10.4+**.
* **Node.js 18.x ou superior** e **npm**.
* **Apache** (via XAMPP) ou outro servidor web apontando para o diretório do projeto.

---

### 2. Banco de Dados MySQL

1. Inicie os serviços **Apache** e **MySQL** no XAMPP Control Panel.
2. Acesse o phpMyAdmin (`http://localhost/phpmyadmin`) ou terminal SQL e crie a base de dados:
   ```sql
   CREATE DATABASE eleicoes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

---

### 3. Backend (API REST em CodeIgniter 4)

1. Acesse a pasta do backend:
   ```bash
   cd backend
   ```
2. Crie o arquivo `.env` a partir do modelo:
   ```bash
   cp .env.example .env
   ```
3. Configure as credenciais do banco e a chave de API em `.env`:
   ```ini
   database.default.hostname = localhost
   database.default.database = eleicoes
   database.default.username = root
   database.default.password = 
   database.default.port = 3306

   # Chave de segurança para rotas administrativas de ingestão
   ELEICOES_API_KEY = "sua_chave_secreta_aqui"
   ```
4. Execute as migrações para criar todas as tabelas:
   ```bash
   php spark migrate
   ```

---

### 4. Scraper e Validação TSE

1. Acesse o diretório do scraper em um novo terminal:
   ```bash
   cd scraper
   ```
2. Instale as dependências e o navegador Chromium do Playwright:
   ```bash
   npm install
   npx playwright install chromium
   ```
3. Execute o diagnóstico de conectividade com o TSE:
   ```bash
   npm run tse:descobrir
   ```
4. Execute a auditoria contábil e reconciliação fiscal oficial:
   ```bash
   npm run tse:reconciliar
   ```
5. Importe e sincronize todos os dados com o banco de dados via Spark:
   ```bash
   cd ../backend
   php spark eleicoes:importar
   ```

---

### 5. Frontend (SPA em React + Vite)

1. Acesse o diretório do frontend em outro terminal:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie o `.env` local:
   ```bash
   cp .env.example .env
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Abra o navegador em: `http://localhost:5173`

---

## 💻 Comandos CLI de Auditoria do TSE

O comando `php spark tse:auditar` foi construído com suporte avançado a flags para operações autônomas em ambiente de produção:

```bash
# Execução padrão (lê o relatório estruturado e atualiza a tabela candidatos_tse)
php spark tse:auditar

# Execução ponta a ponta (roda o reconciliador Node.js e sincroniza o MySQL em um só comando)
php spark tse:auditar --reconciliar

# Auditoria filtrada por um candidato específico
php spark tse:auditar --slug=lula

# Modo de simulação (calcula tudo e imprime a tabela sem alterar o banco de dados)
php spark tse:auditar --dry-run

# Modo detalhado com demonstrativo contábil completo
php spark tse:auditar --verbose

# Atalho via Composer
composer tse:auditar
```

---

## 📡 Contrato da API REST

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/candidatos` | Lista candidaturas com filtros combinados (`cargo`, `uf`, `partido`, `busca`, `patrimonio_min`, `patrimonio_max`). Inclui metadados de certificação (`tse_status`, `tse_situacao`, `tse_cnpj`). Responde com cache HTTP e ETag. |
| `GET` | `/api/candidatos/{slug}` | Ficha detalhada do candidato, incluindo o nó de auditoria oficial `tse`, bens declarados, histórico de mandatos, doadores e gastos. |
| `GET` | `/api/candidatos/{slug}/bens` | Relação completa e ordenada dos bens declarados pelo candidato. |
| `GET` | `/api/empresas/{documento}` | **Controle dos dados do fornecedor/doador**: total recebido, percentual de impacto e relação de quais outras candidaturas contrataram a mesma empresa. |
| `GET` | `/api/pesquisas` | Pesquisas eleitorais agregadas por cargo, instituto e evolução temporal. |
| `GET` | `/api/rankings` | Classificações por maior patrimônio, maior arrecadação e maiores despesas de campanha. |
| `GET` | `/api/estatisticas` | Macroindicadores consolidados da eleição por gênero, raça/cor, instrução e partido com cabeçalho de cache. |
| `POST` | `/api/coletas` | Ingestão autenticada de lotes de coletas (Requer cabeçalho `X-API-Key` ou `Bearer` correspondente a `ELEICOES_API_KEY`). |

---

## 🔍 Controle dos Dados e Rastreabilidade

O módulo de **controle dos dados** da plataforma foi projetado para assegurar máxima transparência cívica:
* **Identificação Fiscal Unificada:** Despesas e doações são identificadas pelo documento fiscal oficial (CPF para pessoas físicas e CNPJ para pessoas jurídicas/comitês).
* **Cruzamento Fornecedor ➔ Candidaturas:** Ao clicar em qualquer empresa na aba *Contas* do perfil de um candidato, abre-se o modal de controle dos dados exibindo:
  - O valor total recebido na eleição corrente.
  - A participação percentual nas despesas da candidatura sob consulta.
  - **Quais outros candidatos contrataram a mesma empresa**, revelando conexões entre concorrentes e coligações distintas.

---

## 🔐 Segurança e Blindagem de Infraestrutura

1. **Dados Estritamente Públicos:** Todos os registros provêm de certidões e prestações de contas públicas disponibilizadas pelo TSE (Lei nº 9.504/1997 e Lei nº 12.527/2011).
2. **Blindagem Apache contra Exposição:** Arquivos `.htaccess` no frontend e backend configurados para bloquear sumariamente o acesso a arquivos sensíveis (`.env`, `.env.*`, arquivos de configuração, manifestos e dotfiles).
3. **Autenticação Obrigatória na Ingestão:** Rota administrativa `/api/coletas` protegida por verificação de chave de API (`ELEICOES_API_KEY`), impedindo injeção de dados não autorizados em produção.
4. **Isolamento de Credenciais e Documentos Internos:** Arquivos de ambiente locais (`.env.*`), pasta `documentacao/` e credenciais estão estritamente fora do controle de versão público através do `.gitignore`.
5. **Conformidade LGPD (Lei nº 13.709/2018):** Mascaramento automático de CPF de doadores e pessoas físicas (`***.XXX.XXX-**`), preservando a transparência integral de pessoas jurídicas (CNPJ).
6. **Polidez com Servidores Oficiais:** Os coletores empregam intervalos seguros e *rate limiting* para não sobrecarregar as APIs públicas da Justiça Eleitoral.

---

## 📢 Canais Oficiais

* 🌐 **Website:** [https://eleicoes.osidosos.com.br](https://eleicoes.osidosos.com.br)
* 🤖 **GEO / AIO:** [https://eleicoes.osidosos.com.br/llms.txt](https://eleicoes.osidosos.com.br/llms.txt)
* 📸 **Instagram:** [@cuidadorpessoaidosa](https://www.instagram.com/cuidadorpessoaidosa/)
* 🐙 **GitHub:** [JorgeMello/eleicoes-2026](https://github.com/JorgeMello/eleicoes-2026)

---

## 📄 Licença

Este projeto é disponibilizado sob a licença **MIT** para fins de transparência cívica, pesquisa acadêmica e análise de dados públicos. Todos os direitos reservados aos canais oficiais do projeto.
