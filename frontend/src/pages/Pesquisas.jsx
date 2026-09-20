import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../lib/api.js';

const TIPOS = [
  ['1-turno', '1º turno'],
  ['2-turno', '2º turno'],
  ['rejeicao', 'Rejeição'],
];
const CORES = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const tipoRotulo = (t) => (TIPOS.find(([id]) => id === t) || [t, t])[1];
const fmtData = (iso) => (iso ? iso.split('-').reverse().join('/') : '—');

export default function Pesquisas() {
  const [tipo, setTipo] = useState('1-turno');
  const [instituto, setInstituto] = useState('todos');
  const [dados, setDados] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    api.evolucao({ uf: 'BR', tipo })
      .then(setDados)
      .catch((e) => setErro(e.message));
  }, [tipo]);

  const institutos = useMemo(() => [...new Set(dados.map((p) => p.instituto))].sort(), [dados]);

  // Séries separadas por instituto (honestidade metodológica): "Nome (Instituto)"
  const { pontos, series } = useMemo(() => {
    const filtradas = dados.filter((p) => instituto === 'todos' || p.instituto === instituto);
    const porData = new Map();
    for (const p of filtradas) {
      const chave = `${p.data_fim}|${p.instituto}`;
      if (!porData.has(chave)) porData.set(chave, { data: fmtData(p.data_fim), rot: `${fmtData(p.data_fim)} · ${p.instituto}` });
      for (const r of p.resultados || []) {
        porData.get(chave)[`${r.candidato_nome} (${p.instituto})`] = Number(r.percentual);
      }
    }
    const pts = [...porData.values()];
    const maxPorSerie = new Map();
    for (const pt of pts) {
      for (const [k, v] of Object.entries(pt)) {
        if (k === 'data' || k === 'rot') continue;
        maxPorSerie.set(k, Math.max(maxPorSerie.get(k) ?? 0, Number(v) || 0));
      }
    }
    const top = [...maxPorSerie.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k]) => k);
    return { pontos: pts, series: top };
  }, [dados, instituto]);

  const recentes = useMemo(() => [...dados].sort((a, b) => (b.data_fim || '').localeCompare(a.data_fim || '')).slice(0, 6), [dados]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <h1 className="text-2xl font-bold">PESQUISAS · <span className="uppercase">presidente</span></h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Intenção de voto registrada no TSE · margem de erro e metodologia em cada card
          </p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="rounded-lg border bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900">
            {TIPOS.map(([id, rot]) => (
              <option key={id} value={id}>{rot}</option>
            ))}
          </select>
          <select value={instituto} onChange={(e) => setInstituto(e.target.value)} className="rounded-lg border bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900">
            <option value="todos">Todos institutos</option>
            {institutos.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
      </div>

      {erro && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">Falha na API ({erro}).</p>}

      {series.length > 0 && (
        <div className="rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-2 text-sm font-semibold">Evolução — {tipoRotulo(tipo)}</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={pontos} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
              <XAxis dataKey="rot" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 'auto']} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 12 }} verticalAlign="top" />
              {series.map((s, i) => (
                <Line key={s} type="monotone" dataKey={s} stroke={CORES[i % CORES.length]} strokeWidth={2.5} dot connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {recentes.map((p) => (
          <div key={p.id} className="rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-wrap items-baseline gap-2">
              <strong>{p.instituto}</strong>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-700">{tipoRotulo(p.tipo)}</span>
              {p.confronto && <span className="text-xs text-slate-500 dark:text-slate-400">{p.confronto}</span>}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {fmtData(p.data_inicio)}–{fmtData(p.data_fim)} · margem ±{p.margem_erro} p.p. · {Number(p.amostra).toLocaleString('pt-BR')} entrevistas · reg. {p.registro_tse}
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {(p.resultados || []).slice(0, 5).map((r) => (
                <li key={r.id} className="flex justify-between gap-2">
                  {r.candidato_slug ? (
                    <Link to={`/presidente/${r.candidato_slug}`} className="truncate text-blue-700 hover:underline dark:text-blue-400">
                      {r.candidato_nome}
                    </Link>
                  ) : (
                    <span className="truncate">{r.candidato_nome}</span>
                  )}
                  <strong className="shrink-0">{r.percentual}%</strong>
                </li>
              ))}
            </ul>
            {p.fonte_url && (
              <a href={p.fonte_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-slate-500 underline dark:text-slate-400">
                Ver matéria no G1
              </a>
            )}
          </div>
        ))}
      </div>

      {!erro && recentes.length === 0 && (
        <p className="rounded-xl border bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Nenhuma pesquisa importada ainda — rode o scraper de pesquisas.
        </p>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Pesquisas têm margem de erro e fotografam o momento; não são previsão de resultado.
        Só listamos levantamentos com registro no TSE.
      </p>
    </div>
  );
}
