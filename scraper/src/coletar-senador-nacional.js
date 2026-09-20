import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { coletarLista, novoBrowser, UFS } from './lista.js';
import { coletarPerfil } from './perfil.js';
import { baixarFoto } from './fotos.js';
import { enriquecerViaTSE } from './tse.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'out');
const DELAY_MS = 600;
const CONCORRENCIA = 3; // 3 páginas simultâneas
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const alvos = process.argv.slice(2).map((s) => s.toUpperCase()).filter((s) => UFS.includes(s));
const ufsParaProcessar = alvos.length ? alvos : UFS;

console.log(`=== INICIANDO COLETA NACIONAL DE SENADORES (27 UFs) ===`);
console.log(`UFs selecionadas (${ufsParaProcessar.length}): ${ufsParaProcessar.join(', ')}`);

const browser = await novoBrowser();
await mkdir(OUT_DIR, { recursive: true });

const todos = [];
const resumoErros = [];

// Função auxiliar para coletar 1 UF
async function processarUf(uf, workerId) {
  const arquivoUf = path.join(OUT_DIR, `senador-${uf.toLowerCase()}.json`);

  // Se já foi coletado e tem registros válidos, podemos reaproveitar ou atualizar
  if (existsSync(arquivoUf)) {
    try {
      const conteudo = JSON.parse(await readFile(arquivoUf, 'utf8'));
      if (Array.isArray(conteudo) && conteudo.length > 0) {
        console.log(`[Worker ${workerId}] UF ${uf}: Já coletado (${conteudo.length} candidatos). Reutilizando.`);
        return conteudo;
      }
    } catch {
      // continua para coletar
    }
  }

  const ctx = await browser.newContext({ locale: 'pt-BR', viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  const resultados = [];

  try {
    console.log(`[Worker ${workerId}] Buscando lista de senadores em ${uf}...`);
    const lista = await coletarLista(page, { cargo: 'senador', uf });
    console.log(`[Worker ${workerId}] UF ${uf}: Encontradas ${lista.length} candidaturas.`);

    for (const [i, base] of lista.entries()) {
      const item = { ...base, foto_arquivo: `senador-${uf.toLowerCase()}-${base.slug}` };
      try {
        const perfil = await coletarPerfil(page, item);
        perfil.foto_local = await baixarFoto(page.request, item.foto_arquivo, perfil.foto_url_original);
        const tse = await enriquecerViaTSE(page.request, perfil).catch(() => null);
        if (tse && tse.tse_encontrado) {
          perfil.tse = tse;
          if (tse.patrimonio_total && !perfil.patrimonio_total) perfil.patrimonio_total = tse.patrimonio_total;
          if (tse.nome_completo) perfil.nome_completo = tse.nome_completo;
          if (tse.genero && !perfil.genero) perfil.genero = tse.genero;
        }
        perfil.coletado_em = new Date().toISOString();
        resultados.push(perfil);
        console.log(`  [Worker ${workerId}][${uf} ${i + 1}/${lista.length}] OK: ${perfil.nome || item.slug} (Suplentes: ${perfil.suplentes?.length ?? 0})`);
      } catch (err) {
        console.error(`  [Worker ${workerId}][${uf} ${i + 1}/${lista.length}] ERRO ${item.slug}: ${err.message}`);
        resumoErros.push({ uf, slug: item.slug, motivo: err.message });
      }
      await sleep(DELAY_MS);
    }

    await writeFile(arquivoUf, JSON.stringify(resultados, null, 2));
    console.log(`[Worker ${workerId}] UF ${uf} CONCLUÍDA: ${resultados.length} perfis salvos.`);
  } catch (err) {
    console.error(`[Worker ${workerId}] UF ${uf} FALHOU: ${err.message}`);
    resumoErros.push({ uf, slug: '-', motivo: err.message });
  } finally {
    await ctx.close();
  }

  return resultados;
}

// Fila concorrente com CONCORRENCIA workers
const fila = [...ufsParaProcessar];
async function worker(workerId) {
  while (fila.length > 0) {
    const uf = fila.shift();
    if (!uf) break;
    const res = await processarUf(uf, workerId);
    todos.push(...res);
  }
}

const workers = Array.from({ length: CONCORRENCIA }, (_, i) => worker(i + 1));
await Promise.all(workers);

await browser.close();

// Deduplica e ordena por UF e nome
const mapaUnicos = new Map();
for (const cand of todos) {
  if (cand.slug) mapaUnicos.set(`${cand.uf}-${cand.slug}`, cand);
}
const todosConsolidados = Array.from(mapaUnicos.values());

if (todosConsolidados.length > 0) {
  await writeFile(path.join(OUT_DIR, 'senador-todos.json'), JSON.stringify(todosConsolidados, null, 2));
}
await writeFile(path.join(OUT_DIR, 'senador-erros.json'), JSON.stringify(resumoErros, null, 2));

console.log(`\n======================================================`);
console.log(`COLETA NACIONAL CONCLUÍDA COM SUCESSO!`);
console.log(`Total de Senadores Consolidados: ${todosConsolidados.length}`);
console.log(`Total de Erros/Falhas: ${resumoErros.length}`);
console.log(`Arquivo consolidado: scraper/out/senador-todos.json`);
console.log(`======================================================\n`);
