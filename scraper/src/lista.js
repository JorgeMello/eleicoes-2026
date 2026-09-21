import { chromium } from 'playwright';

export const BASE = 'https://g1.globo.com/politica/eleicoes/2026/quem-sao-os-candidatos';
export const LISTA_URL = `${BASE}/presidente.ghtml`;
export const BASE_PERFIL = `${BASE}/presidente/`;

export const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

/** Mapeia nomes internos para caminhos no portal G1 */
export function g1CargoSlug(cargo = 'presidente') {
  const c = cargo.toLowerCase();
  if (c === 'dep-federal') return 'deputado-federal';
  if (c === 'dep-estadual') return 'deputado-estadual';
  return c;
}

/** URL da lista: nacional (presidente) ou por UF (demais cargos). */
export function urlLista(cargo = 'presidente', uf = null) {
  const c = cargo.toLowerCase();
  const g1Cargo = g1CargoSlug(c);
  if (!uf || c === 'presidente') return `${BASE}/${g1Cargo}.ghtml`;
  return `${BASE}/${g1Cargo}/${uf.toLowerCase()}.ghtml`;
}

export function novoBrowser() {
  return chromium.launch({ headless: true, locale: 'pt-BR' });
}

export async function coletarLista(page, { cargo = 'presidente', uf = null } = {}) {
  const c = cargo.toLowerCase();
  const g1Cargo = g1CargoSlug(c);
  const url = urlLista(c, uf);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForSelector(`a[href*="/${g1Cargo}/"]`, { timeout: 30000 });

  const cards = await page.evaluate((cargoNome) => {
    const sel = `a[href*="/${cargoNome}/"]`;
    // Perfil: .../{cargo}[/{uf}]/{slug-ou-id}.ghtml ; lista: .../{cargo}[/{uf}].ghtml
    const re = new RegExp(`/${cargoNome}/(?:[a-z]{2}/)?([a-z0-9-]+)\\.ghtml`);
    return [...document.querySelectorAll(sel)]
      .map((a) => {
        const href = a.getAttribute('href') || '';
        const m = href.match(re);
        if (!m) return null;
        const card = a.closest('li') || a;
        const txt = (card.innerText || '').replace(/\s+/g, ' ').trim();
        const img = a.querySelector('img') || card.querySelector('img');
        // Formato: "Nome PARTIDO NUM Ver perfil" — número está no meio
        const pn = txt.match(/([A-ZÇÃÕÉ]{2,15})\s+(\d{1,5})\b/);
        const numero = pn ? parseInt(pn[2], 10) : null;
        const partido = pn ? pn[1] : null;
        const nome = pn ? txt.slice(0, pn.index).trim() : txt.replace(/\s*Ver perfil\s*$/i, '').trim();
        return {
          slug: m[1],
          perfil_g1_url: href.startsWith('http') ? href : 'https://g1.globo.com' + href,
          nome_sugerido: nome || null,
          partido_sugerido: partido,
          numero,
          foto_url_original: img ? img.getAttribute('src') : null,
        };
      })
      .filter(Boolean);
  }, g1Cargo);

  // Deduplica por slug
  const unicos = [...new Map(cards.map((x) => [x.slug, x])).values()];
  return unicos.map((x) => ({ ...x, cargo: c, uf: uf ? uf.toUpperCase() : 'BR' }));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const browser = await novoBrowser();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const lista = await coletarLista(page);
  console.log(JSON.stringify(lista, null, 2));
  console.log(`TOTAL: ${lista.length}`);
  await browser.close();
}
