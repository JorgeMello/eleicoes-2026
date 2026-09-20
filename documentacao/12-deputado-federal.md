# 12 — Ideação: Deputado Federal 2026

## Fonte
- Padrão G1 por UF (mesmo da família): `https://g1.globo.com/politica/eleicoes/2026/quem-sao-os-candidatos/deputado-federal/{uf}.ghtml`
  (confirmar o primeiro acesso; `deputado-estadual/sp.ghtml` confirmado com **1391 candidatos só em SP**).
- 513 cadeiras em disputa; candidaturas nacionais na casa dos **milhares (~8–12 mil, a confirmar)**.
- Números de urna com **4 dígitos**.

## Particularidades do cargo
- Proporcional (quociente eleitoral/partidário) — **sem vice, sem suplente de chapa**.
- Perfil individual tende a ser mais "seco": bens + histórico + contas, menos rankings (campanhas menores).
- Muitos candidatos com patrimônio/receitas zerados ou não declarados → `null` é esperado, não erro.
- Fotos: milhares de downloads — armazenamento e tempo passam a importar.

## O que já está pronto (reuso)
- `candidatos(cargo='dep-federal', uf)` + API + aba no frontend.

## O que falta / adaptações (o cargo que mais muda a engenharia)
1. **Paginação obrigatória na API:** `GET /candidatos` precisa de `?page=&limite=` (hoje retorna tudo —
   com 10 mil linhas o frontend trava). Frontend usa scroll infinito ou paginação.
2. **Estratégia de coleta invertida:** com esse volume, **TSE primeiro (bulk), G1 depois (fotos/complemento)**.
   Playwright perfil-a-perfil em 10 mil URLs levaria dias; priorizar: titulares/deputados atuais, depois resto.
3. **Scraper:** coleta por UF com **resume** (`out/dep-federal-{uf}.json` + checkpoint de slugs feitos);
   concorrência limitada (2–3 contextos) + delay menor (1–2s); retry com backoff.
4. **Fotos:** milhares de arquivos — subpasta `/uploads/candidatos/dep-federal/{uf}/`; considerar baixar
   só sob demanda (lazy: frontend pede, job baixa) em vez de tudo de uma vez.
5. **Comparador:** para 3 candidatos continua válido, mas seleção precisa de busca com autocomplete
   (dropdown de 10 mil nomes é inviável).
6. **Rankings:** nacional passa a fazer sentido (maiores patrimônios do país) + por UF.

## Riscos
- Volume estoura tempo/disciplina da coleta G1 → mitigado pelo TSE-first.
- `slug` UNIQUE atual quebra com homônimos entre UFs → migration `(cargo, uf, slug)` antes de importar.
- Importação de 10 mil linhas via `POST /coletas` de uma vez estoura memória/timeout → importar por
  lotes de ~500 (loop no script, um POST por UF).

## Critérios de aceite
- [ ] Paginação na API + scroll infinito funcionando com 1 UF completa (SP de preferência)
- [ ] Coleta com resume (interromper e retomar sem duplicar)
- [ ] Comparador com busca autocomplete
