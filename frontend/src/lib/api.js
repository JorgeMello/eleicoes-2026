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

export const UFS_DATA = {
  AC: { nome: 'Acre', regiao: 'Norte' },
  AL: { nome: 'Alagoas', regiao: 'Nordeste' },
  AP: { nome: 'Amapá', regiao: 'Norte' },
  AM: { nome: 'Amazonas', regiao: 'Norte' },
  BA: { nome: 'Bahia', regiao: 'Nordeste' },
  CE: { nome: 'Ceará', regiao: 'Nordeste' },
  DF: { nome: 'Distrito Federal', regiao: 'Centro-Oeste' },
  ES: { nome: 'Espírito Santo', regiao: 'Sudeste' },
  GO: { nome: 'Goiás', regiao: 'Centro-Oeste' },
  MA: { nome: 'Maranhão', regiao: 'Nordeste' },
  MT: { nome: 'Mato Grosso', regiao: 'Centro-Oeste' },
  MS: { nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste' },
  MG: { nome: 'Minas Gerais', regiao: 'Sudeste' },
  PA: { nome: 'Pará', regiao: 'Norte' },
  PB: { nome: 'Paraíba', regiao: 'Nordeste' },
  PR: { nome: 'Paraná', regiao: 'Sul' },
  PE: { nome: 'Pernambuco', regiao: 'Nordeste' },
  PI: { nome: 'Piauí', regiao: 'Nordeste' },
  RJ: { nome: 'Rio de Janeiro', regiao: 'Sudeste' },
  RN: { nome: 'Rio Grande do Norte', regiao: 'Nordeste' },
  RS: { nome: 'Rio Grande do Sul', regiao: 'Sul' },
  RO: { nome: 'Rondônia', regiao: 'Norte' },
  RR: { nome: 'Roraima', regiao: 'Norte' },
  SC: { nome: 'Santa Catarina', regiao: 'Sul' },
  SP: { nome: 'São Paulo', regiao: 'Sudeste' },
  SE: { nome: 'Sergipe', regiao: 'Nordeste' },
  TO: { nome: 'Tocantins', regiao: 'Norte' },
};

export const REGIOES = ['Todas', 'Sudeste', 'Sul', 'Nordeste', 'Centro-Oeste', 'Norte'];

export const REGIOES_UFS = {
  Sudeste: ['SP', 'MG', 'RJ', 'ES'],
  Sul: ['RS', 'PR', 'SC'],
  Nordeste: ['BA', 'PE', 'CE', 'MA', 'PB', 'RN', 'AL', 'PI', 'SE'],
  'Centro-Oeste': ['GO', 'MT', 'MS', 'DF'],
  Norte: ['PA', 'AM', 'RO', 'TO', 'AC', 'AP', 'RR'],
};

// Bancadas constitucionais da Câmara dos Deputados (Art. 45, § 1º, CF/88 — Total: 513 cadeiras)
export const BANCADAS_FEDERAIS = {
  SP: 70, MG: 53, RJ: 46, BA: 39, RS: 31, PR: 30, PE: 25, CE: 22,
  MA: 18, GO: 17, PA: 17, SC: 16, PB: 12, ES: 10, PI: 10, AL: 9,
  AC: 8, AP: 8, AM: 8, DF: 8, MT: 8, MS: 8, RN: 8, RO: 8, RR: 8,
  SE: 8, TO: 8,
};

// Bancadas constitucionais das Assembleias Legislativas e CLDF (Art. 27 e 32 da CF/88 — Total: 1.059 cadeiras)
export const BANCADAS_ESTADUAIS = {
  SP: 94, MG: 77, RJ: 70, BA: 63, RS: 55, PR: 54, PE: 49, CE: 46,
  MA: 42, GO: 41, PA: 41, SC: 40, PB: 36, ES: 30, PI: 30, AL: 27,
  AC: 24, AP: 24, AM: 24, DF: 24, MT: 24, MS: 24, RN: 24, RO: 24, RR: 24,
  SE: 24, TO: 24,
};

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
  estatisticas: (cargo, params = {}) => {
    const q = new URLSearchParams({ cargo, ...params });
    return get(`/estatisticas?${q}`);
  },
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
