import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import CandidateCard from '../components/CandidateCard.jsx';
import { api } from '../lib/api.js';

const CORES = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

function donut(obj) {
  return Object.entries(obj ?? {})
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));
}

export default function Home() {
  const { cargo = 'presidente' } = useParams();
  const [sp, setSp] = useSearchParams();
  const [lista, setLista] = useState([]);
  const [stats, setStats] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  const busca = sp.get('busca') ?? '';
  const partido = sp.get('partido') ?? '';
  const ordenar = sp.get('ordenar') ?? 'nome';

  useEffect(() => {
    setLoading(true);
    setErro(null);
    Promise.all([
      api.candidatos(cargo, { busca, partido, ordenar }),
      api.estatisticas(cargo),
    ])
      .then(([l, s]) => {
        setLista(l);
        setStats(s);
      })
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, [cargo, busca, partido, ordenar]);

  const upd = (k, v) => {
    const n = new URLSearchParams(sp);
    if (v) n.set(k, v);
    else n.delete(k);
    setSp(n);
  };

  const partidos = stats ? Object.keys(stats.por_partido).sort() : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <h1 className="text-2xl font-bold">Candidatos · <span className="uppercase">{cargo}</span></h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {stats ? `${stats.total} candidaturas` : 'carregando…'} · clique num card para ver o perfil completo
          </p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <input
            value={busca}
            onChange={(e) => upd('busca', e.target.value)}
            placeholder="Buscar nome ou número…"
            className="rounded-lg border bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
          <select value={partido} onChange={(e) => upd('partido', e.target.value)} className="rounded-lg border bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900">
            <option value="">Todos partidos</option>
            {partidos.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select value={ordenar} onChange={(e) => upd('ordenar', e.target.value)} className="rounded-lg border bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900">
            <option value="nome">A–Z</option>
            <option value="numero">Número</option>
            <option value="patrimonio_desc">Maior patrimônio</option>
            <option value="patrimonio_asc">Menor patrimônio</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-500 dark:text-slate-400">Carregando…</p>}
      {erro && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          Falha na API ({erro}). Verifique se o backend está rodando e `VITE_API_URL` no `.env`.
        </p>
      )}

      {stats && stats.total > 0 && (
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-sm font-semibold">Por partido</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={donut(stats.por_partido)} dataKey="value" nameKey="name" outerRadius={70}>
                  {donut(stats.por_partido).map((_, i) => (
                    <Cell key={i} fill={CORES[i % CORES.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-sm font-semibold">Por instrução</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={donut(stats.por_instrucao)} dataKey="value" nameKey="name" outerRadius={70}>
                  {donut(stats.por_instrucao).map((_, i) => (
                    <Cell key={i} fill={CORES[(i + 2) % CORES.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-sm font-semibold">Por cor/etnia</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={donut(stats.por_cor)} dataKey="value" nameKey="name" outerRadius={70}>
                  {donut(stats.por_cor).map((_, i) => (
                    <Cell key={i} fill={CORES[(i + 4) % CORES.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!loading && !erro && lista.length === 0 && (
        <p className="rounded-xl border bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Nenhuma candidatura para <strong>{cargo}</strong> ainda — rode a coleta do scraper para este cargo.
          {cargo !== 'presidente' && ' No MVP, só presidente possui dados.'}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((c) => (
          <CandidateCard key={c.slug} c={c} cargo={cargo} />
        ))}
      </div>

      {lista.length >= 2 && (
        <Link to={`/${cargo}/comparar?a=${lista[0].slug}&b=${lista[1].slug}`} className="inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700">
          Comparar candidatos →
        </Link>
      )}
    </div>
  );
}
