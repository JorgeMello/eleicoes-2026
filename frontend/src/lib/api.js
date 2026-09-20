// Base da API CodeIgniter 4 + base pública (fotos locais em /uploads/candidatos)
export const API_URL =
  import.meta.env.VITE_API_URL ??
  'http://localhost/eleicoes2026/backend/public/index.php/api';

export const PUBLIC_URL =
  import.meta.env.VITE_BACKEND_PUBLIC ??
  'http://localhost/eleicoes2026/backend/public';

export const CARGOS = [
  { id: 'presidente', rotulo: 'Presidente' },
  { id: 'governador', rotulo: 'Governador' },
  { id: 'senador', rotulo: 'Senador' },
  { id: 'dep-federal', rotulo: 'Dep. Federal' },
  { id: 'dep-estadual', rotulo: 'Dep. Estadual' },
];

export const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

async function get(path) {
  const r = await fetch(`${API_URL}${path}`);
  if (!r.ok) throw new Error(`API ${r.status} em ${path}`);
  return r.json();
}

export const api = {
  candidatos: (cargo, params = {}) => {
    const q = new URLSearchParams({ cargo, ...params });
    return get(`/candidatos?${q}`);
  },
  candidato: (slug) => get(`/candidatos/${slug}`),
  bens: (slug) => get(`/candidatos/${slug}/bens`),
  rankingPatrimonio: (cargo, params = {}) => {
    const q = new URLSearchParams({ cargo, ...params });
    return get(`/rankings/patrimonio?${q}`);
  },
  rankingReceitas: (cargo, params = {}) => {
    const q = new URLSearchParams({ cargo, ...params });
    return get(`/rankings/receitas?${q}`);
  },
  rankingGastos: (cargo, params = {}) => {
    const q = new URLSearchParams({ cargo, ...params });
    return get(`/rankings/gastos?${q}`);
  },
  rankingDoadores: (cargo, params = {}) => {
    const q = new URLSearchParams({ cargo, ...params });
    return get(`/rankings/doadores?${q}`);
  },
  estatisticas: (cargo) => get(`/estatisticas?cargo=${cargo}`),
  pesquisas: (params = {}) => {
    const q = new URLSearchParams({ cargo: 'presidente', ...params });
    return get(`/pesquisas?${q}`);
  },
  evolucao: (params = {}) => {
    const q = new URLSearchParams({ cargo: 'presidente', ...params });
    return get(`/pesquisas/evolucao?${q}`);
  },
  empresa: (doc) => get(`/empresas/${String(doc).replace(/\D/g, '')}`),
};

/** Foto local primeiro; fallback para URL original do G1. */
export function fotoUrl(c) {
  if (c?.foto_local) return `${PUBLIC_URL}${c.foto_local}`;
  return c?.foto_url_original ?? null;
}

export function brl(v) {
  if (v === null || v === undefined || v === '') return '—';
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

/** URL oficial estável de consulta nacional de candidaturas das Eleições 2026 no DivulgaCandContas do TSE */
export const URL_TSE_DIVULGACAND_2026 =
  'https://divulgacandcontas.tse.jus.br/divulga/#/candidato/regiao/BR/20322002026';
