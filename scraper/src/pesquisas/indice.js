export const INDICE_URL = 'https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/';

/** Coleta links de matérias de pesquisa no índice do G1. */
export async function coletarIndice(page) {
  await page.goto(INDICE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);

  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')]
      .map((a) => ({
        titulo: (a.innerText || '').replace(/\s+/g, ' ').trim().substring(0, 140),
        url: a.getAttribute('href'),
      }))
      .filter((x) => /pesquisa-eleitoral\/noticia/i.test(x.url || '') && x.titulo.length > 20)
  );

  const unicos = [...new Map(links.map((l) => [l.url, l])).values()];
  return unicos;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { novoBrowser } = await import('../lista.js');
  const browser = await novoBrowser();
  const page = await (await browser.newContext()).newPage();
  const links = await coletarIndice(page);
  console.log(JSON.stringify(links, null, 1).substring(0, 3000));
  console.log(`TOTAL: ${links.length}`);
  await browser.close();
}
