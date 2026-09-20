import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { coletarLista, novoBrowser, UFS } from './lista.js';
import { coletarPerfil } from './perfil.js';
import { baixarFoto } from './fotos.js';
import { enriquecerViaTSE } from './tse.js';

// Uso: node src/coletar-governador.js [UF ...]  (sem args = 27 UFs)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'out');
const DELAY_MIN = 2000;
const DELAY_MAX = 5000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const alvos = (process.argv.slice(2).map((s) => s.toUpperCase()).filter((s) => UFS.includes(s)));
const ufs = alvos.length ? alvos : UFS;

const browser = await novoBrowser();
const ctx = await browser.newContext({ locale: 'pt-BR', viewport: { width: 1366, height: 900 } });
const page = await ctx.newPage();

const todos = [];
const resumo = [];

for (const uf of ufs) {
  console.log(`\n=== UF ${uf} ===`);
  try {
    const lista = await coletarLista(page, { cargo: 'governador', uf });
    console.log(`Lista ${uf}: ${lista.length} links`);
    const resultados = [];
    for (const [i, base] of lista.entries()) {
      const item = { ...base, foto_arquivo: `governador-${uf.toLowerCase()}-${base.slug}` };
      try {
        const perfil = await coletarPerfil(page, item);
        perfil.foto_local = await baixarFoto(page.request, item.foto_arquivo, perfil.foto_url_original);
        const tse = await enriquecerViaTSE(page.request, perfil).catch(() => null);
        if (tse) {
          perfil.tse = tse;
          if (tse.patrimonio_total && !perfil.patrimonio_total) perfil.patrimonio_total = tse.patrimonio_total;
          if (tse.nome_completo) perfil.nome_completo = tse.nome_completo;
          if (tse.genero && !perfil.genero) perfil.genero = tse.genero;
        }
        perfil.coletado_em = new Date().toISOString();
        resultados.push(perfil);
        console.log(`  [${i + 1}/${lista.length}] OK ${item.foto_arquivo}`);
      } catch (e) {
        console.error(`  [${i + 1}/${lista.length}] ERRO ${item.slug}: ${e.message}`);
        resumo.push({ uf, slug: item.slug, motivo: e.message });
      }
      await sleep(DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN));
    }
    await mkdir(OUT_DIR, { recursive: true });
    await writeFile(path.join(OUT_DIR, `governador-${uf.toLowerCase()}.json`), JSON.stringify(resultados, null, 2));
    todos.push(...resultados);
  } catch (e) {
    console.error(`UF ${uf} FALHOU: ${e.message}`);
    resumo.push({ uf, slug: '-', motivo: e.message });
  }
}

await mkdir(OUT_DIR, { recursive: true });
await writeFile(path.join(OUT_DIR, 'governador-todos.json'), JSON.stringify(todos, null, 2));
await writeFile(path.join(OUT_DIR, 'governador-erros.json'), JSON.stringify(resumo, null, 2));
console.log(`\nTOTAL: ${todos.length} perfis | Falhas: ${resumo.length}`);
console.log('Importar: cd ../backend && php spark eleicoes:importar ../scraper/out/governador-todos.json');

await browser.close();
