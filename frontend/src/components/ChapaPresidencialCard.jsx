import { fotoUrl } from '../lib/api.js';

/**
 * Card Oficial da Chapa Presidencial (Presidente & Vice-Presidente).
 * Apresenta a chapa majoritária indivisível e metadados de aliança partidária.
 */
export default function ChapaPresidencialCard({ c, tse, onAbrirModal }) {
  if (!c) return null;

  const foto = fotoUrl(c);
  const temVice = Boolean(c.vice_nome && c.vice_nome !== '—');
  const aliancaPartidaria =
    temVice && c.vice_partido && c.vice_partido !== c.partido
      ? `${c.partido} & ${c.vice_partido}`
      : c.partido;

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 p-5 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/20">
      {/* Topo do Card da Chapa */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            🤝
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Chapa Presidencial Oficial · Eleições 2026
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Registro majoritário indivisível perante a Justiça Eleitoral (CF/88, art. 77)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-950/60 dark:text-blue-300">
            Aliança: {aliancaPartidaria}
          </span>
        </div>
      </div>

      {/* Grid com Titular e Vice lado a lado */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* Titular: Candidato a Presidente */}
        <div className="flex items-center gap-3.5 rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/80">
          {foto ? (
            <img
              src={foto}
              alt={c.nome}
              className="h-16 w-16 shrink-0 rounded-xl object-cover ring-2 ring-blue-500/20"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-400 dark:bg-slate-700">
              {c.nome?.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-md bg-blue-100 px-2 py-0.2 text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Titular · Presidente
            </span>
            <h3 className="truncate text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {c.nome}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{c.partido}</span>
              <span>•</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">Nº {c.numero}</span>
            </p>
          </div>
        </div>

        {/* Vice: Candidato a Vice-Presidente */}
        <div className="flex items-center gap-3.5 rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/80">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-sm text-xl">
            {c.vice_nome && c.vice_nome !== '—' ? c.vice_nome.charAt(0) : 'V'}
          </div>
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-md bg-purple-100 px-2 py-0.2 text-[10px] font-bold uppercase tracking-wider text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Vice-Presidente da República
            </span>
            <h3 className="truncate text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {c.vice_nome ?? 'A definir pela convenção'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {c.vice_partido || c.partido}
              </span>
              <span>•</span>
              <span className="text-[11px] text-slate-400">Chapa Conjunta</span>
            </p>
          </div>
        </div>
      </div>

      {/* Rodapé da Chapa com Botão Interativo */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60 pt-3 text-xs dark:border-slate-800">
        <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed max-w-xl">
          A votação para Presidente implica o voto simultâneo no respectivo candidato a Vice-Presidente. A chapa compartilha o mesmo número na urna eletrônica e o processo judicial no TSE.
        </p>

        {onAbrirModal && (
          <button
            type="button"
            onClick={onAbrirModal}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer transition"
          >
            <span>Auditar Dados da Chapa</span>
            <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>
    </div>
  );
}
