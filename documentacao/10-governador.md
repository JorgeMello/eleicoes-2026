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
- [x] 27/27 listas de UF coletadas — **192 candidaturas** (AC 6 … SP 7 … TO 7)
- [x] Fotos locais 100% (`governador-{uf}-{id}.jpeg`); 0 falhas na coleta
- [x] Frontend filtra por UF e comparador travado na UF selecionada (trocar UF limpa a seleção)
- [ ] Todos com `vice_*` preenchido — **parcial**: vários sem vice no G1 (registro posterior a 15/08?); re-coletar perto do 1º turno

## Implementação (20/09/2026, validada)
- **Descoberta:** perfis de governador usam **ID numérico** (`/governador/sp/250002550913.ghtml`),
  não slug — `lista.js` parametrizado `(cargo, uf)` com regex genérica; `perfil.js` com cargo/UF
  do item; parser reaproveitado sem mudanças (nome, bens com valor, doadores, gastos OK).
- Backend: migration unicidade `(cargo, uf, slug)`; filtro `uf` em `candidatos` e `rankings`;
  upsert por (slug, cargo, uf) no `POST /coletas` e no `spark eleicoes:importar`.
- Scraper: `src/coletar-governador.js` (piloto SP 7/7 → nacional 185/185, 0 falhas) com
  `out/governador-{uf}.json` + consolidado; fotos `governador-{uf}-{id}.jpeg`.
- Frontend: seletor de UF na Home (só p/ cargos não-presidente), comparador com UF obrigatória
  e rankings por UF; `UFS` centralizado em `lib/api.js`.
- Validação: perfil Carlos Machado (SP) com foto local; comparador RJ com 9 opções; ranking MG.
