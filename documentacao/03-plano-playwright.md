# 03 — Plano Playwright (coleta G1 → JSON)

## Estrutura sugerida
```
scraper/
  package.json        # playwright + node 20+
  playwright.config.js
  src/
    lista.js          # 1) abre presidente.ghtml, extrai 13 cards
    perfil.js         # 2) para cada slug, abre perfil e extrai dados
    fotos.js          # 3) baixa fotos p/ ../backend/public/uploads/candidatos/
    index.js          # orquestra: lista → perfis (sequencial, delay) → JSON
  out/
    lista.json
    candidatos.json
    erros.json
```

## Passo a passo
1. **`lista.js`**: `goto('.../presidente.ghtml')`, `waitForSelector('a[href*="/presidente/"]')`, extrair `{ slug, nome, partido, numero, foto_url_original, perfil_g1_url }`. Validar `total === 13`; se diferente, abortar e logar (lista mudou).
2. **`perfil.js`** (por slug, com `delay 2000–5000ms` + `timeout 30s` + 1 retry):
   - Cabeçalho: nome, partido, número, profissão, etnia, instrução, foto
   - Plano de governo: `a:has-text("Ver plano de governo") → href`
   - Histórico: tabela/lista `Candidaturas anteriores` → `{ ano, cargo, partido, resultado }`
   - Bens: lista `Total de Bens` → `{ tipo, descricao, valor? }` — **verificar se valor exige scroll/clique "Ver mais" ou JS; usar `scrollIntoView` + `click` se necessário**
   - Vice: bloco `Vice-presidente` → `{ nome, partido }`
   - Contas: `Receitas / Total de despesas / Limite de gastos` (podem estar vazios fora de época)
   - Rankings: `Ranking de doadores / gastos` → `{ nome, percentual }`
   - Rodapé de auditoria: texto `Atualizado às ...` + `Dados fornecidos pelo TSE`
3. **`fotos.js`**: download com `request` do próprio Playwright ou `fetch`, renomear `{slug}.jpeg`, validar tamanho > 5KB.
4. **Saída**: `candidatos.json` no formato do contrato API + `raw_html/` opcional para debug.

## Anti-bloqueio e boas práticas
- `headless: true`, `locale: 'pt-BR'`, viewport desktop, 1 contexto reutilizado
- `userAgent` padrão do Playwright está ok para 13 reqs; não usar proxy
- Respeitar `robots.txt` do g1; coleta manual sob demanda (não cron agressivo — 1x/dia no máximo)
- Nunca commitar `out/*.json` com dados pessoais além do público; fotos são públicas mas manter crédito/fonte

## Alternativa superior (recomendação técnica)
A fonte canônica é o **TSE DivulgaCandContas** (`https://divulgacandcontas.tse.jus.br/divulga/rest/v2/...`).
Mapear `sequencial + UF=BR + cargo=presidente + ano=2026` dá JSON oficial com valores exatos de bens/receitas.
Proposta: **Playwright no G1 para slugs/fotos/validação + TSE API para números**. Isso reduz fragilidade a mudança de layout do G1.

## Critérios de aceite da coleta
- [ ] 13/13 perfis com status 200
- [ ] Nenhum campo `nome/partido/numero` nulo
- [ ] Fotos baixadas 13/13
- [ ] `erros.json` vazio ou com justificativa
