import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api, brl } from '../lib/api.js';

const LINHAS = [
  { label: 'Partido', get: (c) => c.partido, ajuda: 'Legenda pela qual o candidato concorre em 2026 (fonte: TSE via G1).' },
  { label: 'Número', get: (c) => c.numero, ajuda: 'Número digitado na urna eletrônica (2 dígitos para presidente e governador).' },
  { label: 'Profissão', get: (c) => c.profissao ?? '—', ajuda: 'Ocupação declarada pelo candidato no registro do TSE.' },
  { label: 'Instrução', get: (c) => c.grau_instrucao ?? '—', ajuda: 'Grau de instrução declarado no registro do TSE.' },
  { label: 'Cor/etnia', get: (c) => c.cor_etnia ?? '—', ajuda: 'Autodeclaração de cor/etnia do registro do TSE.' },
  { label: 'Vice', get: (c) => `${c.vice_nome ?? '—'}${c.vice_partido ? ` (${c.vice_partido})` : ''}`, ajuda: 'Companheiro de chapa (vice-presidente/vice-governador) declarado ao TSE.' },
  { label: 'Patrimônio', get: (c) => brl(c.patrimonio_total), ajuda: 'Soma dos valores dos bens declarados ao TSE. Pode estar parcial se algum bem veio sem valor.' },
  { label: 'Receitas', get: (c) => brl(c.receitas_total), ajuda: 'Total arrecadado pela campanha em 2026 (prestação de contas ao TSE).' },
  { label: 'Despesas', get: (c) => brl(c.despesas_total), ajuda: 'Total gasto pela campanha em 2026 (prestação de contas ao TSE).' },
  { label: 'Nº bens', get: (c, extra) => extra?.bens?.length ?? '—', ajuda: 'Quantidade de itens na lista de bens declarados ao TSE.' },
  { label: 'Eleições disputadas', get: (c, extra) => extra?.historico?.length ?? '—', ajuda: 'Candidaturas anteriores encontradas no histórico do candidato.' },
];

export default function Comparador() {
  const { cargo = 'presidente' } = useParams();
  const [sp, setSp] = useSearchParams();
  const [lista, setLista] = useState([]);
  const [dados, setDados] = useState([]);
  const [ajudaSel, setAjudaSel] = useState(null); // label do critério com ajuda aberta

  const sel = [sp.get('a'), sp.get('b'), sp.get('c')].filter(Boolean).slice(0, 3);

  useEffect(() => {
    api.candidatos(cargo).then(setLista).catch(() => setLista([]));
  }, [cargo]);

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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Comparar até 3 candidatos · {cargo}</h1>
      <div className="grid gap-2 sm:grid-cols-3">
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
        <div className="overflow-x-auto rounded-xl border bg-white dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <th className="px-3 py-2 text-left">Critério</th>
                {dados.map((d, i) => (
                  <th key={i} className="px-3 py-2 text-left">{d?.candidato?.nome ?? '—'}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LINHAS.map(([k, fn]) => (
                <tr key={k} className="border-t dark:border-slate-700">
                  <td className="px-3 py-1.5 text-slate-500 dark:text-slate-400">{k}</td>
                  {dados.map((d, i) => (
                    <td key={i} className="px-3 py-1.5 font-medium">{d ? fn(d.candidato, d) : '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">Selecione até 3 candidatos acima para comparar lado a lado.</p>
      )}
    </div>
  );
}
