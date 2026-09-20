# 09 — Tema claro / escuro (20/09/2026)

## Decisão
Tailwind CSS v4 com **estratégia por classe** (toggle manual), não apenas `prefers-color-scheme`:
- `src/index.css` declara `@custom-variant dark (&:where(.dark, .dark *));` — assim o prefixo
  `dark:` responde à classe `.dark` no `<html>`, permitindo alternância em tempo real.
- Sem isso, o Tailwind v4 usaria a mídia `prefers-color-scheme` e o botão de alternar não funcionaria.

## Comportamento
- Botão sol/lua no cabeçalho (`ThemeToggle`), visível em todas as páginas.
- Inicialização (sem flash de tema errado): script inline no `index.html` roda antes da pintura e
  aplica `.dark` se `localStorage['eleicoes2026-tema'] === 'escuro'` ou, sem preferência salva,
  se o SO estiver em modo escuro.
- Troca persiste em `localStorage` (`eleicoes2026-tema = 'claro' | 'escuro'`).
- Padrão sem escolha do usuário: segue o sistema operacional.

## Arquivos
| Arquivo | Papel |
|---|---|
| `frontend/index.html` | script anti-flash (antes do CSS pintar) |
| `frontend/src/index.css` | `@custom-variant dark` + fundo do `body` nos dois temas |
| `frontend/src/components/ThemeToggle.jsx` | botão sol/lua + leitura/escrita da preferência |
| `frontend/src/components/Layout.jsx` | inclui o toggle no header |
| `Home.jsx`, `Perfil.jsx`, `Comparador.jsx`, `Rankings.jsx`, `CandidateCard.jsx` | variantes `dark:` (fundos `slate-900`, bordas `slate-700/800`, textos ajustados) |

## Convenção de classes escuras
- Fundo página: `body` `#f8fafc` → `.dark body` `#020617` (slate-950).
- Cards/tabelas: `bg-white` → `dark:bg-slate-900`; bordas `border` → `dark:border-slate-700/800`.
- Textos secundários `text-slate-500/600` → `dark:text-slate-400`; números fortes herdam.
- Header `bg-slate-900` mantido nos dois temas (já escuro); links azuis ganham `dark:text-blue-400`.

## Verificação
- `npm run build` OK (49 regras `.dark` no CSS final; script anti-flash presente no `dist/index.html`).
- Teste automatizado (Playwright + Chromium, 20/09/2026): botão toggle presente (1);
  estado inicial claro; após clique `.dark` aplicado + `localStorage='escuro'`; após reload
  tema escuro persistiu. Resultado: `{btnToggle:1, darkAntes:false, aposClique:{dark:true, ls:'escuro'}, darkAposReload:true}`.
- Manual pendente: abrir com SO em modo escuro sem preferência salva (deve abrir escuro sem flash).
