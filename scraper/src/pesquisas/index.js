import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { novoBrowser } from '../lista.js';
import { coletarIndice } from './indice.js';
import { coletarMateria } from './materia.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', '..', 'out');

const INCLUIR = /presidente|1[ºo] turno|2[ºo] turno|rejei|inten[çc][ãa]o de voto|lula|flavio|flávio|bolsonaro/i;
const EXCLUIR = /senado|governador|stf|institui|sentimento|master|espont[âa]nea|avalia|aprova/i;

// Sementes manuais (matérias fora do índice atual ou de dias anteriores)
const SEMENTES = [
  { titulo: 'Quaest, 1º turno: Lula, 36%; Flávio Bolsonaro, 29% (manual)', url: 'https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/09/07/quaest-presidente-7-setembro.ghtml' },
  { titulo: 'Datafolha, 2º turno: Lula, 46%; Flávio Bolsonaro, 44% (manual)', url: 'https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/09/11/datafolha-2o-turno-presidente-11-setembro.ghtml' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await novoBrowser();
const page = await (await browser.newContext({ locale: 'pt-BR' })).newPage();

console.log('[1/3] Índice de matérias...');
const links = await coletarIndice(page);
const alvos = [...links.filter((l) => INCLUIR.test(l.titulo) && !EXCLUIR.test(l.titulo)), ...SEMENTES];
const unicos = [...new Map(alvos.map((l) => [l.url, l])).values()];
console.log(`Índice: ${links.length} links, ${unicos.length} alvos (presidente 1º/2º turno/rejeição)`);

const lote = [];
const erros = [];
for (const [i, link] of unicos.entries()) {
  console.log(`[2/3] Matéria ${i + 1}/${unicos.length}: ${link.titulo.substring(0, 70)}`);
  try {
    const mat = await coletarMateria(page, link.url);
    if (!mat.registro_tse) {
      erros.push({ url: link.url, motivo: 'sem registro TSE — ignorada (não é "oficial")' });
      continue;
    }
    for (const cen of mat.cenarios) {
      if (!['1-turno', '2-turno', 'rejeicao'].includes(cen.tipo)) continue; // MVP: sem espontânea
      lote.push({
        instituto: mat.instituto,
        cargo: mat.cargo,
        uf: mat.uf,
        tipo: cen.tipo,
        confronto: cen.confronto ?? null,
        data_inicio: mat.data_inicio,
        data_fim: mat.data_fim,
        margem_erro: mat.margem_erro,
        amostra: mat.amostra,
        registro_tse: mat.registro_tse,
        fonte_url: mat.fonte_url,
        resultados: cen.resultados,
      });
    }
  } catch (e) {
    erros.push({ url: link.url, motivo: e.message });
  }
  await sleep(2000 + Math.random() * 2000);
}

await mkdir(OUT_DIR, { recursive: true });
await writeFile(path.join(OUT_DIR, 'pesquisas.json'), JSON.stringify(lote, null, 2));
await writeFile(path.join(OUT_DIR, 'pesquisas-erros.json'), JSON.stringify(erros, null, 2));
console.log(`[3/3] Cenários: ${lote.length} | Falhas/ignoradas: ${erros.length}`);
console.log('Importar: cd ../backend && php spark eleicoes:importar-pesquisas');

await browser.close();
