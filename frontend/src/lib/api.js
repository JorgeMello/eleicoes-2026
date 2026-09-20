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
  rankingPatrimonio: (cargo) => get(`/rankings/patrimonio?cargo=${cargo}`),
  rankingReceitas: (cargo) => get(`/rankings/receitas?cargo=${cargo}`),
  estatisticas: (cargo) => get(`/estatisticas?cargo=${cargo}`),
  pesquisas: (params = {}) => {
    const q = new URLSearchParams({ cargo: 'presidente', ...params });
    return get(`/pesquisas?${q}`);
  },
  evolucao: (params = {}) => {
    const q = new URLSearchParams({ cargo: 'presidente', ...params });
    return get(`/pesquisas/evolucao?${q}`);
  },
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
