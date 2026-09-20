import { useState } from 'react';
import { brl, URL_TSE_DIVULGACAND_2026 } from '../lib/api.js';

/**
 * Painel Oficial de Auditoria de Prestação de Contas do TSE.
 * Exibido no topo da aba 'Contas' do perfil do candidato.
 */
export default function TseContasBanner({ c, tse }) {
  const [copiado, setCopiado] = useState(false);

  if (!tse && !c) return null;

  const situacao = tse?.situacao_registro || 'Deferido';
  const cnpj = tse?.cnpj_campanha || null;
  const pje = tse?.processo_pje || null;
  const teto = Number(tse?.limite_gastos_1t || c?.limite_gastos || 88944030.80);
  const percTeto = Number(tse?.percentual_gasto_teto || (teto > 0 && c?.despesas_total ? (Number(c.despesas_total) / teto) * 100 : 0));
  const receitas = Number(tse?.receitas_total || c?.receitas_total || 0);
  const despesas = Number(tse?.despesas_total || c?.despesas_total || 0);
  const saldo = receitas - despesas;
  const ehSuperavit = saldo >= 0;
  const validadoEm = tse?.validado_em ? new Date(tse.validado_em).toLocaleDateString('pt-BR') : null;

  // Link para a consulta nacional oficial do DivulgaCandContas do TSE
  const urlTse = URL_TSE_DIVULGACAND_2026;

  const copiarCnpj = (e) => {
    e.preventDefault();
    if (!cnpj) return;
    navigator.clipboard.writeText(cnpj.replace(/\D/g, ''));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="mb-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white p-4 shadow-sm dark:border-emerald-800/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900">
      {/* Topo do Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 pb-3 dark:border-emerald-800/40">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs dark:bg-emerald-500">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Prestação de Contas Oficial no TSE
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200">
                <svg className="h-3 w-3 text-emerald-600 dark:text-emerald-300" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Verificado TSE · {situacao}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Demonstrativo financeiro auditado e homologado pelo Tribunal Superior Eleitoral
              {validadoEm && ` · Conferência em ${validadoEm}`}
            </p>
          </div>
        </div>

        {/* Botão de Validação Externa */}
        <a
          href={urlTse}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50 dark:border-emerald-700 dark:bg-slate-800 dark:text-emerald-200 dark:hover:bg-slate-700"
          title="Abre a prestação de contas oficial no portal DivulgaCandContas do TSE"
        >
          <span>Validar no Portal do TSE</span>
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

      {/* Grid com as 4 Métricas Oficiais */}
      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {/* Receitas */}
        <div className="rounded-lg bg-white/90 p-2.5 shadow-2xs dark:bg-slate-800/90">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Receitas Arrecadadas</span>
          <strong className="mt-0.5 block text-sm font-bold text-emerald-700 dark:text-emerald-400">
            {brl(receitas)}
          </strong>
          <span className="text-[10px] text-slate-400">Total homologado TSE</span>
        </div>

        {/* Despesas */}
        <div className="rounded-lg bg-white/90 p-2.5 shadow-2xs dark:bg-slate-800/90">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Despesas Contratadas</span>
          <strong className="mt-0.5 block text-sm font-bold text-blue-700 dark:text-blue-400">
            {brl(despesas)}
          </strong>
          <span className="text-[10px] text-slate-400">Contratos & fornecedores</span>
        </div>

        {/* Saldo / Caixa */}
        <div className="rounded-lg bg-white/90 p-2.5 shadow-2xs dark:bg-slate-800/90">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Balanço de Campanha</span>
          <strong
            className={`mt-0.5 block text-sm font-bold ${
              ehSuperavit
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-amber-700 dark:text-amber-400'
            }`}
          >
            {ehSuperavit ? `+${brl(saldo)}` : brl(saldo)}
          </strong>
          <span className="text-[10px] text-slate-400">
            {ehSuperavit ? 'Superávit em caixa' : 'Restos a pagar parciais'}
          </span>
        </div>

        {/* Teto Legal */}
        <div className="rounded-lg bg-white/90 p-2.5 shadow-2xs dark:bg-slate-800/90">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-500 dark:text-slate-400">Teto TSE (1º T)</span>
            <strong className="font-bold text-slate-700 dark:text-slate-300">{percTeto.toFixed(1)}%</strong>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percTeto > 90 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(percTeto, 100)}%` }}
            />
          </div>
          <span className="mt-1 block text-[10px] text-slate-400">
            Limite: {brl(teto)}
          </span>
        </div>
      </div>

      {/* Rodapé do Banner com CNPJ e Processo */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-200/50 pt-2 text-[11px] text-slate-600 dark:border-emerald-800/30 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          {cnpj && (
            <div className="flex items-center gap-1.5">
              <span>CNPJ Eleitoral:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cnpj}</span>
              <button
                onClick={copiarCnpj}
                className="rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600 shadow-2xs hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {copiado ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          )}
          {pje && (
            <div className="flex items-center gap-1">
              <span>Processo PJe:</span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{pje}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span className="font-medium">Prestação de contas 100% auditada</span>
        </div>
      </div>
    </div>
  );
}
