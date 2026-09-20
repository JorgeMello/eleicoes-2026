import { Link, NavLink, useParams } from 'react-router-dom';
import { CARGOS } from '../lib/api.js';
import ThemeToggle from './ThemeToggle.jsx';

export default function Layout({ children }) {
  const { cargo = 'presidente' } = useParams();
  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap items-center gap-3">
          <Link to={`/${cargo}`} className="text-lg font-bold tracking-tight">
            Eleições 2026 <span className="text-emerald-400">· Dashboard</span>
          </Link>
          <nav className="ml-auto flex flex-wrap gap-1 text-sm">
            <NavLink to={`/${cargo}`} end className={({ isActive }) => `rounded px-3 py-1.5 ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}>
              Candidatos
            </NavLink>
            <NavLink to={`/${cargo}/comparar`} className={({ isActive }) => `rounded px-3 py-1.5 ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}>
              Comparar (3)
            </NavLink>
            <NavLink to={`/${cargo}/rankings`} className={({ isActive }) => `rounded px-3 py-1.5 ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}>
              Rankings
            </NavLink>
            <ThemeToggle />
          </nav>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 flex gap-1 overflow-x-auto py-2 text-sm">
            {CARGOS.map((c) => (
              <NavLink
                key={c.id}
                to={`/${c.id}`}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1 ${isActive ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-white/10'}`
                }
              >
                {c.rotulo}
              </NavLink>
            ))}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="border-t bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
          Fonte: TSE via portal G1 (coleta Playwright + API oficial TSE). Projeto educacional, sem vínculo
          partidário. Fotos armazenadas localmente para preservação. Dados sujeitos a atualização até o 2º
          turno (25/10/2026).
        </div>
      </footer>
    </div>
  );
}
