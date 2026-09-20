import { brl } from '../lib/api.js';

/**
 * Normaliza string para comparações sem acento e em caixa alta
 */
function norm(str = '') {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
}

/**
 * Classifica a natureza do doador com base na legislação eleitoral brasileira (Lei 9.504/97 e Resolução TSE 23.607):
 * - Desde 2015 (STF ADI 4650), empresas privadas NÃO podem doar para campanhas.
 * - CNPJs doadores são exclusivamente órgãos partidários (Diretórios, Comitês, FEFC, Fundo Partidário).
 * - CPFs são pessoas físicas ou o próprio candidato (autofinanciamento até 10% do teto).
 * - Entidades de arrecadação coletiva (vaquinhas eleitorais) operam via CNPJ de intermediadora credenciada no TSE.
 */
export function classificarDoador(doador, candidatoNome = '') {
  const nomeNorm = norm(doador.nome || '');
  const candNorm = norm(candidatoNome || '');
  const docLimpo = String(doador.documento || '').replace(/\D/g, '');

  // 1. Vaquinha online / Arrecadação Coletiva (Crowdfunding eleitoral)
  if (
    nomeNorm.includes('QUEROAPOIAR') ||
    nomeNorm.includes('VAKINHA') ||
    nomeNorm.includes('APOIA.SE') ||
    nomeNorm.includes('BENFEITORIA') ||
    nomeNorm.includes('FINANCIAMENTO COLETIVO') ||
    nomeNorm.includes('ARRECADACAO COLETIVA')
  ) {
    return {
      tipo: 'coletivo',
      label: 'Vaquinha Eleitoral (Crowdfunding)',
      descricao: 'Arrecadação coletiva via plataforma credenciada pelo TSE',
      cor: 'bg-amber-500',
      corTexto: 'text-amber-700 dark:text-amber-400',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    };
  }

  // 2. Autofinanciamento (Recursos próprios do candidato)
  if (
    candNorm &&
    (nomeNorm === candNorm ||
      (nomeNorm.length > 5 && candNorm.length > 5 && (nomeNorm.includes(candNorm) || candNorm.includes(nomeNorm))))
  ) {
    return {
      tipo: 'proprio',
      label: 'Recursos Próprios (Autofinanciamento)',
      descricao: 'Doação do próprio candidato para a sua campanha',
      cor: 'bg-purple-600',
      corTexto: 'text-purple-700 dark:text-purple-400',
      badgeBg: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
    };
  }

  // 3. Recursos Públicos / Partidários (FEFC e Fundo Partidário)
  // CNPJ ou menção expressa a Diretórios / Direção Nacional / Comitê / Partido
  if (
    docLimpo.length === 14 ||
    nomeNorm.includes('DIRECAO') ||
    nomeNorm.includes('DIRETORIO') ||
    nomeNorm.includes('PARTIDO') ||
    nomeNorm.includes('FUNDO') ||
    nomeNorm.includes('FEFC') ||
    nomeNorm.includes('ELEICAO') ||
    nomeNorm.includes('COMITE')
  ) {
    return {
      tipo: 'publico',
      label: 'Fundo Público / Partidário (FEFC)',
      descricao: 'Fundo Eleitoral (FEFC) e Fundo Especial Partidário geridos pela sigla',
      cor: 'bg-blue-600',
      corTexto: 'text-blue-700 dark:text-blue-400',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
    };
  }

  // 4. Doação de Pessoa Física (Cidadão)
  return {
    tipo: 'privado',
    label: 'Doações de Pessoas Físicas',
    descricao: 'Doações individuais de cidadãos (limitadas por lei a 10% da renda bruta)',
    cor: 'bg-emerald-600',
    corTexto: 'text-emerald-700 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
  };
}

export default function OrigemRecursosCard({ doadores = [], receitasTotal = 0, candidatoNome = '' }) {
  if (!doadores || doadores.length === 0) {
    return null;
  }

  const recTotalNum = Number(receitasTotal || 0);

  // Agrupa totais por categoria
  const grupos = {
    publico: { label: 'Fundo Público (FEFC / Partidário)', perc: 0, valor: 0, count: 0, cor: 'bg-blue-600 dark:bg-blue-500', barCor: '#2563eb' },
    privado: { label: 'Doações de Pessoas Físicas', perc: 0, valor: 0, count: 0, cor: 'bg-emerald-600 dark:bg-emerald-500', barCor: '#059669' },
    proprio: { label: 'Recursos Próprios (Candidato)', perc: 0, valor: 0, count: 0, cor: 'bg-purple-600 dark:bg-purple-500', barCor: '#9333ea' },
    coletivo: { label: 'Vaquinha Coletiva (Crowdfunding)', perc: 0, valor: 0, count: 0, cor: 'bg-amber-500 dark:bg-amber-400', barCor: '#f59e0b' },
  };

  let percAcumulado = 0;

  doadores.forEach((d) => {
    const cls = classificarDoador(d, candidatoNome);
    const perc = Number(d.percentual || 0);
    const val = d.valor ? Number(d.valor) : (recTotalNum * perc) / 100;

    if (grupos[cls.tipo]) {
      grupos[cls.tipo].perc += perc;
      grupos[cls.tipo].valor += val;
      grupos[cls.tipo].count += 1;
      percAcumulado += perc;
    }
  });

  // Arredonda percentuais
  const itensAtivos = Object.entries(grupos)
    .map(([key, item]) => ({
      key,
      ...item,
      percRound: Number(item.perc.toFixed(2)),
    }))
    .filter((item) => item.percRound > 0 || item.valor > 0)
    .sort((a, b) => b.percRound - a.percRound);

  // Resumo analítico cívico
  const publicoPerc = grupos.publico.perc;
  const privadoPerc = grupos.privado.perc + grupos.proprio.perc + grupos.coletivo.perc;

  let sintese = '';
  if (publicoPerc >= 90) {
    sintese = 'Campanha predominantemente financiada por verbas públicas do Fundo Eleitoral (FEFC / Partidário).';
  } else if (publicoPerc > 50) {
    sintese = 'Maioria dos recursos provém de fundos públicos partidários, complementados por doações privadas.';
  } else if (grupos.proprio.perc > 50) {
    sintese = 'Campanha com expressivo autofinanciamento pelo próprio candidato.';
  } else if (privadoPerc > 50) {
    sintese = 'Campanha impulsionada principalmente por doações de pessoas físicas e recursos privados.';
  } else {
    sintese = 'Distribuição mista entre recursos públicos partidários e apoio de cidadãos.';
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              ⚖️
            </span>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Origem dos Recursos da Campanha
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Divisão entre dinheiro público (Fundo Eleitoral FEFC) e doações privadas
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300 w-fit">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          TSE Oficial · Lei 9.504/97
        </span>
      </div>

      {/* Barra de distribuição gráfica stacked multi-tone */}
      <div className="mb-3">
        <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 shadow-inner">
          {itensAtivos.map((item) => (
            <div
              key={item.key}
              className={`${item.cor} transition-all duration-500 relative group`}
              style={{ width: `${Math.max(item.percRound, 2)}%` }}
              title={`${item.label}: ${item.percRound}% (${brl(item.valor)})`}
            />
          ))}
        </div>
      </div>

      {/* Grid de categorias com valores em R$ e % */}
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4 pt-1">
        {itensAtivos.map((item) => (
          <div
            key={item.key}
            className="flex flex-col rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 dark:border-slate-800 dark:bg-slate-800/40"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate" title={item.label}>
                {item.label}
              </span>
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                {item.percRound.toFixed(1)}%
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                {item.count} {item.count === 1 ? 'doador' : 'doadores'}
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {brl(item.valor)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Rodapé analítico cívico */}
      <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue-50/50 p-2.5 text-xs text-blue-900 dark:bg-blue-950/30 dark:text-blue-200 border border-blue-100/60 dark:border-blue-900/40">
        <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="leading-relaxed">
          <strong className="font-semibold">Diagnóstico Cívico:</strong> {sintese}
        </div>
      </div>
    </div>
  );
}
