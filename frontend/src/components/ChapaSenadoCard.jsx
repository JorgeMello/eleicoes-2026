import { fotoUrl } from '../lib/api.js';

/**
 * Card Oficial da Chapa ao Senado (Titular + 1º Suplente + 2º Suplente).
 * Apresenta a chapa majoritária tripartite e a linha sucessória para o mandato de 8 anos.
 */
export default function ChapaSenadoCard({ c, tse, suplentes = [], onAbrirModal }) {
  if (!c) return null;

  const foto = fotoUrl(c);

  // Identifica 1º e 2º suplentes a partir do array ou campos
  const sup1 =
    suplentes.find((s) => Number(s.ordem) === 1) ||
    (c.suplente1_nome ? { nome: c.suplente1_nome, partido: c.suplente1_partido, ocupacao: c.suplente1_ocupacao } : null);

  const sup2 =
    suplentes.find((s) => Number(s.ordem) === 2) ||
    (c.suplente2_nome ? { nome: c.suplente2_nome, partido: c.suplente2_partido, ocupacao: c.suplente2_ocupacao } : null);

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50/25 p-5 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/20">
      {/* Topo do Card da Chapa do Senado */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3.5 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-base font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shadow-2xs">
            🏛️
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Chapa Oficial ao Senado Federal</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Mandato 2027–2035 (8 Anos)
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Registro majoritário indivisível perante a Justiça Eleitoral (CF/88, art. 46, § 3º)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
            UF: {c.uf} · Número: {c.numero}
          </span>
        </div>
      </div>

      {/* Grid: Titular e Dupla Suplência */}
      <div className="mt-4 grid gap-3.5 lg:grid-cols-3">
        {/* Titular: Candidato a Senador */}
        <div className="relative flex flex-col justify-between rounded-xl border border-emerald-200/80 bg-white p-3.5 shadow-2xs dark:border-emerald-800/60 dark:bg-slate-800/90">
          <div className="flex items-center gap-3">
            {foto ? (
              <img
                src={foto}
                alt={c.nome}
                className="h-14 w-14 shrink-0 rounded-xl object-cover ring-2 ring-emerald-500/30"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-500 dark:bg-slate-700 text-lg">
                {c.nome?.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Titular · Senador
              </span>
              <h3 className="truncate text-base font-bold text-slate-900 dark:text-white mt-0.5" title={c.nome}>
                {c.nome}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="font-bold text-slate-700 dark:text-slate-200">{c.partido}</span>
                <span>•</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">Nº {c.numero}</span>
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Registro TSE:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">✓ Deferido</span>
          </div>
        </div>

        {/* 1º Suplente */}
        <div className="relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-xs text-lg">
              {sup1?.nome ? sup1.nome.charAt(0) : '1º'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                1º Suplente · Sucessão Direta
              </span>
              <h3 className="truncate text-base font-bold text-slate-900 dark:text-white mt-0.5" title={sup1?.nome_completo || sup1?.nome}>
                {sup1?.nome_urna || sup1?.nome || 'A definir na ata partidária'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{sup1?.partido || c.partido}</span>
                {sup1?.ocupacao && (
                  <>
                    <span>•</span>
                    <span className="truncate">{sup1.ocupacao}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Papel Constitucional:</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">1º na ordem de substituição</span>
          </div>
        </div>

        {/* 2º Suplente */}
        <div className="relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 font-bold text-white shadow-xs text-lg">
              {sup2?.nome ? sup2.nome.charAt(0) : '2º'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-block rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                2º Suplente · Sucessão Secundária
              </span>
              <h3 className="truncate text-base font-bold text-slate-900 dark:text-white mt-0.5" title={sup2?.nome_completo || sup2?.nome}>
                {sup2?.nome_urna || sup2?.nome || 'A definir na ata partidária'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{sup2?.partido || c.partido}</span>
                {sup2?.ocupacao && (
                  <>
                    <span>•</span>
                    <span className="truncate">{sup2.ocupacao}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Papel Constitucional:</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">2º na ordem de substituição</span>
          </div>
        </div>
      </div>

      {/* Rodapé explicativo cívico */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60 pt-3 text-xs dark:border-slate-800">
        <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed max-w-2xl">
          💡 <strong>Importância da Suplência:</strong> No Senado Federal, os suplentes assumem a titularidade do mandato nas licenças (ex.: ministérios e secretarias), renúncias ou cassações. Ao votar no titular, o eleitor elege conjuntamente ambos os suplentes da chapa.
        </p>

        {onAbrirModal && (
          <button
            type="button"
            onClick={onAbrirModal}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer transition"
          >
            <span>Auditar Chapa Completa</span>
            <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>
    </div>
  );
}
