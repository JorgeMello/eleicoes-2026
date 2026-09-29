/**
 * Sincronizador Cirúrgico de Despesas & Fornecedores (TSE DivulgaCandContas)
 * Atualização rápida sem Playwright / Sem navegador / Em poucos segundos
 * 
 * Uso:
 *   node src/atualizar-despesas-tse.js --cargo=presidente
 *   node src/atualizar-despesas-tse.js --cargo=governador --uf=SP
 *   node src/atualizar-despesas-tse.js --ativos
 */

import https from 'node:https';
import { execSync } from 'node:child_process';
import { writeFileSync, unlinkSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MYSQL_BIN = 'c:\\xampp3\\mysql\\bin\\mysql.exe';
const agent = new https.Agent({ keepAlive: true, maxSockets: 20 });

const HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'Referer': 'https://divulgacandcontas.tse.jus.br/divulga/',
};

// Executa comandos SQL em lote no MySQL local do XAMPP
function executeSql(sql) {
  const tmp = path.join(__dirname, `tmp_gastos_${Date.now()}_${Math.random().toString(36).slice(2)}.sql`);
  writeFileSync(tmp, sql, 'utf8');
  try {
    execSync(`"${MYSQL_BIN}" -u root --default-character-set=utf8mb4 eleicoes < "${tmp}"`);
  } finally {
    if (existsSync(tmp)) unlinkSync(tmp);
  }
}

// Busca candidatos cadastrados no banco local
function obterCandidatos(cargoFiltro = null, ufFiltro = null) {
  let where = "WHERE 1=1";
  if (cargoFiltro) where += ` AND c.cargo = '${cargoFiltro}'`;
  if (ufFiltro) where += ` AND c.uf = '${ufFiltro}'`;

  const query = `SELECT c.id, c.slug, c.nome, c.cargo, c.uf, c.numero, t.sq_candidato FROM eleicoes.candidatos c LEFT JOIN eleicoes.candidatos_tse t ON t.candidato_id = c.id ${where} ORDER BY c.id ASC;`;
  
  const raw = execSync(`"${MYSQL_BIN}" -u root --default-character-set=utf8mb4 -e "${query}"`).toString('utf8');
  const linhas = raw.split('\n').filter(Boolean).slice(1);
  return linhas.map(l => {
    const [id, slug, nome, cargo, uf, numero, sq] = l.trim().split('\t');
    return { id: parseInt(id, 10), slug, nome, cargo, uf, numero: parseInt(numero, 10), sq: sq === 'NULL' || !sq ? null : sq };
  });
}

// Faz requisição HTTP rápida via fetch com Keep-Alive
async function fetchJson(url) {
  try {
    const res = await fetch(url, { headers: HEADERS, agent });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function sincronizar() {
  const args = process.argv.slice(2);
  const cargoArg = args.find(a => a.startsWith('--cargo='))?.split('=')[1] || null;
  const ufArg = args.find(a => a.startsWith('--uf='))?.split('=')[1] || null;

  console.log(`=== INICIANDO SINCRONIZAÇÃO DE DESPESAS DO TSE (CICLO 60 MIN) ===`);
  console.log(`Filtros: Cargo=${cargoArg || 'TODOS'}, UF=${ufArg || 'TODAS'}`);

  const candidatos = obterCandidatos(cargoArg, ufArg);
  console.log(`Candidatos mapeados na base: ${candidatos.length}`);

  let atualizados = 0;
  let totalGastosInseridos = 0;
  const sqlUpdates = [];

  for (const [idx, cand] of candidatos.entries()) {
    const sq = cand.sq;
    if (!sq) continue;

    const urlConcentracao = `https://divulgacandcontas.tse.jus.br/divulga/rest/v1/prestador/consulta/concentracaoDespesas/280/${sq}/1`;
    const urlResumo = `https://divulgacandcontas.tse.jus.br/divulga/rest/v1/prestador/consulta/resumo/280/${sq}/1`;

    const [fornecedores, resumo] = await Promise.all([
      fetchJson(urlConcentracao),
      fetchJson(urlResumo)
    ]);

    if (resumo || (fornecedores && fornecedores.length > 0)) {
      const despesasTotal = parseFloat(resumo?.totalDespesasContratadas || resumo?.totalDespesasPagas || 0);
      const receitasTotal = parseFloat(resumo?.totalReceitas || 0);

      // 1. Atualiza totais na tabela candidatos
      if (despesasTotal > 0 || receitasTotal > 0) {
        sqlUpdates.push(`UPDATE candidatos SET despesas_total = ${despesasTotal}, receitas_total = ${receitasTotal} WHERE id = ${cand.id};`);
      }

      // 2. Limpa e regrava fornecedores detalhados na tabela gastos
      if (Array.isArray(fornecedores) && fornecedores.length > 0) {
        sqlUpdates.push(`DELETE FROM gastos WHERE candidato_id = ${cand.id};`);
        for (const f of fornecedores) {
          const nomeEsc = (f.nomeFornecedor || '').replace(/'/g, "''");
          const doc = (f.cnpjCpfFornecedor || '').replace(/\D/g, '');
          const val = parseFloat(f.valorGasto || 0);
          const perc = parseFloat(f.percentualGasto || 0);
          sqlUpdates.push(`INSERT INTO gastos (candidato_id, nome, documento, valor, percentual) VALUES (${cand.id}, '${nomeEsc}', '${doc}', ${val}, ${perc});`);
          totalGastosInseridos++;
        }
      }

      atualizados++;
      console.log(`[${idx + 1}/${candidatos.length}] OK: ${cand.nome} (${cand.cargo}) — Despesas: R$ ${despesasTotal.toLocaleString('pt-BR')}`);
    }
  }

  if (sqlUpdates.length > 0) {
    console.log(`\nAplicando ${sqlUpdates.length} comandos SQL no banco local...`);
    executeSql(`START TRANSACTION;\n${sqlUpdates.join('\n')}\nCOMMIT;`);
  }

  console.log(`\nRecalculando auditoria no CodeIgniter CLI...`);
  try {
    execSync(`c:\\xampp3\\php\\php.exe c:\\xampp3\\htdocs\\eleicoes2026\\backend\\spark tse:auditar`, { stdio: 'inherit' });
  } catch (err) {
    console.warn(`Aviso: Execute 'php spark tse:auditar' manualmente se necessário.`);
  }

  console.log(`\n🎉 CONCLUÍDO COM SUCESSO!`);
  console.log(`• Candidatos com contas sincronizadas: ${atualizados}`);
  console.log(`• Registros de fornecedores gravados: ${totalGastosInseridos}`);
}

sincronizar().catch(console.error);
