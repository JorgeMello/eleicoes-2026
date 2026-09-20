import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api, brl } from '../lib/api.js';

const LINHAS = [
  { label: 'Partido', get: (c) => c.partido, ajuda: 'Legenda pela qual o candidato concorre em 2026 (fonte: TSE via G1).' },
  { label: 'Número', get: (c) => c.numero, ajuda: 'Número digitado na urna eletrônica (2 dígitos para presidente e governador).' },
  { label: 'Profissão', get: (c) => c.profissao ?? '—', ajuda: 'Ocupação declarada pelo candidato no registro do TSE.' },
  { label: 'Instrução', get: (c) => c.grau_instrucao ?? '—', ajuda: 'Grau de instrução declarado no registro do TSE.' },
  { label: 'Cor/etnia', get: (c) => c.cor_etnia ?? '—', ajuda: 'Autodeclaração de cor/etnia do registro do TSE.' },
  { label: 'Vice', get: (c) => `${c.vice_nome ?? '—'}${c.vice_partido ? ` (${c.vice_partido})` : ''}`, ajuda: 'Companheiro de chapa (vice-presidente/vice-governador) declarado ao TSE.' },
  { label: 'Patrimônio', get: (c) => brl(c.patrimonio_total), ajuda: 'Soma dos valores dos bens declarados ao TSE. Pode estar parcial se algum bem veio sem valor.' },
  { label: 'Receitas', get: (c) => brl(c.receitas_total), ajuda: 'Total arrecadado pela campanha em 2026 (prestação de contas ao TSE).' },
  { label: 'Despesas', get: (c) => brl(c.despesas_total), ajuda: 'Total gasto pela campanha em 2026 (prestação de contas ao TSE).' },
  { label: 'Nº bens', get: (c, extra) => extra?.bens?.length ?? '—', ajuda: 'Quantidade de itens na lista de bens declarados ao TSE.' },
  { label: 'Eleições disputadas', get: (c, extra) => extra?.historico?.length ?? '—', ajuda: 'Candidaturas anteriores encontradas no histórico do candidato.' },
];

const CORES = ['#10b981', '#3b82f6', '#f59e0b'];

/** Rótulo por extenso p/ ponta da barra: "R$ 41,3 milhões" / "R$ 850 mil" / valor cheio. */
function fmtMi(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  if (Math.abs(n) >= 1_000_000) {
    const m = n / 1_000_000;
    const txt = m.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    return `R$ ${txt} ${Math.abs(m) === 1 ? 'milhão' : 'milhões'}`;
  }
  if (Math.abs(n) >= 1_000) return `R$ ${(n / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} mil`;
  return brl(n);
}

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function GraficoComparativo({ titulo, rows, nomes, monetario = false }) {
  return (
    <div className="rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-2 text-sm font-semibold">{titulo}</h2>
      <ResponsiveContainer width="100%" height={Math.max(200, rows.length * 70)}>
        <BarChart data={rows} layout="vertical" barCategoryGap="25%" margin={{ top: 4, right: 110, bottom: 0, left: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="criterio" width={130} tick={{ fontSize: 13 }} />
          <Tooltip formatter={(v) => (monetario ? brl(v) : v)} />
          <Legend verticalAlign="top" wrapperStyle={{ fontSize: 12, paddingBottom: 8 }} />
          {nomes.map((n, i) => (
            <Bar key={n} dataKey={n} fill={CORES[i % CORES.length]}>
              <LabelList dataKey={n} position="right" fontSize={12} formatter={(v) => (monetario ? fmtMi(v) : v)} />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Comparador() {
  const { cargo = 'presidente' } = useParams();
  const [sp, setSp] = useSearchParams();
  const [lista, setLista] = useState([]);
  const [dados, setDados] = useState([]);
  const [ajudaSel, setAjudaSel] = useState(null); // label do critério com ajuda aberta
  const [showGraficos, setShowGraficos] = useState(false);

  const sel = [sp.get('a'), sp.get('b'), sp.get('c')].filter(Boolean).slice(0, 3);

  useEffect(() => {
    api.candidatos(cargo).then(setLista).catch(() => setLista([]));
  }, [cargo]);

  useEffect(() => {
    Promise.all(sel.map((s) => api.candidato(s).catch(() => null))).then(setDados);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.toString()]);

  const setSlot = (slot, slug) => {
    const n = new URLSearchParams(sp);
    if (slug) n.set(slot, slug);
    else n.delete(slot);
    setSp(n);
  };

  const validos = dados.filter(Boolean);
  const nomes = validos.map((d) => d.candidato.nome);
  const linhaNum = (rotulo, fn) => ({
    criterio: rotulo,
    ...Object.fromEntries(validos.map((d) => [d.candidato.nome, fn(d)])),
  });
  const dinheiro = [
    linhaNum('Patrimônio', (d) => num(d.candidato.patrimonio_total)),
    linhaNum('Receitas', (d) => num(d.candidato.receitas_total)),
    linhaNum('Despesas', (d) => num(d.candidato.despesas_total)),
  ];
  const contagens = [
    linhaNum('Nº bens', (d) => d.bens?.length ?? 0),
    linhaNum('Eleições disputadas', (d) => d.historico?.length ?? 0),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Comparar até 3 candidatos · {cargo}</h1>
        <button
          type="button"
          onClick={() => setShowGraficos((v) => !v)}
          disabled={!dados.some(Boolean)}
          aria-expanded={showGraficos}
          title={showGraficos ? 'Ocultar os gráficos' : 'Mostrar gráficos comparativos abaixo da tabela'}
          className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <rect x="1.5" y="8" width="3" height="6.5" rx="0.8" />
            <rect x="6.5" y="4.5" width="3" height="10" rx="0.8" />
            <rect x="11.5" y="1.5" width="3" height="13" rx="0.8" />
          </svg>
          {showGraficos ? 'Ocultar gráficos' : 'Gráficos'}
        </button>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {['a', 'b', 'c'].map((slot, i) => (
          <select
            key={slot}
            value={sp.get(slot) ?? ''}
            onChange={(e) => setSlot(slot, e.target.value)}
            className="rounded-lg border bg-white px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="">Candidato {i + 1}…</option>
            {lista.map((c) => (
              <option key={c.slug} value={c.slug}>{c.nome} ({c.partido} {c.numero})</option>
            ))}
          </select>
        ))}
      </div>

      {dados.some(Boolean) ? (
        <>
          {ajudaSel && (
            <div role="status" className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <p className="flex-1">
                <strong>{ajudaSel.label}:</strong> {ajudaSel.ajuda}
              </p>
              <button
                type="button"
                onClick={() => setAjudaSel(null)}
                aria-label="Fechar ajuda"
                className="rounded px-1 hover:bg-black/10 dark:hover:bg-white/10"
              >
                ✕
              </button>
            </div>
          )}
          <div className="overflow-x-auto rounded-xl border bg-white dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <th className="px-3 py-2 text-left">Critério</th>
                {dados.map((d, i) => (
                  <th key={i} className="px-3 py-2 text-left">{d?.candidato?.nome ?? '—'}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LINHAS.map(({ label: k, get: fn, ajuda }) => (
                <tr key={k} className="border-t dark:border-slate-700">
                  <td className="px-3 py-1.5 text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      {k}
                      <button
                        type="button"
                        onClick={() => setAjudaSel((atual) => (atual?.label === k ? null : { label: k, ajuda }))}
                        title={ajuda}
                        aria-label={`O que significa ${k}?`}
                        aria-expanded={ajudaSel?.label === k}
                        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px] leading-none opacity-70 hover:opacity-100"
                      >
                        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                          <circle cx="8" cy="8" r="6.5" />
                          <line x1="8" y1="7.2" x2="8" y2="11.5" strokeLinecap="round" />
                          <circle cx="8" cy="5" r="0.9" fill="currentColor" stroke="none" />
                        </svg>
                      </button>
                    </span>
                  </td>
                  {dados.map((d, i) => (
                    <td key={i} className="px-3 py-1.5 font-medium">{d ? fn(d.candidato, d) : '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          {showGraficos && (
            <div className="grid gap-3 lg:grid-cols-2">
              <GraficoComparativo titulo="Dinheiro (R$)" rows={dinheiro} nomes={nomes} monetario />
              <GraficoComparativo titulo="Contagens" rows={contagens} nomes={nomes} />
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">Selecione até 3 candidatos acima para comparar lado a lado.</p>
      )}
    </div>
  );
}
