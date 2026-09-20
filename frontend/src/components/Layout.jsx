import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { CARGOS } from '../lib/api.js';
import ThemeToggle from './ThemeToggle.jsx';
import UrnaIcon from './UrnaIcon.jsx';
import GitHubIcon from './GitHubIcon.jsx';
import { InstagramIcon, GlobeIcon, HeartIcon } from './FooterIcons.jsx';

function BandeiraBrasil({ className = 'h-5 w-7' }) {
  return (
    <svg viewBox="0 0 20 14" className={className} role="img" aria-label="Bandeira do Brasil">
      <rect width="20" height="14" rx="1.5" fill="#009B3A" />
      <polygon points="10,1.8 17.5,7 10,12.2 2.5,7" fill="#FEDF00" />
      <circle cx="10" cy="7" r="2.6" fill="#002776" />
    </svg>
  );
}

export default function Layout({ children }) {
  const { cargo = 'presidente' } = useParams();
  const location = useLocation();

  // Preserva a sub-rota (/comparar ou /rankings) ao alternar entre os cargos na barra secundária
  const subRota = location.pathname.includes('/comparar')
    ? '/comparar'
    : location.pathname.includes('/rankings')
    ? '/rankings'
    : '';
  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap items-center gap-3">
          <Link to={`/${cargo}`} className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight hover:opacity-90 transition-opacity">
            <UrnaIcon className="h-6 w-6 text-emerald-400 shrink-0" />
            <span>
              Eleições 2026 <span className="text-emerald-400">· Dashboard</span>
            </span>
            <BandeiraBrasil />
          </Link>
          <nav className="ml-auto flex flex-wrap items-center gap-1 text-sm">
            <NavLink to={`/${cargo}`} end className={({ isActive }) => `rounded px-3 py-1.5 ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}>
              Candidatos
            </NavLink>
            <NavLink to={`/${cargo}/comparar`} className={({ isActive }) => `rounded px-3 py-1.5 ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}>
              Comparar (3)
            </NavLink>
            <NavLink to={`/${cargo}/rankings`} className={({ isActive }) => `rounded px-3 py-1.5 ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}>
              Rankings
            </NavLink>
            <NavLink to="/pesquisas" className={({ isActive }) => `rounded px-3 py-1.5 ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}>
              Pesquisas
            </NavLink>
            <NavLink to="/manual" className={({ isActive }) => `rounded px-3 py-1.5 ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}>
              Manual
            </NavLink>
            <a
              href="https://github.com/JorgeMello/eleicoes-2026"
              target="_blank"
              rel="noopener noreferrer"
              title="Código-fonte aberto no GitHub"
              aria-label="Repositório do projeto Eleições 2026 no GitHub"
              className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <GitHubIcon className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium">GitHub</span>
            </a>
            <ThemeToggle />
          </nav>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 flex gap-1 overflow-x-auto py-2 text-sm">
            {CARGOS.map((c) => {
              const destino = `/${c.id}${subRota}`;
              const ehCargoAtivo =
                location.pathname !== '/pesquisas' &&
                location.pathname !== '/manual' &&
                (cargo === c.id || location.pathname.startsWith(`/${c.id}`));
              return (
                <NavLink
                  key={c.id}
                  to={destino}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-full px-3 py-1 transition-colors ${
                      isActive || ehCargoAtivo
                        ? 'bg-emerald-500 text-white font-semibold'
                        : 'text-slate-300 hover:bg-white/10'
                    }`
                  }
                >
                  {c.rotulo}
                </NavLink>
              );
            })}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="border-t bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Linha Superior: Sobre & Links do Ecossistema */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1.5 max-w-md">
              <div className="flex items-center gap-2">
                <UrnaIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                  Eleições 2026 · Plataforma Aberta
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Projeto cívico de software livre para controle dos dados eleitorais, prestação de contas,
                patrimônio e pesquisas. Dados públicos oficiais do TSE e G1.
              </p>
            </div>

            {/* Links Oficiais do Ecossistema */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <a
                href="https://www.instagram.com/cuidadorpessoaidosa/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-700 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-pink-500/50 dark:hover:bg-slate-800 dark:hover:text-pink-400 transition-all shadow-sm"
                title="Instagram Oficial: @cuidadorpessoaidosa"
              >
                <InstagramIcon className="h-4 w-4 text-pink-500 shrink-0" />
                <span>Instagram</span>
              </a>

              <a
                href="https://github.com/JorgeMello/eleicoes-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:hover:text-white transition-all shadow-sm"
                title="Código-fonte aberto no GitHub"
              >
                <GitHubIcon className="h-4 w-4 shrink-0" />
                <span>Repositório</span>
              </a>

              <a
                href="https://eleicoes.osidosos.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-all shadow-sm"
                title="Landing Page Oficial da Plataforma"
              >
                <GlobeIcon className="h-4 w-4 text-blue-500 shrink-0" />
                <span>Landing Page</span>
              </a>

              <a
                href="https://cuidador.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-rose-500/50 dark:hover:bg-slate-800 dark:hover:text-rose-400 transition-all shadow-sm"
                title="Portal Cuidador XYZ"
              >
                <HeartIcon className="h-4 w-4 text-rose-500 shrink-0" />
                <span>Cuidador.xyz</span>
              </a>
            </div>
          </div>

          {/* Linha Inferior: Metadados, Fotos e Prazos */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>
              Fonte: TSE via portal G1 (coleta Playwright + API oficial TSE). Fotos armazenadas localmente para preservação de dados.
            </div>
            <div className="shrink-0">
              Eleições Gerais 2026 · Dados válidos até o 2º turno (25/10/2026)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
