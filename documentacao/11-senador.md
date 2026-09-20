# 11 — Ideação: Senador 2026

## Fonte
- Padrão G1 por UF (mesmo da família): `https://g1.globo.com/politica/eleicoes/2026/quem-sao-os-candidatos/senador/{uf}.ghtml`
  (confirmar o primeiro acesso; o padrão `governador/sp.ghtml` e `deputado-estadual/sp.ghtml` já foi confirmado).
- **2026 = 2 vagas por estado** (renovação de 2/3; confirmado em SP com ~13–15 nomes).
- **Volume nacional estimado: 300–450 candidaturas** (~10–18 por UF; a confirmar).

## Particularidades do cargo
- Majoritário, turno único, mandato de 8 anos.
- **Chapa tem 2 SUPLENTES** (1º e 2º) — o perfil G1 de presidente mostra "vice"; o de senador deve
  mostrar suplentes. Campos `vice_nome`/`vice_partido` NÃO servem (são 2 pessoas, outro papel).
- Números de urna com 3 dígitos (ex.: 100–999) — validar no primeiro perfil coletado.

## O que já está pronto (reuso)
- `candidatos(cargo='senador', uf)` + API + aba no frontend; parser base de perfil/bens/histórico/contas.

## O que falta / adaptações
1. **Migration nova:** tabela `suplentes` (`candidato_id FK, ordem TINYINT 1|2, nome, partido`) +
   incluir no `show()` da API e na importação (`Coletas::importar` + `eleicoes:importar`).
2. **Perfil no frontend:** bloco "Suplentes" no lugar de "Vice" quando `cargo==='senador'`;
   comparador ganha linha "Suplentes".
3. **Scraper:** mesmo loop por UF do governador; `perfil.js` ganha extrator de suplentes
   (inspecionar 1 perfil real antes de codar — seletores podem diferir do bloco de vice).
4. Ranking por UF; comparador travado por UF (vagas são estaduais).

## Riscos
- Se o G1 não exibir suplentes no perfil, buscar na API TSE DivulgaCand (fonte canônica tem).
- Nomes duplicados entre UFs → mesma regra `(cargo, uf, slug)` do doc 10.

## Critérios de aceite
- [ ] 27/27 UFs coletadas; 100% com ao menos o 1º suplente preenchido (ou justificativa TSE)
- [ ] Frontend exibe suplentes no perfil e no comparador
