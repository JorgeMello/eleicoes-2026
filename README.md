# 🗳️ Eleições 2026 — Plataforma de Inteligência e Controle dos Dados Eleitorais

> Sistema integrado para acompanhamento, comparação analítica de candidaturas, prestação de contas, cruzamento de despesas e doações, controle dos dados de empresas fornecedoras e consolidação de pesquisas eleitorais para as Eleições de 2026.

---

## 📌 Sumário
- [Visão Geral](#-visão-geral)
- [Fontes de Dados Públicos](#-fontes-de-dados-públicos)
- [Métodos e Engenharia do Sistema](#-métodos-e-engenharia-do-sistema)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Passo a Passo de Instalação e Execução](#-passo-a-passo-de-instalação-e-execução)
  - [1. Pré-requisitos](#1-pré-requisitos)
  - [2. Banco de Dados MySQL](#2-banco-de-dados-mysql)
  - [3. Backend (API REST em CodeIgniter 4)](#3-backend-api-rest-em-codeigniter-4)
  - [4. Scraper (Coletores Automatizados Playwright)](#4-scraper-coletores-automatizados-playwright)
  - [5. Frontend (SPA em React + Vite)](#5-frontend-spa-em-react--vite)
- [Contrato da API REST](#-contrato-da-api-rest)
- [Controle dos Dados e Rastreabilidade](#-controle-dos-dados-e-rastreabilidade)
- [Segurança e Conformidade](#-segurança-e-conformidade)
- [Licença](#-licença)

---

## 🎯 Visão Geral

O projeto **Eleições 2026** centraliza, normaliza e correlaciona dados públicos oficiais das eleições brasileiras de 2026. A aplicação permite aos cidadãos, pesquisadores e analistas políticos:
* Comparar candidaturas lado a lado com critérios objetivos (patrimônio, histórico eleitoral, receitas e gastos).
* Acompanhar a evolução temporal de pesquisas de intenção de voto registradas no TSE.
* Realizar o **controle dos dados** de prestação de contas, visualizando fornecedores contratados, doadores de campanha e cruzamentos de contratação entre diferentes candidatos.

---

## 🌐 Fontes de Dados Públicos

Todos os dados consumidos, transformados e apresentados pelo sistema são originários de bases públicas governamentais e veículos de comunicação autorizados, em conformidade com a Lei de Acesso à Informação (Lei 12.527/2011):

1. **Tribunal Superior Eleitoral (TSE) — DivulgaCandContas & Dados Abertos:**
   * Dados oficiais de registro de candidaturas (número de urna, partido, coligação, gênero, estado civil, ocupação).
   * Declarações de bens discriminadas item a item e evolução patrimonial histórica.
   * Prestação de contas oficial: demonstrativos de receitas (doadores pessoas físicas e partidos) e despesas (fornecedores de produtos e serviços).
   * Situação jurídica da candidatura (deferida, sub judice, impugnada, etc.).

2. **Sistema de Registro de Pesquisas Eleitorais (PesqEle / TSE):**
   * Identificação de registro, período de coleta, número de entrevistados, margem de erro, nível de confiança e entidade contratante.

3. **Portais de Comunicação e Cobertura Editorial (G1 Eleições / TSE):**
   * Metadados de acompanhamento, fotos oficiais padronizadas em alta resolução e levantamentos de institutos de pesquisa (Datafolha, Quaest, Paraná Pesquisas, Ipec, etc.).

---

## ⚙️ Métodos e Engenharia do Sistema

O fluxo de dados da plataforma é dividido em quatro etapas metódicas:

```text
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 1. Coleta       │  ──>  │ 2. Ingestão     │  ──>  │ 3. API REST     │  ──>  │ 4. Interface    │
│ (Playwright JS) │       │ (CLI Spark / DB)│       │ (CodeIgniter 4) │       │ (React 19 / UI) │
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

1. **Coleta Automatizada (Scraping):**
   * Desenvolvida em Node.js com motor **Playwright (Chromium)**.
   * Emprega delays adaptativos (2 a 5 segundos) e cabeçalhos regionais (`pt-BR`) para garantir resiliência e evitar sobrecarga nos servidores públicos.
   * Captura dados de candidatos, descarrega e armazena localmente fotos de perfil oficiais e compila saídas estruturadas em arquivos JSON (`scraper/out/`).

2. **Ingestão e Normalização Relacional:**
   * Comandos de linha de comando (`php spark eleicoes:importar`) ou endpoints autenticados via chave secreta (`X-API-Key`).
   * Normalização rigorosa de documentos: limpeza e padronização de CPF e CNPJ (apenas dígitos) para eliminar homônimos e viabilizar cruzamento relacional consistente.
   * Tratamento de campos monetários para tipos decimais exatos (`DECIMAL(15,2)`), prevenindo erros de arredondamento.

3. **Camada de Serviços e API:**
   * Desenvolvida em PHP 8.1+ com o micro-framework CodeIgniter 4.
   * Arquitetura em camadas com Controllers RESTful, Models com validação e Migrations de banco de dados versionadas.

4. **Visualização e Controle Analítico (Frontend):**
   * Interface Single Page Application (SPA) reativa construída com React 19, Vite e Tailwind CSS.
   * Gráficos interativos de séries temporais e barras usando **Recharts**.
   * Filtros combinados no cliente (cargo, partido, UF, faixa de patrimônio, situação eleitoral).

---

## 📂 Arquitetura do Projeto

O repositório é configurado no formato **Monorepo**:

```text
eleicoes2026/
├── backend/                  # API RESTful em PHP 8 / CodeIgniter 4
│   ├── app/
│   │   ├── Commands/         # Comandos Spark CLI de importação de coletas
│   │   ├── Config/           # Configurações do framework
│   │   ├── Controllers/Api/  # Endpoints REST (Candidatos, Empresas, Pesquisas, etc.)
│   │   ├── Database/         # Migrations relacionais do banco de dados
│   │   └── Models/           # Entidades e regras de persistência
│   ├── public/               # Ponto de entrada Apache/Nginx (index.php)
│   └── spark                 # Utilitário CLI do CodeIgniter
├── frontend/                 # Interface Web SPA
│   ├── src/
│   │   ├── components/       # Componentes visuais, modais, gráficos e cards
│   │   ├── pages/            # Páginas (Home, Candidato, Comparador, Pesquisas)
│   │   └── utils/            # Formatadores, helpers e critérios
│   ├── index.html            # Ponto de entrada SPA
│   └── vite.config.js        # Configuração do Vite e Tailwind
├── scraper/                  # Robôs de Coleta Playwright
│   ├── src/                  # Coletores de listas, perfis, fotos e pesquisas
│   └── out/                  # Arquivos JSON de dados processados
├── .gitignore                # Regras de exclusão (documentacao, .env, temporários)
└── README.md                 # Esta documentação
```

---

## 🚀 Passo a Passo de Instalação e Execução

### 1. Pré-requisitos
* **PHP 8.1 ou superior** com extensões ativas: `intl`, `mbstring`, `mysqli`, `curl`. (Ambiente XAMPP recomendado no Windows).
* **MySQL 5.7+ ou MariaDB 10.4+**.
* **Node.js 18.x ou superior** e gerenciador de pacotes **npm**.
* **Apache** (via XAMPP) ou outro servidor HTTP apontando para o diretório do projeto.

---

### 2. Banco de Dados MySQL

1. Inicie os módulos **Apache** e **MySQL** no painel do XAMPP.
2. Acesse o phpMyAdmin (`http://localhost/phpmyadmin`) ou cliente SQL e crie a base de dados:
   ```sql
   CREATE DATABASE eleicoes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

---

### 3. Backend (API REST em CodeIgniter 4)

1. Acesse o diretório do backend:
   ```bash
   cd backend
   ```
2. Crie o arquivo de configuração de ambiente `.env` a partir do modelo seguro:
   ```bash
   cp .env.example .env
   ```
3. Se necessário, ajuste as credenciais do banco em `.env`:
   ```ini
   database.default.hostname = localhost
   database.default.database = eleicoes
   database.default.username = root
   database.default.password = 
   database.default.port = 3306
   ```
4. Execute as migrações para construir todas as tabelas:
   ```bash
   php spark migrate
   ```
   *A API estará ativa em: `http://localhost/eleicoes2026/backend/public/index.php/api`*

---

### 4. Scraper (Coletores Automatizados Playwright)

1. Acesse o diretório do scraper em um novo terminal:
   ```bash
   cd scraper
   ```
2. Instale as dependências e o navegador Chromium do Playwright:
   ```bash
   npm install
   npx playwright install chromium
   ```
3. Execute a coleta automatizada de dados:
   ```bash
   # Coleta completa de candidatos presidenciais e bens
   node src/index.js

   # Coleta de pesquisas eleitorais registradas
   node src/pesquisas/index.js
   ```
4. Importe os dados coletados para o banco de dados via Spark:
   ```bash
   cd ../backend
   php spark eleicoes:importar ../scraper/out/candidatos.json
   php spark eleicoes:importar-pesquisas ../scraper/out/pesquisas.json
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
3. Crie o arquivo de ambiente `.env` local:
   ```bash
   cp .env.example .env
   ```
4. Inicie o servidor de desenvolvimento Vite:
   ```bash
   npm run dev
   ```
5. Abra o navegador em:
   ```text
   http://localhost:5173
   ```

---

## 📡 Contrato da API REST

A API do backend fornece as seguintes rotas principais:

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/candidatos` | Lista candidatos com filtros (cargo, estado, partido, busca). |
| `GET` | `/api/candidatos/{id}` | Ficha completa do candidato, histórico de bens e cargos passados. |
| `GET` | `/api/candidatos/{id}/contas` | Relação detalhada de receitas, doadores e despesas pagas. |
| `GET` | `/api/empresas/{documento}` | **Controle dos dados do fornecedor**: valor recebido e candidatos pagadores. |
| `GET` | `/api/pesquisas` | Pesquisas eleitorais agregadas por cargo, data e instituto. |
| `GET` | `/api/rankings` | Classificações por patrimônio, arrecadação e maiores despesas. |
| `GET` | `/api/estatisticas` | Indicadores globais consolidados da eleição. |
| `POST` | `/api/coletas` | Ingestão autenticada de lotes JSON (Requer header `X-API-Key`). |

---

## 🔍 Controle dos Dados e Rastreabilidade

O módulo de **controle dos dados** da plataforma foi projetado para elevar a transparência das contas eleitorais:
* **Identificação Fiscal Unificada:** Despesas e doações são associadas ao CNPJ/CPF oficial registrado na prestação de contas.
* **Agregação Fornecedor ➔ Campanhas:** Ao inspecionar uma empresa fornecedora de serviços de campanha (marketing, gráfica, aviação, consultoria), o sistema exibe:
  - Valor total recebido na eleição corrente.
  - Percentual relativo nos gastos do candidato em análise.
  - Relação de **quais outros candidatos contratualizaram com a mesma empresa**, permitindo rastrear o fluxo financeiro entre coligações e legendas.

---

## 🔐 Segurança e Conformidade

1. **Dados Estritamente Públicos:** O sistema não manipula senhas pessoais, dados de votação individual ou informações sob sigilo judicial.
2. **Ambiente Isolado:** Nenhuma credencial de banco de dados ou chave de API de produção é commitada no repositório (`.env` listado no `.gitignore`).
3. **Respeito aos Servidores de Origem:** Os scrapers operam com limitação voluntária de requisições por segundo (*rate limiting* e espaçamento temporal) para preservar a disponibilidade dos serviços oficiais.

---

## 📄 Licença

Este projeto é desenvolvido para fins de pesquisa, transparência pública e análise de dados eleitorais. Todos os direitos reservados.
