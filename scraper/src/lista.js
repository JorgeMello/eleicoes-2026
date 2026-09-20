import { chromium } from 'playwright';

export const LISTA_URL = 'https://g1.globo.com/politica/eleicoes/2026/quem-sao-os-candidatos/presidente.ghtml';
export const BASE_PERFIL = 'https://g1.globo.com/politica/eleicoes/2026/quem-sao-os-candidatos/presidente/';

export function novoBrowser() {
  return chromium.launch({ headless: true, locale: 'pt-BR' });
}

export async function coletarLista(page) {
  await page.goto(LISTA_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForSelector('a[href*="/presidente/"]', { timeout: 30000 });

  const cards = await page.$$eval('a[href*="/presidente/"]', (links) =>
    links
      .map((a) => {
        const href = a.getAttribute('href') || '';
        const m = href.match(/\/presidente\/([a-z0-9-]+)\.ghtml/);
        if (!m) return null;
        const card = a.closest('li') || a;
        const txt = (card.innerText || '').replace(/\s+/g, ' ').trim();
        const img = a.querySelector('img') || card.querySelector('img');
        // Formato: "Clariana Barao DC 27 Ver perfil" — número está no meio
        const pn = txt.match(/([A-ZÇÃÕÉ]{2,15})\s+(\d{1,3})\b/);
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
      .filter(Boolean)
  );

  // Deduplica por slug
  const unicos = [...new Map(cards.map((c) => [c.slug, c])).values()];
  return unicos;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const browser = await novoBrowser();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const lista = await coletarLista(page);
  console.log(JSON.stringify(lista, null, 2));
  console.log(`TOTAL: ${lista.length}`);
  await browser.close();
}
