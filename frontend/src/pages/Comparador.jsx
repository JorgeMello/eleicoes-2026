import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api, brl, fotoUrl, UFS, UFS_DATA } from '../lib/api.js';

function getLinhas(cargo = 'presidente') {
  const ehSenador = cargo === 'senador';
  return [
    { label: 'Partido', get: (c) => c.partido, ajuda: 'Legenda pela qual o candidato concorre em 2026 (fonte: TSE via G1).',
      sobre: 'O partido é a legenda pela qual o candidato disputa a eleição. Ele define o número de urna, o acesso a recursos de campanha (como o Fundo Eleitoral) e, em cargos proporcionais, influencia o cálculo das vagas. Aqui comparamos apenas a sigla de cada candidato.' },
    { label: 'Número', get: (c) => c.numero, ajuda: 'Número digitado na urna eletrônica (2 dígitos para presidente e governador; 3 para senador).',
      sobre: 'É o número que o eleitor digita na urna eletrônica. Presidente e governador usam 2 dígitos; senador usa 3; deputado federal 4; estadual 5. Os dois primeiros dígitos de deputados indicam o partido.' },
    { label: 'Profissão', get: (c) => c.profissao ?? '—', ajuda: 'Ocupação declarada pelo candidato no registro do TSE.',
      sobre: 'A ocupação que o candidato declarou ao registrar a candidatura no TSE. Ajuda a conhecer a origem profissional de cada um — de torneiro mecânico a empresário — mas não mede preparo para o cargo.' },
    { label: 'Instrução', get: (c) => c.grau_instrucao ?? '—', ajuda: 'Grau de instrução declarado no registro do TSE.',
      sobre: 'O nível de escolaridade declarado pelo candidato, do ensino fundamental à pós-graduação. Não há exigência de escolaridade mínima para concorrer: o que vale é a escolha do eleitor.' },
    { label: 'Cor/etnia', get: (c) => c.cor_etnia ?? '—', ajuda: 'Autodeclaração de cor/etnia do registro do TSE.',
      sobre: 'Como o próprio candidato se declara (branca, preta, parda, amarela ou indígena). É um dado de representatividade: mostra a diversidade — ou a falta dela — entre quem disputa o poder.' },
    ehSenador
      ? {
          label: 'Suplentes',
          get: (c, extra) => {
            const s1 =
              extra?.suplentes?.find((s) => Number(s.ordem) === 1) ||
              (c.suplente1_nome ? { nome: c.suplente1_nome, partido: c.suplente1_partido } : null);
            const s2 =
              extra?.suplentes?.find((s) => Number(s.ordem) === 2) ||
              (c.suplente2_nome ? { nome: c.suplente2_nome, partido: c.suplente2_partido } : null);
            const t1 = s1 ? `1º: ${s1.nome_urna || s1.nome} (${s1.partido || c.partido})` : null;
            const t2 = s2 ? `2º: ${s2.nome_urna || s2.nome} (${s2.partido || c.partido})` : null;
            return [t1, t2].filter(Boolean).join(' · ') || '—';
          },
          ajuda: '1º e 2º Suplentes registrados na chapa do Senado perante o TSE.',
          sobre:
            'No Senado Federal, cada candidatura ao mandato de 8 anos concorre com dois suplentes registrados, que assumem a titularidade nos casos de licença (como ministérios) ou vacância do cargo.',
        }
      : {
          label: 'Vice',
          get: (c) => `${c.vice_nome ?? '—'}${c.vice_partido ? ` (${c.vice_partido})` : ''}`,
          ajuda: 'Companheiro de chapa (vice-presidente/vice-governador) declarado ao TSE.',
          sobre:
            'Nas eleições majoritárias (presidente e governador), cada candidato concorre em chapa com um vice, que assume em caso de ausência ou impedimento. O partido do vice costuma sinalizar as alianças da candidatura.',
        },
    { label: 'Patrimônio', get: (c) => brl(c.patrimonio_total), ajuda: 'Soma dos valores dos bens declarados ao TSE. Pode estar parcial se algum bem veio sem valor.',
      sobre: 'A soma de tudo que o candidato declarou possuir: imóveis, veículos, aplicações, empresas e outros bens. É fiscalizado pela Justiça Eleitoral e permite comparar a situação econômica dos candidatos.',
      num: (c) => c.patrimonio_total !== null && c.patrimonio_total !== undefined ? Number(c.patrimonio_total) : null, moeda: true },
    { label: 'Receitas', get: (c) => brl(c.receitas_total), ajuda: 'Total arrecadado pela campanha em 2026 (prestação de contas ao TSE).',
      sobre: 'Todo o dinheiro que entrou no caixa da campanha: doações de pessoas, recursos do partido, Fundo Eleitoral e financiamento coletivo. Campanhas com mais receita conseguem mais propaganda, viagens e estrutura.',
      num: (c) => c.receitas_total !== null && c.receitas_total !== undefined ? Number(c.receitas_total) : null, moeda: true },
    { label: 'Despesas', get: (c) => brl(c.despesas_total), ajuda: 'Total gasto pela campanha em 2026 (prestação de contas ao TSE).',
      sobre: 'Tudo que a campanha gastou: publicidade, pessoal, deslocamentos, material e serviços. A lei impõe um teto de gastos por cargo; estourar o limite pode cassar o mandato.',
      num: (c) => c.despesas_total !== null && c.despesas_total !== undefined ? Number(c.despesas_total) : null, moeda: true },
    { label: 'Nº bens', get: (c, extra) => extra?.bens?.length ?? '—', ajuda: 'Quantidade de itens na lista de bens declarados ao TSE.',
      sobre: 'Quantos itens compõem a declaração de bens. Um número alto não significa riqueza (pode ser muitos bens baratos); vale olhar junto com o valor total do patrimônio.',
      num: (c, extra) => extra?.bens?.length ?? null },
    { label: 'Eleições disputadas', get: (c, extra) => extra?.historico?.length ?? '—', ajuda: 'Candidaturas anteriores encontradas no histórico do candidato.',
      sobre: 'Quantas eleições o candidato já disputou segundo os registros. Indica experiência eleitoral: estreantes contra nomes que já venceram ou perderam outras disputas.',
      num: (c, extra) => extra?.historico?.length ?? null },
  ];
}

/** Monta a análise pronta dos dados comparados para o modal.
 *  Retorna [{ foto, texto }] — foto é a URL do candidato ou null (linhas-resumo). */
function analisa(item, validos) {
  const fmt = (v) => (item.moeda ? brl(v) : Number(v).toLocaleString('pt-BR'));
  const fotoDe = (d) => fotoUrl(d.candidato);
  const nomeDe = (d) => d.candidato.nome;
  if (item.num) {
    const com = validos
      .map((d) => ({ d, nome: nomeDe(d), valor: item.num(d.candidato, d) }))
      .filter((v) => v.valor !== null && Number.isFinite(v.valor))
      .sort((a, b) => b.valor - a.valor);
    if (com.length === 0) return [{ nome: '', foto: null, texto: 'Nenhum dos comparados tem valor coletado neste critério.' }];
    const linhas = com.map((v, i) => ({ nome: v.nome, foto: fotoDe(v.d), texto: `${i + 1}º — ${v.nome}: ${fmt(v.valor)}` }));
    if (com.length >= 2) {
      const [a, b] = com;
      const dif = a.valor - b.valor;
      const pct = b.valor > 0 ? ` (${((dif / b.valor) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}% a mais)` : '';
      linhas.push({ nome: '', foto: null, texto: `Diferença do 1º para o 2º: ${fmt(dif)}${pct}.` });
      linhas.push({ nome: '', foto: null, texto: `Somados: ${fmt(com.reduce((s, v) => s + v.valor, 0))}.` });
    }
    return linhas;
  }
  const vals = validos.map((d) => ({ d, nome: nomeDe(d), texto: String(item.get(d.candidato, d)) }));
  const unicos = [...new Set(vals.map((v) => v.texto))];
  if (unicos.length === 1) {
    return [
      { nome: '', foto: null, texto: `Todos os comparados têm o mesmo valor: ${unicos[0]}.` },
      ...vals.map((v) => ({ nome: v.nome, foto: fotoDe(v.d), texto: `${v.nome}: ${v.texto}` })),
    ];
  }
  return vals.map((v) => ({ nome: v.nome, foto: fotoDe(v.d), texto: `${v.nome}: ${v.texto}` }));
}

function Avatar({ nome, foto, tamanho = 'h-8 w-8' }) {
  if (foto) {
    return <img src={foto} alt={`Foto de ${nome}`} className={`${tamanho} rounded-full object-cover`} loading="lazy" />;
  }
  return (
    <span aria-hidden="true" className={`flex ${tamanho} items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300`}>
      {(nome || '?')[0]}
    </span>
  );
}

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
  const precisaUf = cargo !== 'presidente';
  const uf = precisaUf ? sp.get('uf') ?? '' : '';

  const sel = [sp.get('a'), sp.get('b'), sp.get('c')].filter(Boolean).slice(0, 3);

  useEffect(() => {
    api.candidatos(cargo, uf ? { uf } : {}).then(setLista).catch(() => setLista([]));
  }, [cargo, uf]);

  useEffect(() => {
    // Se for governador e não houver seleção nem UF na URL, pré-seleciona Rio Grande do Sul (Juliana, Zucco, Gabriel)
    if (cargo === 'governador' && !sp.get('uf') && !sp.get('a') && !sp.get('b') && !sp.get('c')) {
      const n = new URLSearchParams();
      n.set('uf', 'RS');
      n.set('a', '210002551508');
      n.set('b', '210002547857');
      n.set('c', '210002542892');
      setSp(n, { replace: true });
    }
  }, [cargo, sp, setSp]);

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

  const linhas = getLinhas(cargo);
  const itemSel = linhas.find((l) => l.label === ajudaSel?.label) ?? null;

  // Fecha o modal com ESC e trava o scroll do body enquanto aberto
  useEffect(() => {
    if (!itemSel) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setAjudaSel(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [itemSel]);

  // Trocar de UF limpa a seleção (comparação travada na UF)
  const setUf = (v) => {
    const n = new URLSearchParams();
    if (v) n.set('uf', v);
    setSp(n);
    setShowGraficos(false);
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
        <h1 className="text-2xl font-bold">Comparar até 3 candidatos · <span className="uppercase">{cargo}</span></h1>
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
        {precisaUf && (
          <select
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            className="rounded-lg border bg-white px-2 py-2 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900 sm:col-span-3"
            title="UF da comparação (travada: candidatos de UFs diferentes não se comparam)"
          >
            <option value="">Escolha a UF para comparar…</option>
            {UFS.map((u) => (
              <option key={u} value={u}>
                {u} · {UFS_DATA[u]?.nome || u} ({UFS_DATA[u]?.regiao})
              </option>
            ))}
          </select>
        )}
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
          {itemSel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setAjudaSel(null)}>
              <div
                role="dialog"
                aria-modal="true"
                aria-label={`${itemSel.label}: o que é e análise`}
                className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold">{itemSel.label}</h2>
                  <button
                    type="button"
                    onClick={() => setAjudaSel(null)}
                    aria-label="Fechar"
                    className="rounded-lg border px-2 py-1 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    ✕
                  </button>
                </div>
                <h3 className="mb-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">O que é</h3>
                <p className="mb-4 text-sm leading-relaxed">{itemSel.sobre}</p>
                <h3 className="mb-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">Análise</h3>
                <ul className="space-y-2 text-sm leading-relaxed">
                  {analisa(itemSel, validos).map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      {f.foto ? (
                        <Avatar nome={f.nome} foto={f.foto} />
                      ) : (
                        <span aria-hidden="true" className="text-emerald-600 dark:text-emerald-400">●</span>
                      )}
                      <span>{f.texto}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="overflow-x-auto rounded-xl border bg-white dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <th className="px-3 py-2 text-left">Critério</th>
                {dados.map((d, i) => (
                  <th key={i} className="px-3 py-2 text-left">
                    {d ? (
                      <span className="flex items-center gap-2">
                        {fotoUrl(d.candidato) ? (
                          <img src={fotoUrl(d.candidato)} alt={`Foto de ${d.candidato.nome}`} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                        ) : (
                          <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-lg font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                            {(d.candidato.nome || '?')[0]}
                          </span>
                        )}
                        {d.candidato.nome}
                      </span>
                    ) : (
                      '—'
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linhas.map(({ label: k, get: fn, ajuda }) => (
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
