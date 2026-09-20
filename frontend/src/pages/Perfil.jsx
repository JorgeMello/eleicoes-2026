import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api, brl, fotoUrl } from '../lib/api.js';

function Linha({ k, v }) {
  return (
    <div className="flex justify-between gap-3 border-b py-1.5 text-sm last:border-0 dark:border-slate-700">
      <span className="text-slate-500 dark:text-slate-400">{k}</span>
      <span className="text-right font-medium">{v ?? '—'}</span>
    </div>
  );
}

/** CNPJ 00000000000000 → 00.000.000/0000-00 · CPF → 000.000.000-00 */
/** Cruzamento receitas (doou) × despesas (recebeu) no dossiê. */
function DossieCruzamento({ atual, slug }) {
  const { row, tipo, dados } = atual;
  const ehAtual = (o) => o.candidato_slug === slug && o.tipo === tipo;
  const doadoras = dados.ocorrencias.filter((o) => o.tipo === 'doador' && !ehAtual(o));
  const recebidas = dados.ocorrencias.filter((o) => o.tipo === 'gasto' && !ehAtual(o));
  // Doou para E recebeu da mesma campanha — o cruzamento mais relevante
  const ambos = doadoras
    .map((d) => ({ d, g: recebidas.find((g) => g.candidato_slug === d.candidato_slug) }))
    .filter((x) => x.g);

  const Linha = ({ o }) => (
    <li className="flex justify-between gap-2">
      <a href={`/${o.cargo}/${o.candidato_slug}`} className="truncate text-blue-700 hover:underline dark:text-blue-400">
        {o.candidato_nome} ({o.partido}) · {o.uf}
      </a>
      <strong className="shrink-0">{o.percentual}%</strong>
    </li>
  );

  return (
    <div className="mt-4 space-y-4">
      {ambos.length > 0 && (
        <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-3 text-sm dark:border-amber-600 dark:bg-amber-950/50">
          <p className="flex items-center gap-1.5 font-bold">
            <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M10 2.5 18.5 17h-17L10 2.5z" strokeLinejoin="round" />
              <line x1="10" y1="8" x2="10" y2="12" strokeLinecap="round" />
              <circle cx="10" cy="14.2" r="0.9" fill="currentColor" stroke="none" />
            </svg>
            Doou e recebeu da mesma campanha:
          </p>
          <ul className="mt-1.5 space-y-1">
            {ambos.map(({ d, g }) => (
              <li key={d.candidato_slug}>
                <a href={`/${d.cargo}/${d.candidato_slug}`} className="font-semibold text-blue-700 hover:underline dark:text-blue-400">
                  {d.candidato_nome}
                </a>{' '}
                — doou {d.percentual}% das receitas e recebeu {g.percentual}% dos gastos.
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h3 className="mb-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">
          Como doadora — receita das campanhas ({doadoras.length})
        </h3>
        {doadoras.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Não doou para outras campanhas.</p>
        ) : (
          <ul className="space-y-1.5 text-sm">{doadoras.map((o) => <Linha key={`d-${o.candidato_slug}`} o={o} />)}</ul>
        )}
      </div>
      <div>
        <h3 className="mb-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">
          Como fornecedora — despesa das campanhas ({recebidas.length})
        </h3>
        {recebidas.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Não prestou serviço para outras campanhas.</p>
        ) : (
          <ul className="space-y-1.5 text-sm">{recebidas.map((o) => <Linha key={`g-${o.candidato_slug}`} o={o} />)}</ul>
        )}
      </div>
      {doadoras.length === 0 && recebidas.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400">Só aparece nesta candidatura (nesta eleição).</p>
      )}
    </div>
  );
}

function fmtDoc(doc) {
  const d = String(doc ?? '').replace(/\D/g, '');
  if (d.length === 14) return `CNPJ ${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  if (d.length === 11) return `CPF ${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  return doc;
}

export default function Perfil() {
  const { slug } = useParams();
  const [d, setD] = useState(null);
  const [erro, setErro] = useState(null);
  const [aba, setAba] = useState('geral');
  const [ordemBens, setOrdemBens] = useState('desc'); // 'desc' = maior → menor (padrão)
  const [dossie, setDossie] = useState(null); // { row, tipo, posicao, dados }

  useEffect(() => {
    api.candidato(slug).then(setD).catch((e) => setErro(e.message));
  }, [slug]);

  // Fecha o dossiê com ESC e trava o scroll enquanto aberto
  useEffect(() => {
    if (!dossie) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setDossie(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [dossie]);

  const abrirDossie = (row, tipo, arr) => {
    const posicao = arr.findIndex((r) => r === row) + 1;
    setDossie({ row, tipo, posicao, dados: null });
    if (row.documento) {
      api.empresa(row.documento).then((j) => setDossie((d0) => (d0 ? { ...d0, dados: j } : d0))).catch(() => {});
    }
  };

  if (erro) return <p className="text-sm text-red-700 dark:text-red-400">Erro: {erro}</p>;
  if (!d) return <p className="text-sm text-slate-500 dark:text-slate-400">Carregando perfil…</p>;

  const { candidato: c, bens, historico, doadores, gastos } = d;
  const foto = fotoUrl(c);
  // Bens ordenados por valor (nulos sempre por último); padrão: maior → menor
  const bensOrdenados = [...bens].sort((x, y) => {
    const vx = x.valor === null || x.valor === undefined ? null : Number(x.valor);
    const vy = y.valor === null || y.valor === undefined ? null : Number(y.valor);
    if (vx === null && vy === null) return 0;
    if (vx === null) return 1;
    if (vy === null) return -1;
    return ordemBens === 'desc' ? vy - vx : vx - vy;
  });
  const abas = [
    ['geral', 'Visão geral'],
    ['bens', `Bens (${bens.length})`],
    ['historico', 'Histórico'],
    ['contas', 'Contas'],
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        {foto && <img src={foto} alt={c.nome} className="h-28 w-28 rounded-2xl object-cover" />}
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">{c.nome}</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {c.partido} · <span className="font-mono text-xl font-bold text-slate-800 dark:text-slate-100">{c.numero}</span> · {c.cargo} {c.uf}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Vice: <strong>{c.vice_nome ?? '—'}</strong> {c.vice_partido ? `(${c.vice_partido})` : ''}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {c.perfil_g1_url && <a href={c.perfil_g1_url} target="_blank" rel="noreferrer" className="rounded bg-slate-900 px-2.5 py-1 text-white">Ver no G1</a>}
            {c.plano_governo_url && <a href={c.plano_governo_url} target="_blank" rel="noreferrer" className="rounded bg-emerald-600 px-2.5 py-1 text-white">Plano de governo (TSE)</a>}
          </div>
        </div>
        <div className="grid min-w-44 flex-1 gap-2 sm:max-w-64">
          {[['Patrimônio', brl(c.patrimonio_total)], ['Receitas', brl(c.receitas_total)], ['Despesas', brl(c.despesas_total)], ['Limite', brl(c.limite_gastos)]].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-slate-50 px-3 py-1.5 text-sm dark:bg-slate-800">
              <span className="text-slate-500 dark:text-slate-400">{k}: </span><strong>{v}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-1 text-sm">
        {abas.map(([id, rot]) => (
          <button key={id} onClick={() => setAba(id)} className={`rounded-lg px-3 py-1.5 ${aba === id ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white border hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800'}`}>
            {rot}
          </button>
        ))}
      </div>

      {aba === 'geral' && (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <Linha k="Profissão" v={c.profissao} />
            <Linha k="Cor/etnia" v={c.cor_etnia} />
            <Linha k="Instrução" v={c.grau_instrucao} />
            <Linha k="Gênero" v={c.genero} />
            <Linha k="Coletado em" v={c.coletado_em} />
            <Linha k="Fonte (G1)" v={c.fonte_atualizado_em} />
          </div>
          <div className="rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-2 text-sm font-semibold">Top doadores</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={doadores.slice(0, 5)} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="nome" width={140} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="percentual" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {aba === 'bens' && (
        <div className="overflow-x-auto rounded-xl border bg-white dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left dark:bg-slate-800">
              <tr>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Descrição</th>
                <th className="px-3 py-2 text-right" aria-sort={ordemBens === 'desc' ? 'descending' : 'ascending'}>
                  <button
                    type="button"
                    onClick={() => setOrdemBens((o) => (o === 'desc' ? 'asc' : 'desc'))}
                    title={ordemBens === 'desc' ? 'Ordenado do maior para o menor — clique para inverter' : 'Ordenado do menor para o maior — clique para inverter'}
                    className="ml-auto inline-flex cursor-pointer items-center gap-1 font-semibold hover:text-slate-900"
                  >
                    Valor <span aria-hidden="true">{ordemBens === 'desc' ? '▼' : '▲'}</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {bensOrdenados.map((b, i) => (
                <tr key={b.id ?? i} className="border-t">
                  <td className="px-3 py-1.5 font-medium">{b.tipo}</td>
                  <td className="px-3 py-1.5 text-slate-600 dark:text-slate-400">{b.descricao}</td>
                  <td className="px-3 py-1.5 text-right">{brl(b.valor)}</td>
                </tr>
              ))}
              {bensOrdenados.length === 0 && <tr><td colSpan={3} className="px-3 py-4 text-center text-slate-500 dark:text-slate-400">Sem bens coletados ainda.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {aba === 'historico' && (
        <ol className="space-y-2">
          {historico.map((h, i) => (
            <li key={i} className="rounded-xl border bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
              <strong>{h.ano}</strong> · {h.cargo} · {h.partido} · <span className="rounded bg-slate-100 px-2 py-0.5 dark:bg-slate-700">{h.resultado}</span>
            </li>
          ))}
          {historico.length === 0 && <li className="text-sm text-slate-500 dark:text-slate-400">Sem histórico coletado.</li>}
        </ol>
      )}

      {aba === 'contas' && (
        <div className="grid gap-3 md:grid-cols-2">
          {[['Doadores', doadores, 'doador'], ['Gastos', gastos, 'gasto']].map(([t, arr, tipo]) => (
            <div key={t} className="rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="mb-2 text-sm font-semibold">{t}</h2>
              <ul className="space-y-1.5 text-sm">
                {arr.map((x, i) => (
                  <li key={x.id ?? i} className="flex items-center justify-between gap-2">
                    {x.documento ? (
                      <button
                        type="button"
                        onClick={() => abrirDossie(x, tipo, arr)}
                        title="Ver dossiê: quanto recebeu e de quem mais"
                        className="truncate text-left text-blue-700 hover:underline dark:text-blue-400"
                      >
                        {x.nome}
                      </button>
                    ) : (
                      <span className="truncate" title="Sem CNPJ/CPF confirmado na fonte">
                        {x.nome} <span className="text-xs text-slate-400">(sem CNPJ)</span>
                      </span>
                    )}
                    <strong className="shrink-0">{x.percentual ?? '—'}%</strong>
                  </li>
                ))}
                {arr.length === 0 && <li className="text-slate-500 dark:text-slate-400">—</li>}
              </ul>
            </div>
          ))}
        </div>
      )}

      {dossie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDossie(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Dossiê: ${dossie.row.nome}`}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">{dossie.row.nome}</h2>
                <p className="font-mono text-xs text-slate-500 dark:text-slate-400">{fmtDoc(dossie.row.documento)}</p>
              </div>
              <button
                type="button"
                onClick={() => setDossie(null)}
                aria-label="Fechar dossiê"
                className="rounded-lg border px-2 py-1 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800">
              <strong>Neste candidato ({c.nome}):</strong> {dossie.row.percentual}%{' '}
              {dossie.tipo === 'gasto' ? 'dos gastos' : 'das doações'} (posição nº {dossie.posicao} no ranking).
            </div>
            {!dossie.dados ? (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Carregando cruzamento…</p>
            ) : (
              <DossieCruzamento atual={dossie} slug={slug} />
            )}
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Identificação por {dossie.dados?.tipo_doc ?? 'documento'} · Fonte: TSE via G1. Fase 1: só dados
              internos; sem CNPJ confirmado não há dossiê.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
