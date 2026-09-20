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
function fmtDoc(doc) {
  const d = String(doc ?? '').replace(/\D/g, '');
  if (d.length === 14) return `CNPJ ${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  if (d.length === 11) return `CPF ${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  return doc ? `Doc: ${doc}` : 'Documento não informado';
}

/** Cruzamento receitas (doou) × despesas (recebeu) no controle dos dados. */
function ControleDadosCruzamento({ atual, slug }) {
  const { tipo, dados } = atual;
  const ehAtual = (o) => o.candidato_slug === slug && o.tipo === tipo;
  const doadoras = (dados?.ocorrencias ?? []).filter((o) => o.tipo === 'doador' && !ehAtual(o));
  const recebidas = (dados?.ocorrencias ?? []).filter((o) => o.tipo === 'gasto' && !ehAtual(o));

  // Doou para E recebeu da mesma campanha — cruzamento de controle relevante
  const ambos = doadoras
    .map((d) => ({ d, g: recebidas.find((g) => g.candidato_slug === d.candidato_slug) }))
    .filter((x) => x.g);

  const LinhaCruzamento = ({ o }) => {
    const valCalc = o.valor
      ? Number(o.valor)
      : o.tipo === 'doador'
      ? (Number(o.receitas_total || 0) * Number(o.percentual || 0)) / 100
      : (Number(o.despesas_total || 0) * Number(o.percentual || 0)) / 100;

    return (
      <li className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs dark:bg-slate-800/80">
        <a href={`/${o.cargo}/${o.candidato_slug}`} className="truncate font-medium text-blue-700 hover:underline dark:text-blue-400">
          {o.candidato_nome} <span className="text-slate-500 dark:text-slate-400">({o.partido} · {o.uf})</span>
        </a>
        <div className="shrink-0 text-right">
          <strong className="text-slate-800 dark:text-slate-100">{o.percentual}%</strong>
          {valCalc > 0 && <span className="ml-1.5 text-[11px] text-slate-500 dark:text-slate-400">({brl(valCalc)})</span>}
        </div>
      </li>
    );
  };

  return (
    <div className="mt-4 space-y-4">
      {ambos.length > 0 && (
        <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-3.5 text-sm dark:border-amber-600 dark:bg-amber-950/50">
          <p className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
            <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M10 2.5 18.5 17h-17L10 2.5z" strokeLinejoin="round" />
              <line x1="10" y1="8" x2="10" y2="12" strokeLinecap="round" />
              <circle cx="10" cy="14.2" r="0.9" fill="currentColor" stroke="none" />
            </svg>
            Alerta de Cruzamento: Doou e também recebeu da mesma campanha:
          </p>
          <ul className="mt-2 space-y-1.5 text-xs">
            {ambos.map(({ d, g }) => (
              <li key={d.candidato_slug} className="rounded-lg bg-white/80 p-2 dark:bg-slate-900/60">
                <a href={`/${d.cargo}/${d.candidato_slug}`} className="font-semibold text-blue-700 hover:underline dark:text-blue-400">
                  {d.candidato_nome} ({d.partido})
                </a>{' '}
                — contribuiu com <strong>{d.percentual}%</strong> das receitas e recebeu <strong>{g.percentual}%</strong> dos gastos.
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          <span>Como doadora em outras campanhas</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {doadoras.length} {doadoras.length === 1 ? 'registro' : 'registros'}
          </span>
        </h3>
        {doadoras.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
            Não constam doações para outros candidatos nesta eleição.
          </p>
        ) : (
          <ul className="space-y-1.5">{doadoras.map((o) => <LinhaCruzamento key={`d-${o.candidato_slug}`} o={o} />)}</ul>
        )}
      </div>

      <div>
        <h3 className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
          <span>Como fornecedora em outras campanhas</span>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            {recebidas.length} {recebidas.length === 1 ? 'registro' : 'registros'}
          </span>
        </h3>
        {recebidas.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
            Não constam pagamentos como prestadora de serviço para outros candidatos.
          </p>
        ) : (
          <ul className="space-y-1.5">{recebidas.map((o) => <LinhaCruzamento key={`g-${o.candidato_slug}`} o={o} />)}</ul>
        )}
      </div>

      {doadoras.length === 0 && recebidas.length === 0 && (
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Esta instituição/empresa figura exclusivamente nesta candidatura no momento.
        </p>
      )}
    </div>
  );
}

export default function Perfil() {
  const { slug } = useParams();
  const [d, setD] = useState(null);
  const [erro, setErro] = useState(null);
  const [aba, setAba] = useState('geral');
  const [ordemBens, setOrdemBens] = useState('desc');
  const [modalConta, setModalConta] = useState(null); // { row, tipo, posicao, dados, carregando }

  useEffect(() => {
    api.candidato(slug).then(setD).catch((e) => setErro(e.message));
  }, [slug]);

  // Fecha a modal com ESC e trava o scroll enquanto aberta
  useEffect(() => {
    if (!modalConta) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setModalConta(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [modalConta]);

  const abrirModalConta = (row, tipo, arr) => {
    const posicao = arr.findIndex((r) => r === row) + 1;
    setModalConta({ row, tipo, posicao, dados: null, carregando: !!row.documento });

    if (row.documento) {
      api
        .empresa(row.documento)
        .then((j) => setModalConta((m) => (m ? { ...m, dados: j, carregando: false } : m)))
        .catch(() => setModalConta((m) => (m ? { ...m, carregando: false } : m)));
    }
  };

  if (erro) return <p className="text-sm text-red-700 dark:text-red-400">Erro: {erro}</p>;
  if (!d) return <p className="text-sm text-slate-500 dark:text-slate-400">Carregando perfil…</p>;

  const { candidato: c, bens, historico, doadores, gastos } = d;
  const foto = fotoUrl(c);

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

  // Cálculos de métricas da modal quando ativa
  const ehDoador = modalConta?.tipo === 'doador';
  const recTotal = Number(c?.receitas_total || 0);
  const despTotal = Number(c?.despesas_total || 0);
  const percOficial = Number(modalConta?.row?.percentual || 0);

  // Valor em Reais (calculado ou explícito)
  const valorItem = modalConta?.row?.valor
    ? Number(modalConta.row.valor)
    : ehDoador
    ? (recTotal * percOficial) / 100
    : (despTotal * percOficial) / 100;

  // Relações percentuais
  const percSobreReceita = recTotal > 0 ? (valorItem / recTotal) * 100 : 0;
  const percSobreDespesa = despTotal > 0 ? (valorItem / despTotal) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Cabeçalho do Perfil */}
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
          {[
            ['Patrimônio', brl(c.patrimonio_total)],
            ['Receitas', brl(c.receitas_total)],
            ['Despesas', brl(c.despesas_total)],
            ['Limite', brl(c.limite_gastos)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-slate-50 px-3 py-1.5 text-sm dark:bg-slate-800">
              <span className="text-slate-500 dark:text-slate-400">{k}: </span>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Abas de Navegação */}
      <div className="flex gap-1 text-sm">
        {abas.map(([id, rot]) => (
          <button
            key={id}
            onClick={() => setAba(id)}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              aba === id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                : 'bg-white border hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800'
            }`}
          >
            {rot}
          </button>
        ))}
      </div>

      {/* Aba: Geral */}
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
            <h2 className="mb-2 text-sm font-semibold">Top doadores da campanha</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={doadores.slice(0, 5)} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="nome" width={140} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="percentual" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Aba: Bens */}
      {aba === 'bens' && (
        <div className="overflow-x-auto rounded-xl border bg-white dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left dark:bg-slate-800">
              <tr>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Descrição</th>
                <th className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => setOrdemBens((o) => (o === 'desc' ? 'asc' : 'desc'))}
                    title={ordemBens === 'desc' ? 'Ordenado do maior para o menor — clique para inverter' : 'Ordenado do menor para o maior — clique para inverter'}
                    className="ml-auto inline-flex cursor-pointer items-center gap-1 font-semibold hover:text-slate-900 dark:hover:text-white"
                  >
                    Valor <span aria-hidden="true">{ordemBens === 'desc' ? '▼' : '▲'}</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {bensOrdenados.map((b, i) => (
                <tr key={b.id ?? i} className="border-t dark:border-slate-800">
                  <td className="px-3 py-1.5 font-medium">{b.tipo}</td>
                  <td className="px-3 py-1.5 text-slate-600 dark:text-slate-400">{b.descricao}</td>
                  <td className="px-3 py-1.5 text-right">{brl(b.valor)}</td>
                </tr>
              ))}
              {bensOrdenados.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-4 text-center text-slate-500 dark:text-slate-400">
                    Sem bens coletados ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Aba: Histórico */}
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

      {/* Aba: Contas (Doadores e Gastos) */}
      {aba === 'contas' && (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['Doadores', doadores, 'doador', 'receitas', 'text-emerald-700 dark:text-emerald-400'],
            ['Gastos', gastos, 'gasto', 'despesas', 'text-blue-700 dark:text-blue-400'],
          ].map(([t, arr, tipo, label, corTexto]) => (
            <div key={t} className="rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-base">{t}</h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Clique no nome para abrir o controle detalhado
                </span>
              </div>
              <ul className="divide-y text-sm dark:divide-slate-800">
                {arr.map((x, i) => (
                  <li key={x.id ?? i} className="flex items-center justify-between gap-2 py-2">
                    <button
                      type="button"
                      onClick={() => abrirModalConta(x, tipo, arr)}
                      title="Clique para ver o controle dos dados, porcentagem da receita e cruzamentos"
                      className="group flex min-w-0 flex-1 flex-col text-left cursor-pointer hover:opacity-90"
                    >
                      <span className="truncate font-medium text-blue-700 group-hover:underline dark:text-blue-400">
                        {x.nome}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {x.documento ? fmtDoc(x.documento) : 'Sem documento informado'}
                      </span>
                    </button>
                    <div className="shrink-0 text-right">
                      <span className={`font-bold ${corTexto}`}>
                        {x.percentual ?? '—'}%
                      </span>
                      <p className="text-[11px] text-slate-400">
                        das {label}
                      </p>
                    </div>
                  </li>
                ))}
                {arr.length === 0 && <li className="py-3 text-slate-500 dark:text-slate-400">—</li>}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Modal Explicativa de Controle dos Dados (Doadores e Gastos) */}
      {modalConta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setModalConta(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Controle dos Dados: ${modalConta.row.nome}`}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho da Modal */}
            <div className="mb-4 flex items-start justify-between gap-3 border-b pb-3 dark:border-slate-800">
              <div>
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider mb-1 ${
                    ehDoador
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}
                >
                  {ehDoador ? '🌱 Instituição / Doador Oficial' : '🏢 Fornecedor de Campanha'}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{modalConta.row.nome}</h2>
                <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  {fmtDoc(modalConta.row.documento)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalConta(null)}
                aria-label="Fechar modal"
                className="rounded-xl border p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Subtítulo: Posição no Ranking */}
            <div className="mb-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-between">
              <span>
                Candidato analisado: <strong>{c.nome}</strong> ({c.partido})
              </span>
              <span className="rounded-md bg-white px-2 py-0.5 font-bold shadow-xs dark:bg-slate-700">
                {modalConta.posicao}º no ranking
              </span>
            </div>

            {/* Painel de Métricas e Relação de Valores com a Receita */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Relação Financeira e Participação Orçamentária
              </h3>

              {ehDoador ? (
                /* Bloco do Doador */
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl border p-2.5 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Valor do Aporte</span>
                      <strong className="text-base text-emerald-600 dark:text-emerald-400 font-bold">
                        {brl(valorItem)}
                      </strong>
                    </div>
                    <div className="rounded-xl border p-2.5 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Receita Total</span>
                      <strong className="text-base text-slate-800 dark:text-slate-200 font-bold">
                        {brl(recTotal)}
                      </strong>
                    </div>
                    <div className="col-span-2 sm:col-span-1 rounded-xl border border-emerald-300 bg-emerald-50/60 p-2.5 dark:border-emerald-800 dark:bg-emerald-950/40">
                      <span className="text-[11px] text-emerald-900 dark:text-emerald-300 block font-semibold">% da Receita</span>
                      <strong className="text-base text-emerald-700 dark:text-emerald-300 font-bold">
                        {percSobreReceita.toFixed(2)}%
                      </strong>
                    </div>
                  </div>

                  {/* Barra de Progresso Visual da Receita */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-400">
                      <span>Fatia deste doador no total da arrecadação:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{percSobreReceita.toFixed(2)}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(1, percSobreReceita))}%` }}
                      />
                    </div>
                  </div>

                  {/* Explicação Didática */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs leading-relaxed text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                    <p className="font-semibold text-sm mb-1">📊 Interpretação da Arrecadação:</p>
                    <p>
                      Esta instituição repassou <strong>{brl(valorItem)}</strong>, o que representa{' '}
                      <strong>{percSobreReceita.toFixed(2)}% de todos os recursos arrecadados</strong> ({brl(recTotal)}) pela campanha de{' '}
                      <strong>{c.nome}</strong>.
                    </p>
                    {percSobreReceita >= 50 && (
                      <p className="mt-2 font-semibold text-amber-800 dark:text-amber-300">
                        ⚠️ <strong>Concentração Crítica:</strong> Mais da metade de toda a receita da campanha provém desta única fonte financiadora.
                      </p>
                    )}
                    {percSobreReceita >= 15 && percSobreReceita < 50 && (
                      <p className="mt-2 text-emerald-900 dark:text-emerald-300">
                        ℹ️ <strong>Financiador Estratégico:</strong> Representa uma fatia de alto impacto para a sustentação financeira do candidato.
                      </p>
                    )}
                    {percSobreReceita < 15 && (
                      <p className="mt-2 text-slate-600 dark:text-slate-400">
                        ℹ️ <strong>Financiamento Pulverizado:</strong> Aporte diluído entre as demais fontes de receita da candidatura.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* Bloco do Fornecedor (Gastos) */
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="rounded-xl border p-2.5 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Valor Pago</span>
                      <strong className="text-base text-blue-600 dark:text-blue-400 font-bold">
                        {brl(valorItem)}
                      </strong>
                    </div>
                    <div className="rounded-xl border p-2.5 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Despesas</span>
                      <strong className="text-base text-slate-800 dark:text-slate-200 font-bold">
                        {brl(despTotal)}
                      </strong>
                    </div>
                    <div className="rounded-xl border border-blue-300 bg-blue-50/60 p-2.5 dark:border-blue-800 dark:bg-blue-950/40">
                      <span className="text-[11px] text-blue-900 dark:text-blue-300 block font-semibold">% das Despesas</span>
                      <strong className="text-base text-blue-700 dark:text-blue-300 font-bold">
                        {percSobreDespesa.toFixed(2)}%
                      </strong>
                    </div>
                    <div className="rounded-xl border border-purple-300 bg-purple-50/60 p-2.5 dark:border-purple-800 dark:bg-purple-950/40">
                      <span className="text-[11px] text-purple-900 dark:text-purple-300 block font-semibold">% da Receita</span>
                      <strong className="text-base text-purple-700 dark:text-purple-300 font-bold">
                        {percSobreReceita.toFixed(2)}%
                      </strong>
                    </div>
                  </div>

                  {/* Barras de Relação Dupla: Despesa e Receita */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-400">
                        <span>Impacto sobre o Total de Gastos:</span>
                        <span className="font-bold text-blue-700 dark:text-blue-400">{percSobreDespesa.toFixed(2)}%</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(1, percSobreDespesa))}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-400">
                        <span>Comprometimento da Receita Total Arrecadada:</span>
                        <span className="font-bold text-purple-700 dark:text-purple-400">{percSobreReceita.toFixed(2)}%</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(1, percSobreReceita))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Explicação Didática */}
                  <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-3 text-xs leading-relaxed text-blue-950 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200">
                    <p className="font-semibold text-sm mb-1">📊 Interpretação Orçamentária e de Despesas:</p>
                    <p>
                      Este contrato de <strong>{brl(valorItem)}</strong> absorveu{' '}
                      <strong>{percSobreDespesa.toFixed(2)}% de todas as despesas contratadas</strong> ({brl(despTotal)}).
                    </p>
                    <p className="mt-1">
                      Em combinação com a <strong>receita total arrecadada</strong> ({brl(recTotal)}), este único fornecedor consumiu{' '}
                      <strong>{percSobreReceita.toFixed(2)}% de todo o orçamento disponível</strong> para a campanha de{' '}
                      <strong>{c.nome}</strong>.
                    </p>
                    {percSobreReceita >= 25 && (
                      <p className="mt-2 font-semibold text-amber-800 dark:text-amber-300">
                        ⚠️ <strong>Concentração Orçamentária:</strong> Contrato de grande magnitude, absorvendo mais de um quarto de toda a receita da campanha.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Seção de Cruzamento com Outras Candidaturas (Controle dos Dados) */}
            <div className="mt-5 border-t pt-4 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Cruzamento e Controle com Outras Campanhas
              </h3>

              {!modalConta.row.documento ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  Documento (CNPJ/CPF) não especificado no registro oficial desta fonte. O cruzamento consolidado entre múltiplas candidaturas depende de documento fiscal formalizado.
                </div>
              ) : modalConta.carregando ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-2">Consultando dados consolidados de outras campanhas…</p>
              ) : (
                <ControleDadosCruzamento atual={modalConta} slug={slug} />
              )}
            </div>

            {/* Rodapé da Modal */}
            <div className="mt-5 border-t pt-3 flex items-center justify-between text-[11px] text-slate-400 dark:border-slate-800">
              <span>Fonte: DivulgaCandContas / TSE via G1</span>
              <button
                type="button"
                onClick={() => setModalConta(null)}
                className="rounded-lg bg-slate-100 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
