import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api, brl, UFS } from '../lib/api.js';
import { clientCache } from '../lib/clientCache.js';

/** Gera frases interpretativas a partir das linhas do ranking de candidatos. */
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

/** Gera frases interpretativas a partir das linhas do ranking de doadores. */
function interpretaDoadores(rows) {
  const frases = [];
  if (rows.length > 0) {
    const [lider, vice] = rows;
    frases.push(
      `${lider.nome} é o principal doador/repasse registrado, aportando ${brl(lider.valor_calculado)}${lider.percentual ? ` (${lider.percentual}% da receita)` : ''} para a campanha de ${lider.candidato_nome} (${lider.candidato_partido}).`
    );
    if (vice) {
      frases.push(
        `${vice.nome} vem em segundo com ${brl(vice.valor_calculado)}${vice.percentual ? ` (${vice.percentual}% da receita)` : ''} para a campanha de ${vice.candidato_nome} (${vice.candidato_partido}).`
      );
    }
    const soma = rows.reduce((s, r) => s + (r.valor_calculado || 0), 0);
    frases.push(
      `Somados, os ${rows.length} principais financiadores acumulam ${brl(soma)} (média de ${brl(soma / rows.length)} por repasse/doação).`
    );
  } else {
    frases.push('Nenhum registro de doador coletado ainda para este cargo/UF.');
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
  const [gas, setGas] = useState([]);
  const [doa, setDoa] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ajudaRank, setAjudaRank] = useState(null); // 'patrimonio' | 'receitas' | 'gastos' | 'doadores' | null
  const [uf, setUf] = useState('');
  const [cargoAnterior, setCargoAnterior] = useState(cargo);

  // Redefine UF quando mudar o cargo de forma declarativa (evita cascading setState no effect)
  if (cargo !== cargoAnterior) {
    setCargoAnterior(cargo);
    setUf('');
  }

  const precisaUf = cargo !== 'presidente';

  useEffect(() => {
    const params = uf ? { uf } : {};
    const cacheKey = `rankings_${cargo}_${uf}`;
    const cached = clientCache.get(cacheKey);

    if (cached) {
      setPat(cached.p);
      setRec(cached.r);
      setGas(cached.g);
      setDoa(cached.d);
      setLoading(false);
    } else {
      setLoading(true);
    }

    Promise.all([
      api.rankingPatrimonio(cargo, params),
      api.rankingReceitas(cargo, params),
      api.rankingGastos(cargo, params),
      api.rankingDoadores(cargo, params),
    ])
      .then(([p, r, g, d]) => {
        setPat(p);
        setRec(r);
        setGas(g);
        setDoa(d);
        clientCache.set(cacheKey, { p, r, g, d });
        setErro(null);
      })
      .catch((e) => {
        if (!cached) setErro(e.message);
      })
      .finally(() => setLoading(false));
  }, [cargo, uf]);


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

  const barra = (titulo, rows, chave, ajudaId, corBarra = '#3b82f6', corDestaque = 'text-blue-700 dark:text-blue-400') => (
    <div className="flex flex-col rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-2 flex items-center justify-between gap-1.5 text-sm font-semibold">
        <span className="flex items-center gap-1.5">
          {titulo}
          <button
            type="button"
            onClick={() => setAjudaRank(ajudaId)}
            title={`Entenda o ranking: ${titulo}`}
            aria-label={`Entenda o ranking: ${titulo}`}
            className="inline-flex items-center justify-center rounded-full border border-current p-0.5 opacity-70 hover:opacity-100"
          >
            <IconeAjuda />
          </button>
        </span>
        <span className="text-[11px] font-normal text-slate-400">
          {rows.length} candidatos
        </span>
      </h2>
      <ResponsiveContainer width="100%" height={Math.max(200, rows.length * 34)}>
        <BarChart data={rows} layout="vertical">
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="nome" width={140} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [brl(v), titulo]} />
          <Bar dataKey={chave} fill={corBarra} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <ul className="mt-3 divide-y divide-slate-100 text-sm dark:divide-slate-800">
        {rows.map((c) => (
          <li key={c.slug} className="flex items-center justify-between gap-2 py-1.5">
            <Link to={`/${cargo}/${c.slug}`} className="truncate text-blue-700 hover:underline dark:text-blue-400">
              {c.nome} <span className="text-xs text-slate-500 dark:text-slate-400">({c.partido} {c.numero})</span>
            </Link>
            <strong className={`shrink-0 ${corDestaque}`}>{brl(c[chave])}</strong>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="py-4 text-center text-xs text-slate-400">Nenhum dado encontrado para o filtro.</li>
        )}
      </ul>
    </div>
  );

  const barraDoadores = (titulo, rows, ajudaId, corBarra = '#f59e0b') => (
    <div className="flex flex-col rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-2 flex items-center justify-between gap-1.5 text-sm font-semibold">
        <span className="flex items-center gap-1.5">
          {titulo}
          <button
            type="button"
            onClick={() => setAjudaRank(ajudaId)}
            title={`Entenda o ranking: ${titulo}`}
            aria-label={`Entenda o ranking: ${titulo}`}
            className="inline-flex items-center justify-center rounded-full border border-current p-0.5 opacity-70 hover:opacity-100"
          >
            <IconeAjuda />
          </button>
        </span>
        <span className="text-[11px] font-normal text-slate-400">
          {rows.length} principais repasses
        </span>
      </h2>
      <ResponsiveContainer width="100%" height={Math.max(200, rows.length * 34)}>
        <BarChart data={rows} layout="vertical">
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="nome" width={140} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(v, _name, item) => [
              brl(v),
              `${item.payload.nome} (para ${item.payload.candidato_nome})`,
            ]}
          />
          <Bar dataKey="valor_calculado" fill={corBarra} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <ul className="mt-3 divide-y divide-slate-100 text-sm dark:divide-slate-800">
        {rows.map((d, i) => (
          <li key={d.id ?? i} className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <span className="block truncate font-medium text-slate-800 dark:text-slate-100" title={d.nome}>
                {d.nome}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Destinado a{' '}
                <Link to={`/${cargo}/${d.candidato_slug}`} className="text-blue-700 hover:underline dark:text-blue-400">
                  {d.candidato_nome} ({d.candidato_partido})
                </Link>
                {d.percentual ? ` · ${d.percentual}% da receita` : ''}
              </span>
            </div>
            <strong className="shrink-0 text-amber-600 dark:text-amber-400">{brl(d.valor_calculado)}</strong>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="py-4 text-center text-xs text-slate-400">Nenhum doador encontrado para o filtro.</li>
        )}
      </ul>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">
          Rankings · <span className="uppercase text-blue-600 dark:text-blue-400">{cargo}</span>
        </h1>
        {precisaUf && (
          <select
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            className="rounded-lg border bg-white px-3 py-1.5 text-sm font-semibold shadow-sm dark:border-slate-700 dark:bg-slate-900"
            title="UF do ranking"
          >
            <option value="">Todas as UFs</option>
            {UFS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Grade de 4 Cards: Patrimônio, Receitas, Gastos e Doadores */}
      {loading && !pat.length && !rec.length ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-blue-900 shadow-sm dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
            <svg className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <div className="text-sm">
              <span className="font-semibold">Calculando rankings financeiros...</span>
              <span className="block text-xs text-blue-700 dark:text-blue-300">Cruzando patrimônio declarado, receitas de doações e despesas oficiais.</span>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {barra('Maior patrimônio', pat, 'patrimonio_total', 'patrimonio', '#3b82f6', 'text-blue-700 dark:text-blue-400')}
          {barra('Maiores receitas', rec, 'receitas_total', 'receitas', '#10b981', 'text-emerald-700 dark:text-emerald-400')}
          {barra('Maiores gastos', gas, 'despesas_total', 'gastos', '#f43f5e', 'text-rose-600 dark:text-rose-400')}
          {barraDoadores('Maiores doadores', doa, 'doadores', '#f59e0b')}
        </div>
      )}

      {/* Modal Didático Explicativo */}
      {ajudaRank && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setAjudaRank(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={
              ajudaRank === 'patrimonio'
                ? 'Entenda o ranking de patrimônio'
                : ajudaRank === 'receitas'
                ? 'Entenda o ranking de receitas'
                : ajudaRank === 'gastos'
                ? 'Entenda o ranking de gastos'
                : 'Entenda o ranking de doadores'
            }
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2 className="text-lg font-bold">
                {ajudaRank === 'patrimonio' && 'Maior patrimônio — em palavras'}
                {ajudaRank === 'receitas' && 'Maiores receitas — em palavras'}
                {ajudaRank === 'gastos' && 'Maiores gastos — em palavras'}
                {ajudaRank === 'doadores' && 'Maiores doadores — em palavras'}
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
              {ajudaRank === 'receitas' && (
                <li className="flex gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 p-3 font-bold text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100">
                  <svg viewBox="0 0 20 20" className="h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="10" cy="10" r="8" />
                    <text x="10" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" stroke="none">R$</text>
                  </svg>
                  <span>
                    Receita de campanha é todo o dinheiro arrecadado pelo candidato para financiar a
                    campanha: repasses do partido (Fundo Eleitoral / Partidário), doações de pessoas
                    físicas e financiamento coletivo — tudo declarado ao TSE na prestação de contas.
                  </span>
                </li>
              )}

              {ajudaRank === 'gastos' && (
                <li className="flex gap-2.5 rounded-xl border border-rose-300 bg-rose-50 p-3 font-bold text-rose-950 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-100">
                  <svg viewBox="0 0 20 20" className="h-6 w-6 shrink-0 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="10" cy="10" r="8" />
                    <path d="M6 10h8M10 6v8" strokeLinecap="round" />
                  </svg>
                  <span>
                    Gastos de campanha correspondem a todas as despesas contratadas e pagas pelas candidaturas:
                    produção de programas de rádio e TV, pesquisas de opinião, comícios, viagens, assessoria
                    jurídica e contábil, e publicidade de rua e digital — tudo fiscalizado pelo teto de gastos do TSE.
                  </span>
                </li>
              )}

              {ajudaRank === 'doadores' && (
                <li className="flex gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3 font-bold text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
                  <svg viewBox="0 0 20 20" className="h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="10" cy="10" r="8" />
                    <path d="M10 5v10M7 8h6" strokeLinecap="round" />
                  </svg>
                  <span>
                    Doadores representam os financiadores das campanhas: repasses dos Diretórios Partidários
                    (Fundo Especial de Financiamento de Campanha / Fundo Partidário), doações de pessoas físicas
                    (limitadas a 10% dos rendimentos brutos) e vaquinhas virtuais homologadas pelo TSE. Doações
                    de pessoas jurídicas (empresas) são proibidas por lei.
                  </span>
                </li>
              )}

              {ajudaRank === 'doadores'
                ? interpretaDoadores(doa).map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden="true" className="text-amber-500">●</span>
                      <span>{f}</span>
                    </li>
                  ))
                : interpreta(
                    ajudaRank === 'patrimonio' ? pat : ajudaRank === 'receitas' ? rec : gas,
                    ajudaRank === 'patrimonio' ? 'patrimonio_total' : ajudaRank === 'receitas' ? 'receitas_total' : 'despesas_total'
                  ).map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden="true" className="text-emerald-600 dark:text-emerald-400">●</span>
                      <span>{f}</span>
                    </li>
                  ))}

              <li className="flex gap-2 text-slate-500 dark:text-slate-400">
                <span aria-hidden="true">●</span>
                <span>Fonte: TSE via G1 (coleta Playwright). Valores sujeitos a atualização até a homologação final das contas.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
