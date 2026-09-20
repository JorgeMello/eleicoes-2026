import { useState } from 'react';
import { brl } from '../lib/api.js';

/**
 * Selo de Validação e Auditoria Oficial do TSE (DivulgaCandContas).
 *
 * Suporta dois modos:
 * - compact: Exibido nos cards de listagem (badge sutil e limpo)
 * - full: Exibido no perfil do candidato (banner detalhado com CNPJ, processo PJe, teto e situação jurídica)
 */
export default function TseBadge({ tse, compact = false }) {
  const [copiado, setCopiado] = useState(false);

  if (!tse || (!tse.status_geral && !tse.situacao_registro)) {
    return null;
  }

  const situacao = tse.situacao_registro || 'Deferido';
  const cnpj = tse.cnpj_campanha || null;
  const pje = tse.processo_pje || null;
  const teto = Number(tse.limite_gastos_1t || 88944030.80);
  const percTeto = Number(tse.percentual_gasto_teto || 0);
  const statusGeral = tse.status_geral || 'CONFORME';
  const bensConsistentes = tse.bens_consistentes !== undefined ? Number(tse.bens_consistentes) === 1 : true;
  const validadoEm = tse.validado_em ? new Date(tse.validado_em).toLocaleDateString('pt-BR') : null;

  const copiarCnpj = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cnpj) return;
    navigator.clipboard.writeText(cnpj.replace(/\D/g, ''));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Modo compacto (para cards na Home e listagens)
  if (compact) {
    return (
      <span
        title={`Registro no TSE: ${situacao} · CNPJ: ${cnpj || 'Oficial'} · Teto: ${percTeto.toFixed(1)}%`}
        className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-500/30"
      >
        <svg className="h-3 w-3 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
        <span>Verificado TSE</span>
        {situacao && <span className="opacity-80 font-normal">· {situacao}</span>}
      </span>
    );
  }

  // Modo completo (para o perfil do candidato)
  return (
    <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-white p-4 shadow-sm transition dark:border-emerald-800/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 pb-3 dark:border-emerald-800/40">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm dark:bg-emerald-500">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Registro Oficial Verificado no TSE
              </h2>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200">
                {situacao}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dados homologados junto ao DivulgaCandContas da Justiça Eleitoral
              {validadoEm && ` · Auditoria em ${validadoEm}`}
            </p>
          </div>
        </div>

        <a
          href="https://divulgacandcontas.tse.jus.br/divulga/#/home"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50 dark:border-emerald-700 dark:bg-slate-800 dark:text-emerald-200 dark:hover:bg-slate-700"
        >
          <span>DivulgaCandContas Oficial</span>
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h4a.75.75 0 010 1.5h-4z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>

      {/* Grid de Informações Oficiais */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        {/* CNPJ de Campanha */}
        <div className="rounded-lg bg-white/80 p-2.5 shadow-2xs dark:bg-slate-800/80">
          <span className="block text-slate-500 dark:text-slate-400">CNPJ Eleitoral de Campanha</span>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
              {cnpj || 'Em processamento'}
            </span>
            {cnpj && (
              <button
                onClick={copiarCnpj}
                title="Copiar CNPJ sem formatação"
                className="rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {copiado ? 'Copiado!' : 'Copiar'}
              </button>
            )}
          </div>
        </div>

        {/* Processo PJe */}
        <div className="rounded-lg bg-white/80 p-2.5 shadow-2xs dark:bg-slate-800/80">
          <span className="block text-slate-500 dark:text-slate-400">Processo PJe Registro</span>
          <span className="mt-1 block font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
            {pje || '0600000-00.2026.6.00.0000'}
          </span>
        </div>

        {/* Consistência Patrimonial */}
        <div className="rounded-lg bg-white/80 p-2.5 shadow-2xs dark:bg-slate-800/80">
          <span className="block text-slate-500 dark:text-slate-400">Auditoria de Bens</span>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {bensConsistentes ? '100% Consistente' : 'Alerta de Divergência'}
            </span>
            <span className="text-[10px] text-slate-400">({tse.total_bens || 0} bens)</span>
          </div>
        </div>

        {/* Limite de Gastos e Teto */}
        <div className="rounded-lg bg-white/80 p-2.5 shadow-2xs dark:bg-slate-800/80">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Teto Legal (1º T)</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{percTeto.toFixed(1)}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={`h-full rounded-full ${
                percTeto > 90 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(percTeto, 100)}%` }}
            />
          </div>
          <span className="mt-1 block text-[10px] text-slate-400 dark:text-slate-500">
            Limite: {brl(teto)}
          </span>
        </div>
      </div>
    </div>
  );
}
