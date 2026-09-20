# 08 — Ordenação da aba Bens (20/09/2026)

## Comportamento
Na página de perfil do candidato (`/:cargo/:slug`, aba **Bens**):
- A tabela abre ordenada do **maior para o menor valor** (padrão `desc`).
- O cabeçalho **Valor ▼/▲** é clicável e alterna entre maior→menor e menor→maior.
- Bens sem valor (`null`) ficam sempre por último, nas duas direções.
- Indicador visual: `▼` (desc) / `▲` (asc) + `title` explicativo + atributo `aria-sort` (acessibilidade).

## Arquivos alterados
1. `frontend/src/pages/Perfil.jsx`
   - Estado `ordemBens` (`'desc'` padrão) + `bensOrdenados` (cópia ordenada, sem mutar o original).
   - `<th>Valor</th>` virou `<button>` com toggle `desc ↔ asc`.
   - Chave da linha: `b.id ?? i` (antes era só o índice).
2. `backend/app/Controllers/Api/Candidatos.php`
   - `show()` e `bens()`: `orderBy('valor', 'DESC')` — a API já entrega maior→menor por padrão
     (o frontend re-ordena de qualquer forma, então funciona mesmo com APIs antigas).

## Verificação executada
- API `GET /api/candidatos/lula`: 18 bens, primeiro R$ 1.923.927,36 → último R$ 0,13, sequência
  monotonamente decrescente conferida via script (`API-DESC-OK=True`).
- Lógica do frontend testada isoladamente em Node: `desc` e `asc` corretos, `null/undefined` por último.
- `npm run build`: OK (só o aviso conhecido de chunk > 500KB por causa do Recharts).
