import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api, brl } from '../lib/api.js';

export default function Rankings() {
  const { cargo = 'presidente' } = useParams();
  const [pat, setPat] = useState([]);
  const [rec, setRec] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    Promise.all([api.rankingPatrimonio(cargo), api.rankingReceitas(cargo)])
      .then(([p, r]) => {
        setPat(p);
        setRec(r);
      })
      .catch((e) => setErro(e.message));
  }, [cargo]);

  if (erro) return <p className="text-sm text-red-700 dark:text-red-400">Erro: {erro}</p>;

  const barra = (titulo, rows, chave) => (
    <div className="rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-2 text-sm font-semibold">{titulo}</h2>
      <ResponsiveContainer width="100%" height={Math.max(220, rows.length * 36)}>
        <BarChart data={rows} layout="vertical">
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="nome" width={150} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => brl(v)} />
          <Bar dataKey={chave} fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
      <ul className="mt-2 space-y-1 text-sm">
        {rows.map((c) => (
          <li key={c.slug} className="flex justify-between gap-2">
            <Link to={`/${cargo}/${c.slug}`} className="truncate text-blue-700 hover:underline dark:text-blue-400">
              {c.nome} ({c.partido} {c.numero})
            </Link>
            <strong className="shrink-0">{brl(c[chave])}</strong>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Rankings · {cargo}</h1>
      <div className="grid gap-3 lg:grid-cols-2">
        {barra('Maior patrimônio', pat, 'patrimonio_total')}
        {barra('Maiores receitas', rec, 'receitas_total')}
      </div>
    </div>
  );
}
