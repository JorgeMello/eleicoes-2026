import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api, brl } from '../lib/api.js';

/** Gera frases interpretativas a partir das linhas do ranking. */
function interpreta(rows, chave) {
  const com = rows
    .filter((r) => r[chave] !== null && r[chave] !== undefined && r[chave] !== '')
    .map((r) => ({ ...r, v: Number(r[chave]) }))
    .sort((a, b) => b.v - a.v);
  const sem = rows.filter((r) => r[chave] === null || r[chave] === undefined || r[chave] === '');
  const frases = [];
  if (com.length > 0) {
    const [lider, vice] = com;
    frases.push(`${lider.nome} (${lider.partido} ${lider.numero}) lidera com ${brl(lider.v)}.`);
    if (vice) {
      frases.push(
        `${vice.nome} (${vice.partido} ${vice.numero}) vem em segundo com ${brl(vice.v)} — diferença de ${brl(lider.v - vice.v)} para o líder.`
      );
    }
    const soma = com.reduce((s, r) => s + r.v, 0);
    frases.push(
      `Somados, os ${com.length} candidatos com dados declarados acumulam ${brl(soma)} (média de ${brl(soma / com.length)}).`
    );
  } else {
    frases.push('Nenhum candidato com valor coletado ainda neste ranking.');
  }
  if (sem.length > 0) {
    frases.push(
      `${sem.length} ${sem.length === 1 ? 'candidato ainda sem valor coletado' : 'candidatos ainda sem valor coletado'}: ${sem.map((r) => r.nome).join(', ')}.`
    );
  }
  return frases;
}

function IconeAjuda({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" />
      <line x1="8" y1="7.2" x2="8" y2="11.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Rankings() {
  const { cargo = 'presidente' } = useParams();
  const [pat, setPat] = useState([]);
  const [rec, setRec] = useState([]);
  const [erro, setErro] = useState(null);
  const [ajudaRank, setAjudaRank] = useState(null); // 'patrimonio' | 'receitas' | null

  useEffect(() => {
    Promise.all([api.rankingPatrimonio(cargo), api.rankingReceitas(cargo)])
      .then(([p, r]) => {
        setPat(p);
        setRec(r);
      })
      .catch((e) => setErro(e.message));
  }, [cargo]);

  // Fecha o modal com ESC e trava o scroll do body enquanto aberto
  useEffect(() => {
    if (!ajudaRank) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setAjudaRank(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [ajudaRank]);

  if (erro) return <p className="text-sm text-red-700 dark:text-red-400">Erro: {erro}</p>;

  const barra = (titulo, rows, chave, ajudaId) => (
    <div className="rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
        {titulo}
        <button
          type="button"
          onClick={() => setAjudaRank(ajudaId)}
          title={`Entenda o ranking: ${titulo}`}
          aria-label={`Entenda o ranking: ${titulo}`}
          className="inline-flex items-center justify-center rounded-full border border-current opacity-70 hover:opacity-100"
        >
          <IconeAjuda />
        </button>
      </h2>
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
      <h1 className="text-2xl font-bold">Rankings · <span className="uppercase">{cargo}</span></h1>
      <div className="grid gap-3 lg:grid-cols-2">
        {barra('Maior patrimônio', pat, 'patrimonio_total', 'patrimonio')}
        {barra('Maiores receitas', rec, 'receitas_total', 'receitas')}
      </div>

      {ajudaRank && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setAjudaRank(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={ajudaRank === 'patrimonio' ? 'Entenda o ranking de patrimônio' : 'Entenda o ranking de receitas'}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2 className="text-lg font-bold">
                {ajudaRank === 'patrimonio' ? 'Maior patrimônio — em palavras' : 'Maiores receitas — em palavras'}
              </h2>
              <button
                type="button"
                onClick={() => setAjudaRank(null)}
                aria-label="Fechar"
                className="rounded-lg border px-2 py-1 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            <ul className="space-y-2.5 text-sm leading-relaxed">
              {interpreta(ajudaRank === 'patrimonio' ? pat : rec, ajudaRank === 'patrimonio' ? 'patrimonio_total' : 'receitas_total').map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden="true" className="text-emerald-600 dark:text-emerald-400">●</span>
                  <span>{f}</span>
                </li>
              ))}
              <li className="flex gap-2 text-slate-500 dark:text-slate-400">
                <span aria-hidden="true">●</span>
                <span>Fonte: TSE via G1 (coleta Playwright). Valores sujeitos a atualização até o 2º turno.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
