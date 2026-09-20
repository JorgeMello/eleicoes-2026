# 10 — Ideação: Governador 2026

## Fonte
- Padrão G1 por UF: `https://g1.globo.com/politica/eleicoes/2026/quem-sao-os-candidatos/governador/{uf}.ghtml`
- Confirmado: `.../governador/sp.ghtml` ("Governador em São Paulo: conheça os candidatos").
- Cobertura: 27 UFs (26 estados + DF). Exemplos 2026: SP 6–7 nomes, ES 5, PB 6, SC 8.
- **Volume nacional estimado: 150–250 candidaturas** (a confirmar na coleta; ~5–10 por UF).

## Particularidades do cargo
- Majoritário com 2 turnos (como presidente); perfil G1 tem **vice-governador** (já cabe em
  `vice_nome`/`vice_partido` — mesmo layout do presidente).
- Números de urna com 2 dígitos (mesmo padrão do presidente).
- Filtros relevantes: partido, profissão, instrução, cor, patrimônio + **UF** (obrigatório aqui).

## O que já está pronto (reuso)
- Tabela `candidatos` com `cargo='governador'` + `uf` — sem migration nova.
- API filtra por `cargo`; frontend tem aba Governador (mostra "em breve" até haver dados).
- Parser `perfil.js`: mesmo layout do presidente → reuso quase total.

## O que falta / adaptações
1. **Scraper:** parametrizar `lista.js` com `(cargo, uf)`; loop nas 27 UFs; `out/` separado por UF
   (`out/governador-sp.json`) + consolidação; chave de unicidade passa a ser `(cargo, uf, slug)`
   — exige migration ajustando o UNIQUE atual só em `slug` (ver Riscos).
2. **Slugs:** mesmo slug pode existir em UFs diferentes → foto local vira
   `/uploads/candidatos/governador-{uf}-{slug}.jpeg` (ou subpasta por cargo/UF).
3. **Frontend:** seletor de UF obrigatório na Home do cargo; comparador continua 1 UF por vez
   (comparar governadores de UFs diferentes não faz sentido — travar por UF).
4. **Rankings:** por UF (nacional não faz sentido para patrimônio de governador).

## Riscos
- Total de UFs × delay 2–5s ≈ 200 perfis ≈ 15–25 min de coleta — tranquilo, 1 passada resolve.
- Mudança de lista até 15/08 (prazo de registro) — re-coletar após o fechamento do TSE.

## Critérios de aceite
- [ ] 27/27 listas de UF coletadas (mesmo que alguma UF tenha 0 — improvável)
- [ ] Todos com `vice_*` preenchido; fotos locais 100%
- [ ] Frontend filtra por UF e comparador travado na UF selecionada
