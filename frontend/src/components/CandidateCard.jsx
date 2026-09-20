import { Link } from 'react-router-dom';
import { brl, fotoUrl } from '../lib/api.js';

export default function CandidateCard({ c, cargo }) {
  const foto = fotoUrl(c);
  return (
    <Link
      to={`/${cargo}/${c.slug}`}
      className="flex gap-3 rounded-xl border bg-white p-3 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
    >
      {foto ? (
        <img src={foto} alt={c.nome} className="h-16 w-16 shrink-0 rounded-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
          {(c.nome || '?')[0]}
        </div>
      )}
      <div className="min-w-0">
        <div className="truncate font-semibold">{c.nome}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {c.partido} · <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{c.numero}</span>
        </div>
        <div className="truncate text-xs text-slate-500 dark:text-slate-400">
          {[c.profissao, c.grau_instrucao].filter(Boolean).join(' · ') || '—'}
        </div>
        <div className="mt-1 text-xs">
          Patrimônio: <strong>{brl(c.patrimonio_total)}</strong>
        </div>
      </div>
    </Link>
  );
}
