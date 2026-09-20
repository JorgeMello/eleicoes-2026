import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { coletarLista, novoBrowser } from './lista.js';
import { coletarPerfil } from './perfil.js';
import { baixarFoto } from './fotos.js';
import { enriquecerViaTSE } from './tse.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'out');
const DELAY_MIN = 2000;
const DELAY_MAX = 5000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await novoBrowser();
const ctx = await browser.newContext({ locale: 'pt-BR', viewport: { width: 1366, height: 900 } });
const page = await ctx.newPage();

console.log('[1/4] Coletando lista...');
const lista = await coletarLista(page);
console.log(`Lista: ${lista.length} links únicos`);

const resultados = [];
const erros = [];

for (const [i, item] of lista.entries()) {
  console.log(`[2/4] Perfil ${i + 1}/${lista.length}: ${item.slug}`);
  try {
    const perfil = await coletarPerfil(page, item);
    const foto_local = await baixarFoto(page.request, perfil.slug, perfil.foto_url_original);
    perfil.foto_local = foto_local;
    const tse = await enriquecerViaTSE(page.request, perfil);
    perfil.tse = tse;
    if (tse?.patrimonio_total && !perfil.patrimonio_total) perfil.patrimonio_total = tse.patrimonio_total;
    if (tse?.nome_completo) perfil.nome_completo = tse.nome_completo;
    if (tse?.genero && !perfil.genero) perfil.genero = tse.genero;
    perfil.coletado_em = new Date().toISOString();
    resultados.push(perfil);
  } catch (e) {
    console.error(`  ERRO ${item.slug}: ${e.message}`);
    erros.push({ slug: item.slug, motivo: e.message });
  }
  await sleep(DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN));
}

await mkdir(OUT_DIR, { recursive: true });
await writeFile(path.join(OUT_DIR, 'candidatos.json'), JSON.stringify(resultados, null, 2));
await writeFile(path.join(OUT_DIR, 'erros.json'), JSON.stringify(erros, null, 2));
console.log(`[3/4] OK: ${resultados.length} | Falhas: ${erros.length}`);
console.log('[4/4] Para importar: php spark eleicoes:importar ../scraper/out/candidatos.json (a partir de backend/)');
console.log('      ou POST /api/coletas com header X-API-Key e corpo { "lote": [...] }');

await browser.close();
