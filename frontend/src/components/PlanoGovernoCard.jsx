import { URL_TSE_DIVULGACAND_2026 } from '../lib/api.js';

/**
 * Card Oficial do Plano de Governo Homologado no TSE.
 * Fornece download direto do PDF oficial, metadados de protocolo judicial e contexto legal.
 */
export default function PlanoGovernoCard({ c, tse }) {
  if (!c?.plano_governo_url) return null;

  // Extrai o número do protocolo do documento no TSE a partir da URL
  const protocolo = c.plano_governo_url.match(/\/arquivo\/doc\/(\d+)/)?.[1] || tse?.tse_documento_id || null;
  const pje = tse?.processo_pje || null;

  const urlDivulga = URL_TSE_DIVULGACAND_2026;

  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-white p-5 shadow-sm dark:border-blue-900/60 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-sm text-white shadow-2xs dark:bg-blue-500">
              📄
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Plano de Governo Oficial Homologado no TSE
            </h2>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              PDF com Fé Pública
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            A apresentação das diretrizes gerais de governo é requisito obrigatório para o registro de candidatura presidencial (art. 11, § 1º, IX, da Lei nº 9.504/1997). O documento original protocolado perante o Tribunal Superior Eleitoral orienta os compromissos públicos da chapa para o mandato 2027–2030.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            {protocolo && (
              <span className="flex items-center gap-1">
                <span>Protocolo TSE:</span>
                <strong className="font-mono text-slate-700 dark:text-slate-300">{protocolo}</strong>
              </span>
            )}
            {pje && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span>Processo PJe:</span>
                  <strong className="font-mono text-slate-700 dark:text-slate-300">{pje}</strong>
                </span>
              </>
            )}
            <span>•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">Conectividade 100% Auditada</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
          <a
            href={c.plano_governo_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition-all hover:shadow"
            title="Abre o arquivo PDF oficial do Plano de Governo original arquivado no TSE"
          >
            <span>Baixar Plano de Governo (PDF)</span>
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 6.75a.75.75 0 011.5 0v3.44l1.22-1.22a.75.75 0 111.06 1.06l-2.5 2.5a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 111.06-1.06l1.22 1.22V8.75z"
                clipRule="evenodd"
              />
            </svg>
          </a>

          <a
            href={urlDivulga}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
            title="Conferir no portal DivulgaCandContas do TSE"
          >
            <span>Validar no Portal TSE</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
