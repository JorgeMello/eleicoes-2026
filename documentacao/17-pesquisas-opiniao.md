# 17 — Ideação: Pesquisas de opinião "oficiais" + item no menu (20/09/2026)

## O que significa "oficial"
Pesquisa eleitoral só pode ser divulgada se **registrada no TSE** (sistema PesqEle), com número
de protocolo (ex.: `SP-01806/2026`, visto numa Datafolha-SP real). Divulgar sem registro é crime
eleitoral. Logo, "oficiais" = **pesquisas com registro TSE**, e o dashboard só lista essas —
cada registro exibe: instituto, período de coleta, margem de erro, amostra, nº de registro e
link da fonte. Esses 5 campos são o **mínimo legal/informativo** de cada card.

## Fontes mapeadas
1. **Agregador G1** (`/politica/eleicoes/2026/pesquisa-eleitoral/pesquisas-eleitorais`): página com
   JS — HTML estático vem vazio (confirmado em 20/09/2026), então **só via Playwright** (já temos).
   Serve como índice/descoberta.
2. **Matérias do G1 por pesquisa** (ex.: Datafolha-SP governador, Quaest-ES): trazem no texto
   percentuais por candidato, rejeição, espontânea, 2º turno, margem, amostra e registro.
   Formato varia por matéria — parser por padrões, não por seletor fixo.
3. **TSE PesqEle** (validação): confirma se o protocolo existe; não é a fonte dos percentuais
   (esses estão nas matérias), mas carimba o "oficial".
4. **Armadilha conhecida:** parte dos números sai só em **infográfico (imagem)**; o texto da
   matéria em geral repete os principais — o scraper extrai do texto e marca `cobertura: parcial`
   quando detectar infográfico sem equivalente textual.

## Modelo de dados (novo, sem mexer no existente)
- `institutos` (id, nome UNIQUE — Datafolha, Quaest, AtlasIntel…; site NULL)
- `pesquisas` (id, instituto_id FK, cargo, uf, tipo ENUM: `1-turno|2-turno|espontanea|rejeicao`,
  data_inicio, data_fim, margem_erro, amostra, registro_tse UNIQUE, fonte_url, coletado_em)
- `pesquisa_resultados` (pesquisa_id FK, candidato_nome, partido NULL, percentual)
  — referência por **nome/partido**, não FK para `candidatos` (a pesquisa pode citar nomes que
  saíram da disputa; vínculo exato vira curadoria manual futura).
- Deduplicação natural por `registro_tse`.

## Scraper (`scraper/src/pesquisas/`, módulo novo)
- `indice.js`: abre o agregador, rola/pagina, coleta links de matérias de pesquisa.
- `materia.js`: por URL, extrai instituto, datas, margem (`X pontos percentuais`), amostra
  (`N entrevistas`), registro (`[A-Z]{2}-\\d+/2026`), cenários e percentuais
  (`Nome (PARTIDO) - NN%` / `Nome ... com NN%`).
- Saída `out/pesquisas.json` + importador `php spark eleicoes:importar-pesquisas`
  (ou `POST /api/pesquisas`, mesmo padrão X-API-Key).
- Desafio ≠ perfis de candidato: cada matéria tem redação própria → parser tolerante com
  `confianca` por campo + fila de revisão manual (`revisar=true` quando % não fecha ~100%).

## Menu + telas (frontend)
- Novo item **"Pesquisas"** no menu superior (global, ao lado de Candidatos/Comparar/Rankings),
  rota `/pesquisas` com filtros **cargo + UF + instituto + tipo**.
- Conteúdo: cards da(s) pesquisa(s) mais recente(s) (instituto, datas, margem, amostra, registro,
  link G1) + **gráfico de evolução** (Recharts LineChart, % × tempo, uma linha por candidato,
  séries separadas por instituto — **sem "média" entre institutos no MVP**, ver Riscos).
- MVP: **só presidente nacional** (poucas pesquisas, alto valor); governador/senador por UF depois.
- Disclaimer fixo: "Pesquisas têm margem de erro e fotografam o momento; não são previsão de resultado."

## API (a criar)
- `GET /pesquisas?cargo=&uf=&instituto=&tipo=` (lista, mais recentes primeiro)
- `GET /pesquisas/:id` (detalhe + resultados)
- `GET /pesquisas/evolucao?cargo=&uf=` (séries temporais p/ o LineChart)
- `POST /pesquisas` (importação, X-API-Key)

## Riscos / honestidade metodológica
- **Não calcular média entre institutos** sem metodologia explícita (amostras e métodos diferem);
  MVP mostra séries por instituto lado a lado.
- Cenários de 2º turno e espontânea não se misturam com 1º turno estimulado — separados por `tipo`.
- Candidatos entram/saem (ex.: nomes com candidatura indeferida) — série congela, sem apagar histórico.

## Critérios de aceite (MVP presidente)
- [ ] Migrations + API + importador funcionando
- [ ] ≥ 3 pesquisas reais de institutos diferentes importadas com os 5 campos mínimos
- [ ] Menu "Pesquisas" com filtros, cards e evolução temporal
- [ ] Nenhuma pesquisa sem `registro_tse` no banco

## Decisões registradas (20/09/2026)
- MVP: **só presidente nacional**
- Tipos: **1º turno + 2º turno + rejeição** (espontânea fica para v2)
- Vínculo: **candidato_id quando o nome bater** (normalização com mapa explícito de acentos —
  `iconv//TRANSLIT` quebra no Windows; nome-livre quando não bate, ex. Pablo Marçal inelegível)
- 2º turno com várias simulações: coluna **`confronto`** ("Lula x Flávio Bolsonaro",
  "sem Pablo Marçal"); unicidade `(registro_tse, tipo, confronto)`

## Implementação (20/09/2026, validada)
- Backend: migrations `institutos/pesquisas/pesquisa_resultados` (+2 ajustes de unicidade e
  `confronto`); `CandidatoMatcher`, `PesquisaImporter` (dedupe por registro+tipo+confronto);
  `Api\Pesquisas` (`index/show/evolucao/importar`); `spark eleicoes:importar-pesquisas`.
- Scraper `src/pesquisas/`: `indice.js` (links do índice G1) + `materia.js` (cenários por
  cabeçalho, metodologia, registro; tolera "0" sem %, "Nome: PARTIDO: N", margem por extenso)
  + `index.js` (filtro MVP + 2 sementes manuais). Bugs reais corrigidos: regex de registro
  ("registrada… sob o número"), amostra ("entrevistou"), classe sem minúsculas ASCII.
- **Dados reais:** 11 cenários (Datafolha BR-04029, BR-01833; Quaest BR-01720), 73 resultados,
  **72/73 vinculados** (só Pablo Marçal solto — correto).
- Frontend: item **Pesquisas** no menu + rota `/pesquisas` (filtros tipo/instituto, cards com os
  5 campos mínimos, evolução LineChart com séries "Nome (Instituto)", links p/ perfil do candidato
  quando vinculado). Build OK; Playwright: menu→página, 4 cards, gráfico e registro visíveis.
