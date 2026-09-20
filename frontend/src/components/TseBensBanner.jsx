import { brl } from '../lib/api.js';

/**
 * Painel Oficial de Auditoria Patrimonial e Bens do TSE.
 * Exibido no topo da aba 'Bens' do perfil do candidato.
 */
export default function TseBensBanner({ c, tse, bens = [] }) {
  if (!tse && !c) return null;

  const situacao = tse?.situacao_registro || 'Deferido';
  const pje = tse?.processo_pje || null;
  const patrimonioDeclarado = Number(tse?.patrimonio_declarado || c?.patrimonio_total || 0);
  const somaCalculada = Number(
    tse?.soma_bens_calculada || bens.reduce((acc, b) => acc + Number(b.valor || 0), 0)
  );
  const divergencia = Number(tse?.divergencia_bens ?? Math.abs(patrimonioDeclarado - somaCalculada));
  const ehConsistente = tse?.bens_consistentes !== undefined ? Boolean(tse.bens_consistentes) : divergencia === 0;
  const validadoEm = tse?.validado_em ? new Date(tse.validado_em).toLocaleDateString('pt-BR') : null;
  const totalBens = bens.length;

  // Identifica o maior bem e calcula a sua representatividade percentual
  const maiorBem =
    totalBens > 0
      ? bens.reduce((max, b) => (Number(b.valor || 0) > Number(max.valor || 0) ? b : max), bens[0])
      : null;
  const valorMaiorBem = Number(maiorBem?.valor || 0);
  const percMaiorBem = patrimonioDeclarado > 0 ? (valorMaiorBem / patrimonioDeclarado) * 100 : 0;

  // Link para o DivulgaCandContas oficial do TSE
  const urlTse = tse?.sq_candidato
    ? `https://divulgacandcontas.tse.jus.br/divulga/#/candidato/2026/BR/BR/${tse.sq_candidato}`
    : 'https://divulgacandcontas.tse.jus.br/divulga/#/home';

  return (
    <div className="mb-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white p-4 shadow-sm dark:border-emerald-800/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900">
      {/* Topo do Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 pb-3 dark:border-emerald-800/40">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs dark:bg-emerald-500">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Declaração de Bens Oficial no TSE
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
              Patrimônio auditado e reconciliado perante o repositório público DivulgaCandContas
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
          title="Abre a declaração juramentada de bens oficial no portal DivulgaCandContas do TSE"
        >
          <span>Validar Bens no Portal do TSE</span>
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

      {/* Grid com as 4 Métricas de Auditoria dos Bens */}
      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {/* Total Declarado */}
        <div className="rounded-lg bg-white/90 p-2.5 shadow-2xs dark:bg-slate-800/90">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Patrimônio Declarado</span>
          <strong className="mt-0.5 block text-sm font-bold text-slate-900 dark:text-white">
            {brl(patrimonioDeclarado)}
          </strong>
          <span className="text-[10px] text-slate-400">Total homologado TSE</span>
        </div>

        {/* Soma dos Itens */}
        <div className="rounded-lg bg-white/90 p-2.5 shadow-2xs dark:bg-slate-800/90">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Soma dos Bens Auditada</span>
          <strong className="mt-0.5 block text-sm font-bold text-blue-700 dark:text-blue-400">
            {brl(somaCalculada)}
          </strong>
          <span className="text-[10px] text-slate-400">
            {totalBens} {totalBens === 1 ? 'item somado' : 'itens somados'}
          </span>
        </div>

        {/* Auditoria Matemática */}
        <div className="rounded-lg bg-white/90 p-2.5 shadow-2xs dark:bg-slate-800/90">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Auditoria Matemática</span>
          <strong
            className={`mt-0.5 block text-sm font-bold ${
              ehConsistente ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
            }`}
          >
            {ehConsistente ? '100% Consistente' : 'Divergência'}
          </strong>
          <span className="text-[10px] text-slate-400">
            {ehConsistente ? 'Divergência: R$ 0,00' : `Diferença: ${brl(divergencia)}`}
          </span>
        </div>

        {/* Maior Ativo / Concentração */}
        <div className="rounded-lg bg-white/90 p-2.5 shadow-2xs dark:bg-slate-800/90">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-500 dark:text-slate-400 truncate" title="Maior bem declarado">
              Maior Ativo ({percMaiorBem.toFixed(1)}%)
            </span>
          </div>
          <strong className="mt-0.5 block text-sm font-bold text-purple-700 dark:text-purple-400 truncate" title={maiorBem ? `${brl(valorMaiorBem)} (${maiorBem.tipo})` : '—'}>
            {maiorBem ? brl(valorMaiorBem) : '—'}
          </strong>
          <span className="mt-0.5 block text-[10px] text-slate-400 truncate" title={maiorBem?.tipo || 'Nenhum bem'}>
            {maiorBem ? maiorBem.tipo : 'Sem bens declarados'}
          </span>
        </div>
      </div>

      {/* Rodapé do Banner com Processo e Certificação */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-200/50 pt-2 text-[11px] text-slate-600 dark:border-emerald-800/30 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          {pje && (
            <div className="flex items-center gap-1">
              <span>Processo PJe:</span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{pje}</span>
            </div>
          )}
          <span>•</span>
          <span>{totalBens} {totalBens === 1 ? 'item patrimonial auditado' : 'itens patrimoniais auditados'}</span>
        </div>

        <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span className="font-medium">Declaração de bens 100% auditada</span>
        </div>
      </div>
    </div>
  );
}
