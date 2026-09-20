import { useState } from 'react';
import { UFS, UFS_DATA, REGIOES } from '../lib/api.js';

// Estados com maior colégio eleitoral para acesso rápido em 1 clique
const UFS_DESTAQUE = ['SP', 'MG', 'RJ', 'BA', 'RS', 'PR', 'PE', 'CE', 'SC', 'GO'];

export default function UfSelector({ ufSelecionada, onSelectUf, cargo = 'governador' }) {
  const [regiaoFiltro, setRegiaoFiltro] = useState('Todas');

  const ufsFiltradas = UFS.filter((uf) => {
    if (regiaoFiltro === 'Todas') return true;
    return UFS_DATA[uf]?.regiao === regiaoFiltro;
  });

  const ufInfo = ufSelecionada ? UFS_DATA[ufSelecionada] : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Indicador do Estado Selecionado */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shadow-2xs">
            📍
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {ufSelecionada ? (
                  <>
                    {ufInfo?.nome} <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">({ufSelecionada})</span>
                  </>
                ) : (
                  'Todas as 27 Unidades da Federação'
                )}
              </h2>
              {ufInfo && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Região {ufInfo.regiao}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {ufSelecionada
                ? `Candidaturas ao governo estadual registradas no ${ufSelecionada}`
                : 'Selecione um estado para auditar as contas e bens locais'}
            </p>
          </div>
        </div>

        {/* Dropdown com os 27 Estados por Extenso */}
        <div className="flex items-center gap-2">
          <label htmlFor="select-uf-geral" className="sr-only">
            Selecionar Estado
          </label>
          <select
            id="select-uf-geral"
            value={ufSelecionada || ''}
            onChange={(e) => onSelectUf(e.target.value)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 cursor-pointer"
          >
            <option value="">Brasil (Todas UFs)</option>
            {UFS.map((u) => (
              <option key={u} value={u}>
                {u} · {UFS_DATA[u]?.nome || u} ({UFS_DATA[u]?.regiao})
              </option>
            ))}
          </select>

          {ufSelecionada && (
            <button
              type="button"
              onClick={() => onSelectUf('')}
              title="Limpar seleção de estado"
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
            >
              Ver Todas
            </button>
          )}
        </div>
      </div>

      {/* Barra de Filtros por Macrorregião */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
        <span className="mr-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Região:
        </span>
        {REGIOES.map((r) => {
          const ativa = regiaoFiltro === r;
          return (
            <button
              key={r}
              type="button"
              onClick={() => setRegiaoFiltro(r)}
              className={`rounded-lg px-2 py-0.5 text-xs font-medium transition cursor-pointer ${
                ativa
                  ? 'bg-slate-800 text-white shadow-2xs dark:bg-slate-200 dark:text-slate-900 font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {r}
            </button>
          );
        })}
      </div>

      {/* Pílulas de Seleção Rápida de Estados da Região */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {ufsFiltradas.map((u) => {
          const selecionado = ufSelecionada === u;
          return (
            <button
              key={u}
              type="button"
              onClick={() => onSelectUf(selecionado ? '' : u)}
              className={`group inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                selecionado
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:bg-slate-800'
              }`}
              title={`${UFS_DATA[u]?.nome} (${UFS_DATA[u]?.regiao})`}
            >
              <span>{u}</span>
              <span
                className={`text-[10px] ${
                  selecionado
                    ? 'text-emerald-100'
                    : 'text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400'
                }`}
              >
                {UFS_DATA[u]?.nome?.slice(0, 4)}…
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
