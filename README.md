# 🗳️ Eleições 2026 — Plataforma de Inteligência Eleitoral

> Sistema integrado para acompanhamento, comparação analítica de candidaturas, prestação de contas, doadores, pesquisas de intenção de voto e dossiês de fornecedores para as Eleições de 2026.

---

## 🏛️ Arquitetura do Sistema

O projeto é estruturado em modelo **Monorepo**, dividido em três camadas:

```text
eleicoes2026/
├── backend/          # API RESTful em PHP 8.1+ e CodeIgniter 4 (XAMPP / MySQL)
├── frontend/         # Interface SPA em React + Vite + Tailwind/CSS
└── scraper/          # Coletores automatizados em Node.js com Playwright
```

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
* **PHP 8.1+** com extensões `intl`, `mbstring`, `mysqli` ativas (ex: via XAMPP).
* **MySQL / MariaDB** (porta 3306).
* **Node.js 18+** e **npm**.

---

### 2. Configurando o Backend (API)

1. Certifique-se de que o Apache e o MySQL estão rodando no XAMPP.
2. Crie a base de dados no MySQL:
   ```sql
   CREATE DATABASE eleicoes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Acesse o diretório `backend`:
   ```bash
   cd backend
   ```
4. Crie o arquivo de ambiente a partir do exemplo:
   ```bash
   cp .env.example .env
   ```
5. Ajuste as credenciais do banco em `.env` se necessário.
6. Execute as migrations para criar a estrutura de tabelas:
   ```bash
   php spark migrate
   ```
   *A API estará acessível em `http://localhost/eleicoes2026/backend/public/index.php/api`*

---

### 3. Configurando o Frontend (SPA)

1. Acesse o diretório `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie o arquivo `.env` (ou utilize o `.env.example` já pronto):
   ```bash
   cp .env.example .env
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   *Acesse no navegador: `http://localhost:5173`*

---

### 4. Configurando o Scraper (Robôs de Coleta)

1. Acesse o diretório `scraper`:
   ```bash
   cd scraper
   ```
2. Instale as dependências do coletor:
   ```bash
   npm install
   npx playwright install chromium
   ```
3. Para executar as coletas:
   ```bash
   npm run coletar:pesquisas
   npm run coletar:governadores
   ```

---

## 🔒 Segurança e Boas Práticas

* Chaves de API e credenciais de banco de dados devem ser mantidas estritamente em arquivos `.env` locais e **nunca** versionadas.
* Os relatórios e logs gerados pelo CodeIgniter são gravados em `backend/writable/` e ignorados pelo Git.

---

## 📄 Licença
Este projeto é de uso interno e desenvolvimento de pesquisa eleitoral. Todos os direitos reservados.
