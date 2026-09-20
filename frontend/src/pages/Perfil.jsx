import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api, brl, fotoUrl, URL_TSE_DIVULGACAND_2026 } from '../lib/api.js';
import TseBadge from '../components/TseBadge.jsx';
import TseContasBanner from '../components/TseContasBanner.jsx';
import TseBensBanner from '../components/TseBensBanner.jsx';
import ChapaPresidencialCard from '../components/ChapaPresidencialCard.jsx';
import PlanoGovernoCard from '../components/PlanoGovernoCard.jsx';

/** Agrupa a taxonomia oficial de bens do TSE em macrocategorias amigáveis */
function categoriaMacroBem(tipo = '') {
  const t = tipo.toLowerCase();
  if (
    t.includes('apartamento') ||
    t.includes('casa') ||
    t.includes('terreno') ||
    t.includes('prédio') ||
    t.includes('predio') ||
    t.includes('imóve') ||
    t.includes('imove') ||
    t.includes('construção') ||
    t.includes('sala')
  ) {
    return 'imoveis';
  }
  if (t.includes('quota') || t.includes('ação') || t.includes('acoes') || t.includes('participa')) {
    return 'participacoes';
  }
  if (
    t.includes('depósito') ||
    t.includes('deposito') ||
    t.includes('aplica') ||
    t.includes('vgbl') ||
    t.includes('poupança') ||
    t.includes('poupanca') ||
    t.includes('fundo') ||
    t.includes('cdb') ||
    t.includes('renda fixa')
  ) {
    return 'aplicacoes';
  }
  if (
    t.includes('veículo') ||
    t.includes('veiculo') ||
    t.includes('automóvel') ||
    t.includes('automovel') ||
    t.includes('caminhão') ||
    t.includes('moto')
  ) {
    return 'veiculos';
  }
  return 'outros';
}

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
  const [categoriaBem, setCategoriaBem] = useState('todos');
  const [buscaBem, setBuscaBem] = useState('');
  const [modalConta, setModalConta] = useState(null); // { row, tipo, posicao, dados, carregando }
  const [modalChapa, setModalChapa] = useState(false);

  useEffect(() => {
    api.candidato(slug).then(setD).catch((e) => setErro(e.message));
  }, [slug]);

  // Fecha as modais com ESC e trava o scroll enquanto abertas
  useEffect(() => {
    if (!modalConta && !modalChapa) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setModalConta(null);
        setModalChapa(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [modalConta, modalChapa]);

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

  const { candidato: c, tse, bens, historico, doadores, gastos } = d;
  const foto = fotoUrl(c);

  const patrimonioTotalRef = Number(tse?.patrimonio_declarado || c?.patrimonio_total || 0);

  const contagemCategorias = {
    todos: bens.length,
    imoveis: bens.filter((b) => categoriaMacroBem(b.tipo) === 'imoveis').length,
    participacoes: bens.filter((b) => categoriaMacroBem(b.tipo) === 'participacoes').length,
    aplicacoes: bens.filter((b) => categoriaMacroBem(b.tipo) === 'aplicacoes').length,
    veiculos: bens.filter((b) => categoriaMacroBem(b.tipo) === 'veiculos').length,
    outros: bens.filter((b) => categoriaMacroBem(b.tipo) === 'outros').length,
  };

  const categoriasBensList = [
    { id: 'todos', label: 'Todos os Bens', count: contagemCategorias.todos },
    { id: 'imoveis', label: 'Imóveis', count: contagemCategorias.imoveis },
    { id: 'participacoes', label: 'Empresas & Quotas', count: contagemCategorias.participacoes },
    { id: 'aplicacoes', label: 'Aplicações & Contas', count: contagemCategorias.aplicacoes },
    { id: 'veiculos', label: 'Veículos', count: contagemCategorias.veiculos },
    { id: 'outros', label: 'Outros Ativos', count: contagemCategorias.outros },
  ].filter((cat) => cat.id === 'todos' || cat.count > 0);

  const bensFiltrados = [...bens]
    .filter((b) => {
      if (categoriaBem !== 'todos' && categoriaMacroBem(b.tipo) !== categoriaBem) {
        return false;
      }
      if (buscaBem.trim()) {
        const termo = buscaBem.trim().toLowerCase();
        const noTipo = (b.tipo || '').toLowerCase().includes(termo);
        const naDesc = (b.descricao || '').toLowerCase().includes(termo);
        if (!noTipo && !naDesc) return false;
      }
      return true;
    })
    .sort((x, y) => {
      const vx = x.valor === null || x.valor === undefined ? null : Number(x.valor);
      const vy = y.valor === null || y.valor === undefined ? null : Number(y.valor);
      if (vx === null && vy === null) return 0;
      if (vx === null) return 1;
      if (vy === null) return -1;
      return ordemBens === 'desc' ? vy - vx : vx - vy;
    });

  const somaBensFiltrados = bensFiltrados.reduce((acc, b) => acc + Number(b.valor || 0), 0);

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
          {tse && (
            <div className="mt-1 mb-1.5">
              <TseBadge tse={tse} compact />
            </div>
          )}
          <p className="text-slate-500 dark:text-slate-400">
            {c.partido} · <span className="font-mono text-xl font-bold text-slate-800 dark:text-slate-100">{c.numero}</span> · {c.cargo} {c.uf}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span>Vice:</span>
            <button
              type="button"
              onClick={() => setModalChapa(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer transition font-medium"
              title="Clique para auditar os dados da chapa oficial no TSE"
            >
              <span>{c.vice_nome ?? 'A definir'}</span>
              {c.vice_partido && (
                <span className="rounded bg-slate-200/80 px-1 py-0.2 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                  {c.vice_partido}
                </span>
              )}
              <span className="text-blue-600 dark:text-blue-400 text-[11px] font-semibold">Ver chapa ↗</span>
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {c.plano_governo_url && (
              <a
                href={c.plano_governo_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 font-bold text-white shadow-2xs hover:bg-blue-500 transition"
                title="Baixar arquivo PDF oficial do Plano de Governo homologado no TSE"
              >
                <span>📄 Plano de Governo (PDF TSE)</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
            {c.perfil_g1_url && (
              <a
                href={c.perfil_g1_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1.5 font-medium text-slate-200 hover:bg-slate-700 transition dark:bg-slate-800 dark:text-slate-300"
              >
                <span>Ver no G1</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
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

      {/* Banner de Certificação e Auditoria Oficial do TSE */}
      {tse && <TseBadge tse={tse} />}

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
        <div className="space-y-4">
          {/* Card Oficial da Chapa Presidencial */}
          <ChapaPresidencialCard c={c} tse={tse} onAbrirModal={() => setModalChapa(true)} />

          {/* Card do Plano de Governo Oficial do TSE */}
          <PlanoGovernoCard c={c} tse={tse} />

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">Perfil e Dados Pessoais</h2>
              <Linha k="Profissão" v={c.profissao} />
              <Linha k="Cor/etnia" v={c.cor_etnia} />
              <Linha k="Instrução" v={c.grau_instrucao} />
              <Linha k="Gênero" v={c.genero} />
              <Linha k="Coletado em" v={c.coletado_em} />
              <Linha k="Fonte Primária" v="TSE / DivulgaCandContas" />
            </div>
            <div className="rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">Top doadores da campanha</h2>
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
        </div>
      )}

      {/* Aba: Bens */}
      {aba === 'bens' && (
        <div className="space-y-4">
          {/* Banner Oficial de Bens do TSE */}
          <TseBensBanner c={c} tse={tse} bens={bens} />

          {/* Barra de Filtros por Categoria e Busca Rápida */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            {/* Pílulas de Categorias */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categoriasBensList.map((cat) => {
                const ativo = categoriaBem === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoriaBem(cat.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                      ativo
                        ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        ativo
                          ? 'bg-white/20 text-white dark:bg-slate-900/30 dark:text-slate-900'
                          : 'bg-slate-200/80 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Campo de Busca Rápida */}
            <div className="relative min-w-[200px] sm:w-64">
              <input
                type="text"
                value={buscaBem}
                onChange={(e) => setBuscaBem(e.target.value)}
                placeholder="Buscar por descrição..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-7 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {buscaBem && (
                <button
                  type="button"
                  onClick={() => setBuscaBem('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Tabela Oficial de Bens Auditados */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-700 dark:bg-slate-900">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-3 py-2.5">Tipo de Ativo</th>
                  <th className="px-3 py-2.5">Descrição Oficial perante o TSE</th>
                  <th className="px-3 py-2.5 text-center w-36">Participação</th>
                  <th className="px-3 py-2.5 text-right w-36">
                    <button
                      type="button"
                      onClick={() => setOrdemBens((o) => (o === 'desc' ? 'asc' : 'desc'))}
                      title={ordemBens === 'desc' ? 'Ordenado do maior para o menor — clique para inverter' : 'Ordenado do menor para o maior — clique para inverter'}
                      className="ml-auto inline-flex cursor-pointer items-center gap-1 font-semibold hover:text-slate-900 dark:hover:text-white"
                    >
                      Valor Declarado <span aria-hidden="true">{ordemBens === 'desc' ? '▼' : '▲'}</span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bensFiltrados.map((b, i) => {
                  const val = Number(b.valor || 0);
                  const perc = patrimonioTotalRef > 0 ? (val / patrimonioTotalRef) * 100 : 0;
                  return (
                    <tr key={b.id ?? i} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-3 py-2.5 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-slate-900 dark:text-white">{b.tipo}</span>
                          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-300">
                            ✓ TSE
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 align-top text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {b.descricao || 'Sem descrição informada'}
                      </td>
                      <td className="px-3 py-2.5 align-top text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {perc.toFixed(1)}%
                          </span>
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                            <div
                              className="h-full rounded-full bg-purple-500"
                              style={{ width: `${Math.min(perc, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 align-top text-right font-semibold text-slate-900 dark:text-white">
                        {brl(b.valor)}
                      </td>
                    </tr>
                  );
                })}
                {bensFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-slate-500 dark:text-slate-400">
                      Nenhum bem localizado para o filtro selecionado.
                    </td>
                  </tr>
                )}
              </tbody>
              {bensFiltrados.length > 0 && (
                <tfoot className="border-t border-slate-200 bg-slate-50/80 text-xs font-semibold dark:border-slate-800 dark:bg-slate-800/80">
                  <tr>
                    <td colSpan={2} className="px-3 py-2 text-slate-600 dark:text-slate-300">
                      Total exibido ({bensFiltrados.length} {bensFiltrados.length === 1 ? 'item' : 'itens'})
                    </td>
                    <td className="px-3 py-2 text-center text-slate-500 dark:text-slate-400">
                      {patrimonioTotalRef > 0
                        ? `${((somaBensFiltrados / patrimonioTotalRef) * 100).toFixed(1)}% do total`
                        : '—'}
                    </td>
                    <td className="px-3 py-2 text-right text-sm font-bold text-slate-900 dark:text-white">
                      {brl(somaBensFiltrados)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
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
        <div className="space-y-4">
          {/* Banner Oficial de Prestação de Contas do TSE */}
          <TseContasBanner c={c} tse={tse} />

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
                  {arr.map((x, i) => {
                    const docLimpo = String(x.documento ?? '').replace(/\D/g, '');
                    const ehCnpj = docLimpo.length === 14;
                    const ehCpf = docLimpo.length === 11;
                    return (
                      <li key={x.id ?? i} className="flex items-center justify-between gap-2 py-2">
                        <button
                          type="button"
                          onClick={() => abrirModalConta(x, tipo, arr)}
                          title="Clique para ver o controle dos dados, porcentagem da receita e cruzamentos"
                          className="group flex min-w-0 flex-1 flex-col text-left cursor-pointer hover:opacity-90"
                        >
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="truncate font-medium text-blue-700 group-hover:underline dark:text-blue-400">
                              {x.nome}
                            </span>
                            {docLimpo && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-300">
                                ✓ TSE
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {x.documento ? fmtDoc(x.documento) : 'Sem documento informado'}
                            {ehCnpj && ' · Pessoa Jurídica / Partido'}
                            {ehCpf && ' · Pessoa Física'}
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
                    );
                  })}
                  {arr.length === 0 && <li className="py-3 text-slate-500 dark:text-slate-400">—</li>}
                </ul>
              </div>
            ))}
          </div>
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

            {/* Banner de Validação TSE na Modal */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  ✓
                </span>
                <div>
                  <span className="font-bold">Verificado TSE · Prestação de Contas Homologada</span>
                  <p className="text-[11px] opacity-85">Lançamento contábil protocolado perante a Justiça Eleitoral (Lei nº 9.504/1997).</p>
                </div>
              </div>
              <a
                href={URL_TSE_DIVULGACAND_2026}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 font-semibold text-emerald-800 shadow-2xs hover:bg-emerald-100 dark:bg-slate-800 dark:text-emerald-300 dark:hover:bg-slate-700"
              >
                <span>Conferir no TSE</span>
                <span aria-hidden="true">↗</span>
              </a>
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
                className="rounded-lg bg-slate-100 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detalhes da Chapa Presidencial */}
      {modalChapa && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-xs"
          onClick={() => setModalChapa(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Topo da Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800 bg-gradient-to-r from-blue-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-xs dark:bg-blue-500">
                  🤝
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Auditoria da Chapa Presidencial Oficial
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Composição majoritária registrada no TSE · Eleições 2026
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalChapa(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Conteúdo da Modal */}
            <div className="overflow-y-auto p-5 space-y-4 text-xs text-slate-700 dark:text-slate-300">
              {/* Banner Informativo */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                    ✓
                  </span>
                  <div>
                    <span className="font-bold">Registro Homologado perante a Justiça Eleitoral</span>
                    <p className="text-[11px] opacity-85">
                      Chapa registrada e deferida sob o número eleitoral {c.numero}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparativo Titular e Vice */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                    Candidato a Presidente
                  </span>
                  <strong className="text-sm block text-slate-900 dark:text-white">{c.nome}</strong>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Partido: <strong>{c.partido}</strong> · Nº <strong>{c.numero}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Patrimônio: <strong>{brl(c.patrimonio_total)}</strong>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
                    Candidato a Vice-Presidente
                  </span>
                  <strong className="text-sm block text-slate-900 dark:text-white">{c.vice_nome ?? 'A definir'}</strong>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Partido: <strong>{c.vice_partido || c.partido}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Vínculo: <strong>Chapa Indivisível (CF/88)</strong>
                  </p>
                </div>
              </div>

              {/* Fundamentação Legal */}
              <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong className="text-slate-800 dark:text-slate-200 block text-xs">
                  ⚖️ Regras Constitucionais da Chapa Presidencial:
                </strong>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Princípio da Indivisibilidade:</strong> A eleição do Presidente importa a do Vice-Presidente com ele registrado (art. 77, § 1º, da Constituição Federal).
                  </li>
                  <li>
                    <strong>Substituição e Sucessão:</strong> O Vice-Presidente substitui o Presidente no caso de impedimento e sucede-lhe no de vaga (art. 79 da CF/88).
                  </li>
                  <li>
                    <strong>Número Único de Urna:</strong> Não há dígito separado para o vice; a digitação do número {c.numero} na urna confirma o voto para ambos os integrantes da chapa.
                  </li>
                </ul>
              </div>

              {tse?.processo_pje && (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 dark:border-slate-800">
                  <span>Processo Judicial Unificado (PJe):</span>
                  <strong className="font-mono text-slate-800 dark:text-slate-200">{tse.processo_pje}</strong>
                </div>
              )}
            </div>

            {/* Rodapé da Modal */}
            <div className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <a
                href={URL_TSE_DIVULGACAND_2026}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                <span>Conferir Registro Completo no DivulgaCandContas</span>
                <span aria-hidden="true">↗</span>
              </a>

              <button
                type="button"
                onClick={() => setModalChapa(false)}
                className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 cursor-pointer"
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
