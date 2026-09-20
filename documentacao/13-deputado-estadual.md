# 13 — Ideação: Deputado Estadual 2026 (+ Distrital DF)

## Fonte
- Padrão G1 por UF: `https://g1.globo.com/politica/eleicoes/2026/quem-sao-os-candidatos/deputado-estadual/{uf}.ghtml`
- **Confirmado: `deputado-estadual/sp.ghtml` com 1391 de 1391 candidatos** — o maior volume por UF até aqui.
- **Volume nacional estimado: 15–25 mil candidaturas** (a confirmar; SP é a maior UF).
- Números de urna com **5 dígitos** (ex.: 40999, 22777 — confirmados nos cards de SP).
- **DF não tem estadual:** lá o equivalente é **deputado distrital** — prever `cargo='dep-distrital'`
  (nova aba no frontend; G1 deve ter `.../deputado-distrital/df.ghtml`, a confirmar).

## Particularidades do cargo
- Proporcional estadual, sem vice/suplente — mesmo perfil "seco" do federal.
- Maior dispersão de qualidade dos dados: muitos `null` (bens, contas) — esperado.
- É o cargo onde o eleitor mais precisa de filtros (município/base não vem no G1-lista; partido +
  busca textual são o mínimo viável).

## O que já está pronto (reuso)
- `candidatos(cargo='dep-estadual', uf)` + API + aba no frontend. Todo o plano de engenharia é o
  mesmo do doc 12 (paginação, TSE-first, resume, fotos sob demanda, autocomplete).

## O que falta / adaptações (além do doc 12)
1. **Novo cargo `dep-distrital`** (só DF): migration não precisa (cargo é string livre), mas exige:
   nova entrada em `CARGOS` no frontend + `cargos_disponiveis` na API + coleta `df.ghtml` correspondente.
2. **Números de 5 dígitos:** busca por número no frontend/API já usa `LIKE` — OK; validar que a
   coluna `numero SMALLINT` comporta até 99999 (comporta: máx 65535? **NÃO** — SMALLINT unsigned máx
   65535 < 99999!). **Exige migration alterando `numero` para MEDIUMINT/INT UNSIGNED.**
   (Vale também para dep-federal com 4 dígitos? 9999 < 65535 — OK, só estadual/distrital estoura.)
3. Ordem de implementação sugerida: federal antes do estadual (menor volume, valida o pipeline).

## Riscos
- `numero` SMALLINT estoura em 5 dígitos → corrigir **antes** da primeira importação (item 2).
- 1391 fotos só em SP → fotos sob demanda (doc 12, item 4) vira obrigatório aqui.
- Tempo total de coleta plena (20 mil perfis) pode passar de 24h → rodar por UF em dias alternados
  até o 1º turno (04/10/2026); priorizar UFs do usuário.

## Critérios de aceite
- [ ] Migration `numero` → INT UNSIGNED aplicada
- [ ] 1 UF completa ponta a ponta (SP): coleta → importação em lotes → paginação → fotos
- [ ] Aba `dep-distrital` funcional para o DF
