# 27 — Ideação: rastreio de empresas fornecedoras (dossiê ao clicar) (20/09/2026)

## Conceito
Na tela do candidato (aba **Contas**), cada nome em **Gastos** (e depois Doadores) vira clicável
e abre o **dossiê do fornecedor**: quem é a empresa, quanto recebeu, de quem mais recebeu e
notas de pesquisa curada. Exemplo-guia (Flávio Bolsonaro → F.A.R.O. Propaganda e Publicidade):
"empresa do marqueteiro Duda Lima, coordena a comunicação da campanha, sem site institucional
ativo, opera a plataforma de vídeos 24h e o site oficial, CNPJ 09.383.641/0001-47, sede em SP"
— esse nível de detalhe é o alvo.

## Camadas de dados do dossiê
1. **Interna (já temos, falta expor):** quanto recebeu deste candidato (valor + % + posição no
   ranking) e, o diferencial, **quais outros candidatos também pagaram essa empresa** na eleição.
2. **CNPJ (enriquecimento automático):** razão social, fantasia, UF/município, CNAE, capital
   social, data de abertura, situação cadastral, quadro societário — via dados abertos da
   Receita (datasets públicos ou APIs como BrasilAPI), com data da consulta registrada.
3. **Curadoria editorial:** notas de pesquisa com links de fonte (como o dossiê F.A.R.O. acima),
   tabela `empresa_notas` (empresa, texto, fonte_url, criado_em). Conteúdo editorial é trabalho
   manual e entra por último.

## Pré-requisito crítico: capturar o documento
Hoje o scraper **descarta** as linhas CNPJ/CPF dos rankings (filtro do `perfil.js`). Sem o
documento, "F.A.R.O." colide com homônimas (Faro Brasil, Faro Ag — risco que você mesmo
flagrou). Plano:
- `perfil.js`: capturar a linha `CNPJ/CPF + número` adjacente ao nome → campo `documento`.
- Migration: `documento VARCHAR(20) NULL` em `doadores` e `gastos` + índice.
- Re-coleta dos 13 presidentes (só muda o parser, sem recarregar fotos).
- Regra de ouro: **empresa = CNPJ, nunca nome sozinho**; sem documento, o dossiê mostra só o
  agregado interno com aviso "sem CNPJ confirmado".

## Modelo (novo)
- `empresas` (cnpj PK normalizada só-dígitos, razao, fantasia, uf, municipio, cnae, capital,
  abertura, situacao, socios JSON, consultado_em)
- `empresa_notas` (empresa_cnpj FK, texto, fonte_url, criado_em)
- `gastos.documento`, `doadores.documento` (liga ao dossiê)
- Script `spark eleicoes:enriquecer-empresas` (lê documentos distintos → consulta CNPJ → upsert).

## UI (frontend)
- Nomes de Gastos/Doadores na aba Contas viram botões (só quando há `documento` ou agregado).
- Modal "Dossiê": cabeçalho (razão + CNPJ + situação), "Recebeu deste candidato" (valor, %,
  posição), "Também prestou serviço para" (lista cruzada), "Dados cadastrais" (abertura,
  capital, sócios, endereço), "Notas de pesquisa" (curadoria + links), rodapé de fontes.
- Endpoint: `GET /empresas/:cnpj` (agregado + cadastro + notas).

## MVP (ordem)
1. Capturar `documento` + re-coleta + agregado interno cruzado (sem dado externo).
2. Enriquecimento CNPJ automático.
3. Curadoria editorial (F.A.R.O. como primeira nota-semente, com fontes a confirmar).

## Fase 1 — implementada (20/09/2026, validada)
- Migration `documento` (só dígitos) em `doadores`/`gastos` + índice; models e importadores
  (`POST /coletas`, `spark eleicoes:importar`) gravam o campo.
- `perfil.js`: `ranking()` reescrito em modo linha-a-linha com buffer — captura a linha
  CNPJ/CPF adjacente, limita o trecho à seção (não vaza p/ o outro ranking) e junta
  "R$ …" + "(…%)" quebrados em linhas. Bugs pegos no teste: `IGNORAR()` chamado como função;
  R$ e (%) em linhas separadas davam lista vazia.
- Re-coleta 13/13 + reimport: presidente com **~100% de documentos** (só Leonardo Avalanche
  sem linhas de doadores/gastos no G1). Governadores seguem sem documento (coleta anterior).
- `GET /api/empresas/:doc`: nomes distintos + ocorrências (candidato, partido, UF, tipo, %)
  com `candidato_slug` p/ links. Teste real: F.A.R.O. `09383641000147` = **09.383.641/0001-47,
  confere com sua pesquisa** — 23,31% dos gastos de Flávio (posição nº 1).
- Frontend (aba Contas): nome vira botão quando há `documento` (senão, "(sem CNPJ)" discreto);
  modal com CNPJ formatado, % + posição neste candidato, "Também aparece em" (links) e rodapé
  de fontes. Playwright + screenshot conferidos.

## Riscos e cuidados
- **Homônimos:** nunca fundir por nome; dossiê sem CNPJ exibe aviso explícito.
- **LGPD:** dados de CNPJ e sócios de LTDA são públicos (Receita/TSE), mas exibir sempre com
  fonte + data da consulta; nada de dados pessoais além do público (sem telefone/e-mail particular).
- **Exemplo F.A.R.O.:** os detalhes trazidos (Duda Lima, plataformas, sede) entram como
  `empresa_notas` **após confirmação das fontes** — o scraper não inventa esse conteúdo.
- Custo de curadoria: escalar notas para dezenas de empresas exige rotina editorial, não dá
  para automatizar com qualidade.

## Critérios de aceite (fase 1)
- [ ] `documento` capturado em ≥80% das linhas de gastos/despesas dos 13 presidentes
- [ ] Clicar em "F.A.R.O..." (ou qualquer fornecedor) abre dossiê com valores + cruzamento
- [ ] Aviso visível quando não há CNPJ confirmado

## Perguntas abertas
1. Fase 1 (só agregado interno) já entrega valor, ou quer o enriquecimento CNPJ junto?
2. Curadoria editorial começa por quais empresas (top-5 fornecedores por valor)?
3. Doadores entram no rastreio na mesma leva ou só Gastos primeiro?
