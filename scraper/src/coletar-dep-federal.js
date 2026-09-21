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
const DELAY_MS = 500;
const CONCORRENCIA = 3;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const args = process.argv.slice(2).map((s) => s.toUpperCase());
const ufsAlvo = args.filter((s) => UFS.includes(s));
// Se não passou argumento, coleta AC (UF piloto padrão ouro com 89 candidaturas completas)
const ufsParaProcessar = ufsAlvo.length ? ufsAlvo : ['AC'];

console.log(`=== INICIANDO COLETA DEPUTADO FEDERAL 2026 ===`);
console.log(`UFs alvo (${ufsParaProcessar.length}): ${ufsParaProcessar.join(', ')}`);

const browser = await novoBrowser();
await mkdir(OUT_DIR, { recursive: true });

const todos = [];
const resumoErros = [];

async function processarUf(uf, workerId) {
  const arquivoUf = path.join(OUT_DIR, `dep-federal-${uf.toLowerCase()}.json`);

  if (existsSync(arquivoUf)) {
    try {
      const conteudo = JSON.parse(await readFile(arquivoUf, 'utf8'));
      if (Array.isArray(conteudo) && conteudo.length > 0) {
        console.log(`[Worker ${workerId}] UF ${uf}: Já coletada previamente (${conteudo.length} candidaturas). Reutilizando.`);
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
    console.log(`[Worker ${workerId}] Buscando lista de deputados federais em ${uf}...`);
    const lista = await coletarLista(page, { cargo: 'dep-federal', uf });
    console.log(`[Worker ${workerId}] UF ${uf}: Encontradas ${lista.length} candidaturas.`);

    for (const [i, base] of lista.entries()) {
      const item = { ...base, foto_arquivo: `dep-federal-${uf.toLowerCase()}-${base.slug}` };
      try {
        const perfil = await coletarPerfil(page, item);
        perfil.cargo = 'dep-federal';
        perfil.uf = uf;
        perfil.foto_local = await baixarFoto(page.request, item.foto_arquivo, perfil.foto_url_original);
        const tse = await enriquecerViaTSE(page.request, perfil).catch(() => null);
        if (tse && tse.tse_encontrado) {
          perfil.tse = tse;
          if (tse.patrimonio_total && !perfil.patrimonio_total) perfil.patrimonio_total = tse.patrimonio_total;
          if (tse.nome_completo) perfil.nome_completo = tse.nome_completo;
        }
        perfil.coletado_em = new Date().toISOString();
        resultados.push(perfil);
        console.log(`  [Worker ${workerId}][${uf} ${i + 1}/${lista.length}] OK: ${perfil.nome || item.slug} (${perfil.partido} ${perfil.numero})`);
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

const fila = [...ufsParaProcessar];
async function worker(workerId) {
  while (fila.length > 0) {
    const uf = fila.shift();
    if (!uf) break;
    const res = await processarUf(uf, workerId);
    todos.push(...res);
  }
}

const workers = Array.from({ length: Math.min(CONCORRENCIA, ufsParaProcessar.length) }, (_, i) => worker(i + 1));
await Promise.all(workers);

await browser.close();

// Deduplica e consolida
const mapaUnicos = new Map();
for (const cand of todos) {
  if (cand.slug) mapaUnicos.set(`${cand.uf}-${cand.slug}`, cand);
}
const todosConsolidados = Array.from(mapaUnicos.values());

if (todosConsolidados.length > 0) {
  await writeFile(path.join(OUT_DIR, 'dep-federal-todos.json'), JSON.stringify(todosConsolidados, null, 2));
}
await writeFile(path.join(OUT_DIR, 'dep-federal-erros.json'), JSON.stringify(resumoErros, null, 2));

console.log(`\n======================================================`);
console.log(`COLETA DEPUTADO FEDERAL CONCLUÍDA!`);
console.log(`Total Consolidados: ${todosConsolidados.length}`);
console.log(`Erros/Falhas: ${resumoErros.length}`);
console.log(`Arquivo consolidado: scraper/out/dep-federal-todos.json`);
console.log(`======================================================\n`);
