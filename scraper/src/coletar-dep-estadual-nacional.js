import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { coletarLista, novoBrowser, UFS } from './lista.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'out');
await mkdir(OUT_DIR, { recursive: true });

console.log(`=== INICIANDO EXTRAÇÃO NACIONAL DEPUTADO ESTADUAL E DISTRITAL (27 UFs) ===`);

const browser = await novoBrowser();
const todos = [];

for (const uf of UFS) {
  const arquivoUf = path.join(OUT_DIR, `dep-estadual-${uf.toLowerCase()}.json`);

  // Se o estado já foi coletado com perfil completo, reaproveita integralmente!
  if (existsSync(arquivoUf)) {
    try {
      const conteudo = JSON.parse(await readFile(arquivoUf, 'utf8'));
      if (Array.isArray(conteudo) && conteudo.length > 0 && conteudo[0].nome) {
        console.log(`UF ${uf}: Já coletada previamente com ${conteudo.length} candidaturas.`);
        todos.push(...conteudo);
        continue;
      }
    } catch {
      // continua para coletar
    }
  }

  const page = await browser.newPage();
  try {
    const rotuloCargo = uf === 'DF' ? 'Deputado Distrital' : 'Deputado Estadual';
    console.log(`UF ${uf}: Coletando candidaturas a ${rotuloCargo}...`);
    const lista = await coletarLista(page, { cargo: 'dep-estadual', uf });
    console.log(`  -> ${uf}: ${lista.length} candidaturas encontradas.`);

    const formatados = lista.map((item) => ({
      slug: item.slug,
      nome: item.nome_sugerido || item.slug,
      nome_completo: item.nome_sugerido || item.slug,
      partido: item.partido_sugerido || null,
      numero: item.numero || null,
      cargo: 'dep-estadual',
      uf: uf,
      foto_url_original: item.foto_url_original || null,
      perfil_g1_url: item.perfil_g1_url || null,
      coletado_em: new Date().toISOString(),
      bens: [],
      doadores: [],
      gastos: [],
      historico: [],
    }));

    await writeFile(arquivoUf, JSON.stringify(formatados, null, 2));
    todos.push(...formatados);
  } catch (err) {
    console.error(`  ERRO na UF ${uf}: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();

const arquivoTodos = path.join(OUT_DIR, 'dep-estadual-todos.json');
await writeFile(arquivoTodos, JSON.stringify(todos, null, 2));

console.log(`\n=== EXTRAÇÃO NACIONAL CONCLUÍDA ===`);
console.log(`Total geral de candidaturas a Deputado Estadual e Distrital: ${todos.length}`);
console.log(`Arquivo consolidado salvo em: ${arquivoTodos}`);
