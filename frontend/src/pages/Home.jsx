import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import CandidateCard from '../components/CandidateCard.jsx';
import CandidateCardSkeleton from '../components/CandidateCardSkeleton.jsx';
import StatsSkeleton from '../components/StatsSkeleton.jsx';
import ExportButton from '../components/ExportButton.jsx';
import UfSelector from '../components/UfSelector.jsx';
import { UFS, UFS_DATA, BANCADAS_FEDERAIS, api, fotoUrl } from '../lib/api.js';
import { clientCache } from '../lib/clientCache.js';

const COLUNAS_EXPORT_CANDIDATOS = [
  { key: 'nome', label: 'Nome Completo' },
  { key: 'nome_urna', label: 'Nome na Urna' },
  { key: 'numero', label: 'Número na Urna' },
  { key: 'partido', label: 'Partido' },
  { key: 'cargo', label: 'Cargo' },
  { key: 'uf', label: 'UF' },
  { key: 'situacao', label: 'Situação' },
  { key: 'ocupacao', label: 'Ocupação' },
  { key: 'grau_instrucao', label: 'Grau de Instrução' },
  { key: 'cor_etnia', label: 'Cor / Raça' },
  { key: 'genero', label: 'Gênero' },
  { key: 'patrimonio_total', label: 'Patrimônio Total Declarado (R$)', formatter: (v) => Number(v || 0).toFixed(2) },
  { key: 'receitas_total', label: 'Receitas Totais Arrecadadas (R$)', formatter: (v) => Number(v || 0).toFixed(2) },
  { key: 'despesas_total', label: 'Despesas Totais Contratadas (R$)', formatter: (v) => Number(v || 0).toFixed(2) },
];

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

  // Estados de Paginação e Rolagem Infinita (Infinite Scroll)
  const [pagina, setPagina] = useState(1);
  const [temMais, setTemMais] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [totalGeral, setTotalGeral] = useState(0);
  const sentinelaRef = useRef(null);

  const busca = sp.get('busca') ?? '';
  const partido = sp.get('partido') ?? '';
  const ordenar = sp.get('ordenar') ?? 'nome';
  const instrucao = sp.get('instrucao') ?? '';
  const cor = sp.get('cor') ?? '';
  const profissao = sp.get('profissao') ?? '';
  const patMin = sp.get('patrimonio_min') ?? '';
  const patMax = sp.get('patrimonio_max') ?? '';
  const uf = cargo === 'presidente' ? '' : sp.get('uf') ?? '';
  const regiao = cargo === 'presidente' ? '' : sp.get('regiao') ?? '';
  const precisaUf = cargo !== 'presidente';

  useEffect(() => {
    const paramsRegiaoUf = {
      ...(uf ? { uf } : {}),
      ...(!uf && regiao && regiao !== 'Todas' ? { regiao } : {}),
    };

    const cacheKey = `home_${cargo}_${JSON.stringify({ busca, partido, ordenar, instrucao, cor, profissao, uf, regiao, patMin, patMax })}`;
    const cached = clientCache.get(cacheKey);

    if (cached) {
      // 1. Renderiza instantaneamente do cache em 0ms!
      setLista(cached.lista);
      setStats(cached.stats);
      setTemMais(Boolean(cached.meta?.tem_proxima));
      setTotalGeral(cached.meta?.total_registros ?? cached.lista.length);
      setLoading(false);
      setErro(null);
    } else {
      setLoading(true);
      setErro(null);
    }

    setPagina(1);

    // 2. Revalidação silenciosa em background (SWR) com envelope de paginação
    Promise.all([
      api.candidatos(cargo, {
        busca, partido, ordenar, instrucao, cor, profissao,
        ...paramsRegiaoUf,
        ...(patMin ? { patrimonio_min: patMin } : {}),
        ...(patMax ? { patrimonio_max: patMax } : {}),
        page: 1,
        limite: 30,
        envelope: 1,
      }),
      api.estatisticas(cargo, paramsRegiaoUf),
    ])
      .then(([l, s]) => {
        const itens = l?.dados || (Array.isArray(l) ? l : []);
        const meta = l?.paginacao || {};
        setLista(itens);
        setStats(s);
        setTemMais(Boolean(meta.tem_proxima));
        setTotalGeral(meta.total_registros ?? itens.length);
        clientCache.set(cacheKey, { lista: itens, stats: s, meta });
      })
      .catch((e) => {
        if (!cached) setErro(e.message);
      })
      .finally(() => setLoading(false));
  }, [cargo, busca, partido, ordenar, instrucao, cor, profissao, patMin, patMax, uf, regiao]);

  const carregarProximaPagina = useCallback(() => {
    if (loading || carregandoMais || !temMais) return;
    setCarregandoMais(true);
    const proxima = pagina + 1;
    const paramsRegiaoUf = {
      ...(uf ? { uf } : {}),
      ...(!uf && regiao && regiao !== 'Todas' ? { regiao } : {}),
    };

    api.candidatos(cargo, {
      busca, partido, ordenar, instrucao, cor, profissao,
      ...paramsRegiaoUf,
      ...(patMin ? { patrimonio_min: patMin } : {}),
      ...(patMax ? { patrimonio_max: patMax } : {}),
      page: proxima,
      limite: 30,
      envelope: 1,
    })
      .then((res) => {
        const novos = res?.dados || (Array.isArray(res) ? res : []);
        const meta = res?.paginacao || {};
        setLista((prev) => [...prev, ...novos]);
        setPagina(proxima);
        setTemMais(Boolean(meta.tem_proxima));
        if (meta.total_registros) setTotalGeral(meta.total_registros);
      })
      .catch((err) => console.error('Erro ao carregar mais candidatos:', err))
      .finally(() => setCarregandoMais(false));
  }, [cargo, busca, partido, ordenar, instrucao, cor, profissao, patMin, patMax, uf, regiao, pagina, loading, carregandoMais, temMais]);

  useEffect(() => {
    if (!sentinelaRef.current || !temMais || loading || carregandoMais) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          carregarProximaPagina();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(sentinelaRef.current);
    return () => observer.disconnect();
  }, [carregarProximaPagina, temMais, loading, carregandoMais]);

  const upd = (k, v) => {
    const n = new URLSearchParams(sp);
    if (v) n.set(k, v);
    else n.delete(k);
    setSp(n);
  };
  const limpar = () => setSp({});


  const partidos = stats ? Object.keys(stats.por_partido).sort() : [];
  const instrucoes = stats ? Object.keys(stats.por_instrucao).filter((v) => v !== '—').sort() : [];
  const cores = stats ? Object.keys(stats.por_cor).filter((v) => v !== '—').sort() : [];
  const profissoes = stats ? Object.keys(stats.por_profissao).filter((v) => v !== '—').sort() : [];
  const filtrosAtivos = [busca, partido, instrucao, cor, profissao, patMin, patMax, uf, regiao && regiao !== 'Todas' ? regiao : ''].filter(Boolean).length;
  const [filtrosAbertos, setFiltrosAbertos] = useState(filtrosAtivos > 0); // recolhido por padrão

  const totalEm = (obj, sujeito = 'candidaturas', unidade = 'grupos') => {
    const d = donut(obj).filter((g) => g.name !== '—');
    return `${stats?.total ?? 0} ${sujeito} em ${d.length} ${unidade}`;
  };

  const campo = 'w-full rounded-lg border bg-white px-3 py-2 text-base dark:border-slate-700 dark:bg-slate-900';

  // Trios em destaque no botão comparar por cargo:
  // Presidente: Cury, Flávio Bolsonaro, Lula
  // Governador: Juliana Brizola, Zucco, Gabriel Souza (Rio Grande do Sul)
  const DESTAQUES_PRESIDENTE = ['escritor-augusto-cury', 'flavio-bolsonaro', 'lula'];
  const DESTAQUES_GOVERNADOR_RS = ['210002551508', '210002547857', '210002542892'];

  const trioComparar = (() => {
    if (cargo === 'presidente') {
      const achados = DESTAQUES_PRESIDENTE.map((s) => lista.find((c) => c.slug === s)).filter(Boolean);
      return achados.length >= 2 ? achados : lista.slice(0, 3);
    }
    if (cargo === 'governador') {
      // Prioriza os candidatos do Rio Grande do Sul (RS) solicitados: Juliana, Zucco e Gabriel
      if (!uf || uf === 'RS') {
        const achadosRS = DESTAQUES_GOVERNADOR_RS.map((s) => lista.find((c) => c.slug === s)).filter(Boolean);
        if (achadosRS.length >= 2) return achadosRS;
      }
      return lista.slice(0, 3);
    }
    return lista.slice(0, 3);
  })();

  const TETO_PATRIMONIO = 500_000_000;
  const fmtFaixa = (v) => {
    const n = Number(v);
    if (!v || !Number.isFinite(n) || n <= 0) return 'R$ 0';
    if (n >= 1_000_000) {
      const m = n / 1_000_000;
      return `R$ ${m.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ${m === 1 ? 'milhão' : 'milhões'}`;
    }
    if (n >= 1_000) return `R$ ${(n / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} mil`;
    return `R$ ${n.toLocaleString('pt-BR')}`;
  };
  const setFaixa = (qual, v) => {
    const n = v === '' ? '' : String(Math.max(0, Math.min(TETO_PATRIMONIO, Number(v) || 0)));
    if (qual === 'min' && patMax !== '' && n !== '' && Number(n) > Number(patMax)) {
      upd('patrimonio_max', n);
    }
    if (qual === 'max' && patMin !== '' && n !== '' && Number(n) < Number(patMin)) {
      upd('patrimonio_min', n);
    }
    upd(qual === 'min' ? 'patrimonio_min' : 'patrimonio_max', n);
  };

  const ufNome = uf ? UFS_DATA[uf]?.nome : null;

  return (
    <div className="space-y-5">
      {precisaUf && (
        <UfSelector
          ufSelecionada={uf}
          onSelectUf={(novaUf) => upd('uf', novaUf)}
          regiaoSelecionada={regiao}
          onSelectRegiao={(novaRegiao) => {
            const n = new URLSearchParams(sp);
            if (novaRegiao && novaRegiao !== 'Todas') {
              n.set('regiao', novaRegiao);
            } else {
              n.delete('regiao');
            }
            if (uf && novaRegiao && novaRegiao !== 'Todas' && UFS_DATA[uf]?.regiao !== novaRegiao) {
              n.delete('uf');
            } else if (novaRegiao === 'Todas') {
              n.delete('uf');
            }
            setSp(n);
          }}
          cargo={cargo}
        />
      )}

      {cargo === 'senador' && (
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50/60 to-white p-4 text-emerald-950 shadow-xs dark:border-emerald-900/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 dark:text-emerald-200">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-2xs">
              🏛️
            </span>
            <div className="space-y-1">
              <h2 className="font-bold text-sm sm:text-base flex items-center flex-wrap gap-2">
                <span>Eleições 2026: Renovação de 2/3 do Senado Federal (54 Vagas)</span>
                <span className="rounded-full bg-emerald-200/80 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-900 dark:bg-emerald-900/80 dark:text-emerald-200">
                  2 Votos por Eleitor
                </span>
              </h2>
              <p className="text-xs text-emerald-900/85 dark:text-emerald-300/90 leading-relaxed">
                Neste pleito, cada estado e o DF elegem <strong>dois senadores</strong> para um mandato de 8 anos (2027–2035). Na urna eletrônica, você votará em dois candidatos diferentes com números de <strong>3 dígitos</strong>. Cada titular concorre vinculado a uma <strong>dupla de suplentes (1º e 2º)</strong> que assume o mandato em caso de licença ou vacância.
              </p>
            </div>
          </div>
        </div>
      )}

      {cargo === 'dep-federal' && (
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50/60 to-white p-4 text-blue-950 shadow-xs dark:border-blue-900/60 dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900 dark:text-blue-200">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-2xs">
              👥
            </span>
            <div className="space-y-1">
              <h2 className="font-bold text-sm sm:text-base flex items-center flex-wrap gap-2">
                <span>Eleições 2026: Câmara dos Deputados (513 Cadeiras)</span>
                <span className="rounded-full bg-blue-200/80 px-2.5 py-0.5 text-[11px] font-extrabold text-blue-900 dark:bg-blue-900/80 dark:text-blue-200">
                  Sistema Proporcional de Lista Aberta
                </span>
                {uf && BANCADAS_FEDERAIS[uf] && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Bancada de {uf}: {BANCADAS_FEDERAIS[uf]} vagas
                  </span>
                )}
              </h2>
              <p className="text-xs text-blue-900/85 dark:text-blue-300/90 leading-relaxed">
                Os deputados federais representam o povo brasileiro em Brasília. As bancadas estaduais variam de <strong>8 a 70 cadeiras</strong> conforme o tamanho da população (Art. 45 da Constituição). Na urna eletrônica, você vota com <strong>4 dígitos</strong> no candidato ou com <strong>2 dígitos</strong> na legenda do partido. As vagas são distribuídas pelo Quociente Eleitoral (QE) e Quociente Partidário (QP).
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center flex-wrap gap-2">
            <span>Candidatos · <span className="uppercase">{cargo}</span></span>
            {uf ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
                · {ufNome} ({uf})
              </span>
            ) : regiao && regiao !== 'Todas' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
                · Região {regiao}
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400 font-normal text-lg">
                · Brasil (27 UFs)
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {stats
              ? `${lista.length} de ${stats.total} candidaturas${
                  uf ? ` no ${uf}` : regiao && regiao !== 'Todas' ? ` na Região ${regiao}` : ' no Brasil'
                }`
              : 'carregando…'}{' '}
            · clique num card para ver o perfil completo
          </p>
        </div>
        <ExportButton
          filename={`candidatos_${cargo}_${uf || (regiao && regiao !== 'Todas' ? `regiao_${regiao.toLowerCase()}` : 'brasil')}_eleicoes2026`}
          columns={COLUNAS_EXPORT_CANDIDATOS}
          data={lista}
          label={`Exportar Candidatos${uf ? ` (${uf})` : regiao && regiao !== 'Todas' ? ` (${regiao})` : ''}`}
        />
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          Falha na API ({erro}). Verifique se o backend está rodando e `VITE_API_URL` no `.env`.
        </p>
      )}

      {loading && !stats ? (
        <StatsSkeleton />
      ) : stats && stats.total > 0 ? (
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-sm font-semibold">Por partido</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{stats && totalEm(stats.por_partido, 'candidaturas', 'partidos')}</p>
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
            <p className="text-xs text-slate-500 dark:text-slate-400">{stats && totalEm(stats.por_instrucao, 'candidaturas', 'níveis de ensino')}</p>
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
            <p className="text-xs text-slate-500 dark:text-slate-400">{stats && totalEm(stats.por_cor, 'candidatos', 'etnias')}</p>
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
      ) : null}

      <section aria-label="Filtros de candidatos" className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/60 p-4 dark:border-emerald-700 dark:bg-emerald-950/40 sm:p-5">
        <button
          type="button"
          onClick={() => setFiltrosAbertos((v) => !v)}
          aria-expanded={filtrosAbertos}
          className="flex w-full flex-wrap items-center gap-2 text-left"
        >
          <svg viewBox="0 0 20 20" className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="9" cy="9" r="6" />
            <line x1="13.5" y1="13.5" x2="18" y2="18" strokeLinecap="round" />
          </svg>
          <h2 className="text-lg font-bold">Filtrar candidatos</h2>
          {filtrosAtivos > 0 && (
            <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white">
              {filtrosAtivos} {filtrosAtivos === 1 ? 'filtro ativo' : 'filtros ativos'}
            </span>
          )}
          <svg viewBox="0 0 16 16" className={`ml-auto h-5 w-5 transition-transform ${filtrosAbertos ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M3 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div hidden={!filtrosAbertos}>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {filtrosAtivos > 0 && (
            <button type="button" onClick={limpar} className="ml-auto rounded-lg border bg-white px-3 py-1.5 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
              Limpar filtros
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Use os campos abaixo para encontrar candidatos: digite um nome, escolha o partido ou
          informe uma faixa de patrimônio (valor total dos bens declarados, em R$).
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-base font-semibold">Buscar</span>
            <input value={busca} onChange={(e) => upd('busca', e.target.value)} placeholder="Nome ou número…" className={campo} />
            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Ex.: “Lula” ou “13”</span>
          </label>
          {precisaUf && (
            <label className="block">
              <span className="mb-1 block text-base font-semibold">Estado (UF)</span>
              <select value={uf} onChange={(e) => upd('uf', e.target.value)} className={campo}>
                <option value="">Todas UFs</option>
                {UFS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Onde o candidato concorre</span>
            </label>
          )}
          <label className="block">
            <span className="mb-1 block text-base font-semibold">Partido</span>
            <select value={partido} onChange={(e) => upd('partido', e.target.value)} className={campo}>
              <option value="">Todos partidos</option>
              {partidos.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Sigla da legenda</span>
          </label>
          <label className="block">
            <span className="mb-1 block text-base font-semibold">Profissão</span>
            <select value={profissao} onChange={(e) => upd('profissao', e.target.value)} className={campo}>
              <option value="">Todas profissões</option>
              {profissoes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Ocupação declarada ao TSE</span>
          </label>
          <label className="block">
            <span className="mb-1 block text-base font-semibold">Instrução</span>
            <select value={instrucao} onChange={(e) => upd('instrucao', e.target.value)} className={campo}>
              <option value="">Todas</option>
              {instrucoes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Grau de instrução declarado</span>
          </label>
          <label className="block">
            <span className="mb-1 block text-base font-semibold">Cor/etnia</span>
            <select value={cor} onChange={(e) => upd('cor', e.target.value)} className={campo}>
              <option value="">Todas</option>
              {cores.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Autodeclaração do candidato</span>
          </label>
          <div className="block sm:col-span-2">
            <span className="mb-1 block text-base font-semibold">Patrimônio (R$)</span>
            <div className="space-y-2 rounded-lg border bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
              <label className="block">
                <span className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Mínimo:</span>
                  <strong>{fmtFaixa(patMin)}</strong>
                </span>
                <input
                  type="range" min="0" max={TETO_PATRIMONIO} step="100000"
                  value={patMin === '' ? 0 : Number(patMin)}
                  onChange={(e) => setFaixa('min', e.target.value)}
                  className="h-8 w-full cursor-pointer accent-emerald-600"
                  aria-label="Patrimônio mínimo em reais"
                />
              </label>
              <label className="block">
                <span className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Máximo:</span>
                  <strong>{patMax === '' ? 'Sem limite' : fmtFaixa(patMax)}</strong>
                </span>
                <input
                  type="range" min="0" max={TETO_PATRIMONIO} step="100000"
                  value={patMax === '' ? TETO_PATRIMONIO : Number(patMax)}
                  onChange={(e) => setFaixa('max', e.target.value)}
                  className="h-8 w-full cursor-pointer accent-emerald-600"
                  aria-label="Patrimônio máximo em reais"
                />
              </label>
              <div className="flex items-baseline justify-between border-t pt-1.5 text-sm dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">R$ 0</span>
                <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">R$ 500 milhões</span>
              </div>
            </div>
            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Arraste para definir a faixa do valor total dos bens. Candidatos sem valor declarado ficam de fora enquanto este filtro estiver ativo.</span>
          </div>
          <label className="block">
            <span className="mb-1 block text-base font-semibold">Ordem da lista</span>
            <select value={ordenar} onChange={(e) => upd('ordenar', e.target.value)} className={campo}>
              <option value="nome">Alfabética (A–Z)</option>
              <option value="numero">Número na urna</option>
              <option value="patrimonio_desc">Maior patrimônio</option>
              <option value="patrimonio_asc">Menor patrimônio</option>
            </select>
            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Como os cards aparecem</span>
          </label>
        </div>
        </div>
      </section>

      {loading && lista.length === 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <span className="text-sm font-medium text-emerald-900 dark:text-emerald-200">
              Carregando candidaturas homologadas pelo TSE... Por favor, aguarde.
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <CandidateCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : !loading && !erro && lista.length === 0 ? (
        <p className="rounded-xl border bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Nenhuma candidatura para <strong>{cargo}</strong> ainda — rode a coleta do scraper para este cargo.
          {cargo !== 'presidente' && ' No MVP, só presidente possui dados.'}
        </p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((c) => (
              <CandidateCard key={c.id || `${c.uf}-${c.slug}`} c={c} cargo={cargo} />
            ))}
          </div>

          {lista.length > 0 && (
            <div ref={sentinelaRef} className="mt-8 flex flex-col items-center justify-center gap-3 py-4">
              {carregandoMais && (
                <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <svg className="h-4 w-4 animate-spin text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Carregando mais candidatos...</span>
                </div>
              )}
              {!carregandoMais && temMais && (
                <button
                  type="button"
                  onClick={carregarProximaPagina}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <span>Carregar mais candidatos (+30)</span>
                  <span className="text-xs text-slate-400">({lista.length.toLocaleString('pt-BR')} de {totalGeral.toLocaleString('pt-BR')})</span>
                </button>
              )}
              {!temMais && totalGeral > 0 && (
                <div className="rounded-full bg-slate-100 px-4 py-1.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  ✓ Você visualizou todas as {totalGeral.toLocaleString('pt-BR')} candidaturas disponíveis
                </div>
              )}
            </div>
          )}
        </>
      )}

      {trioComparar.length >= 2 && (
        <Link
          to={`/${cargo}/comparar?${
            trioComparar[0]?.uf && cargo !== 'presidente' ? `uf=${trioComparar[0].uf}&` : ''
          }${trioComparar.map((c, i) => `${['a', 'b', 'c'][i]}=${c.slug}`).join('&')}`}
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-base text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <span className="flex -space-x-3">
            {trioComparar.map((c, i) =>
              fotoUrl(c) ? (
                <img key={c.id || `${c.uf}-${c.slug}`} src={fotoUrl(c)} alt="" aria-hidden="true" style={{ zIndex: trioComparar.length - i }} className="relative h-9 w-9 rounded-full border-2 border-white object-cover dark:border-slate-900" loading="lazy" />
              ) : (
                <span key={c.id || `${c.uf}-${c.slug}`} aria-hidden="true" style={{ zIndex: trioComparar.length - i }} className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-500 text-sm font-bold text-white dark:border-slate-900">
                  {(c.nome || '?')[0]}
                </span>
              )
            )}
          </span>
          <span>
            Comparar {trioComparar.map((c) => c.nome).join(', ')} →
          </span>
        </Link>
      )}
    </div>
  );
}
