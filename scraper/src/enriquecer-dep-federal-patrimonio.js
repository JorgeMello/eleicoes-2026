import https from 'node:https';
import { execSync } from 'node:child_process';
import { writeFileSync, appendFileSync, unlinkSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agent = new https.Agent({ keepAlive: true, maxSockets: 30 });

const MYSQL_BIN = 'c:\\xampp3\\mysql\\bin\\mysql.exe';

function executeSql(sql) {
  const tmpFile = path.join(__dirname, `tmp_update_${Date.now()}_${Math.random().toString(36).slice(2)}.sql`);
  writeFileSync(tmpFile, sql, 'utf8');
  try {
    execSync(`"${MYSQL_BIN}" -u root --default-character-set=utf8mb4 eleicoes < "${tmpFile}"`);
  } finally {
    if (existsSync(tmpFile)) {
      unlinkSync(tmpFile);
    }
  }
}

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function fetchCandidate(url) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) {
      return resolve({ ok: false, motivo: 'URL inválida' });
    }

    const req = https.get(url, { agent, headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return resolve({ ok: false, status: res.statusCode, motivo: `HTTP ${res.statusCode}` });
        }

        // 1. Extrai total de bens (patrimônio)
        const totalMatch = data.match(/class="glb-qee-detail__assets-total"[^>]*data-qee-currency="([^"]+)"/i);
        const emptyMatch = data.includes('Não há bens a declarar');
        let patTotal = null;
        if (totalMatch) {
          patTotal = parseFloat(totalMatch[1]);
        } else if (emptyMatch) {
          patTotal = 0.00;
        }

        // 2. Extrai bens individuais
        const bens = [];
        const itemMatches = [...data.matchAll(/<li[^>]*class="glb-qee-detail__asset-item"[^>]*>([\s\S]*?)<\/li>/gi)];
        for (const im of itemMatches) {
          const block = im[1];
          const typeM = block.match(/class="glb-qee-detail__asset-type">([^<]+)</i);
          const valM = block.match(/data-qee-currency="([^"]+)"/i);
          const descM = block.match(/class="glb-qee-detail__asset-description">([^<]+)</i);
          const val = valM ? parseFloat(valM[1]) : 0;
          bens.push({
            tipo: typeM ? typeM[1].trim() : 'Outros',
            valor: val,
            descricao: descM ? descM[1].trim() : ''
          });
        }

        // Se bens foram encontrados mas patTotal não foi marcado, soma os bens
        if (patTotal === null && bens.length > 0) {
          patTotal = bens.reduce((acc, b) => acc + (b.valor || 0), 0);
        } else if (patTotal === null) {
          // Se não há bens nem mensagem de vazio, marca 0.00
          patTotal = 0.00;
        }

        // 3. Extrai finanças de campanha (receitas, despesas, limite de gastos)
        const chartMatches = [...data.matchAll(/<em[^>]*class="glb-qee-detail__chart-value"[^>]*data-qee-currency="([^"]+)"/gi)].map(m => parseFloat(m[1]));
        const receitas = chartMatches[0] ?? null;
        const despesas = chartMatches[1] ?? null;
        const limite = chartMatches[2] ?? null;

        resolve({
          ok: true,
          patrimonio_total: patTotal,
          bens,
          receitas_total: receitas,
          despesas_total: despesas,
          limite_gastos: limite
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, motivo: 'Timeout' });
    });

    req.on('error', (err) => {
      resolve({ ok: false, motivo: err.message });
    });
  });
}

async function main() {
  console.log('=== ENRIQUECIMENTO DE PATRIMÔNIO & BENS - DEPUTADO FEDERAL ===');

  // Consulta todos os candidatos a deputado federal pendentes
  const query = `SELECT id, nome, uf, perfil_g1_url FROM eleicoes.candidatos WHERE cargo='dep-federal' AND patrimonio_total IS NULL ORDER BY id ASC;`;
  const tsv = execSync(`"${MYSQL_BIN}" -u root --default-character-set=utf8mb4 -e "${query}"`).toString('utf8');
  const lines = tsv.split('\n').filter(Boolean).slice(1);

  const candidatos = lines.map(line => {
    const parts = line.split('\t');
    return {
      id: parseInt(parts[0], 10),
      nome: parts[1],
      uf: parts[2],
      perfil_g1_url: parts[3]?.trim()
    };
  }).filter(c => c.id && c.perfil_g1_url);

  console.log(`Total de candidatos pendentes de patrimônio: ${candidatos.length}`);

  if (candidatos.length === 0) {
    console.log('Todos os candidatos a Deputado Federal já estão enriquecidos!');
    return;
  }

  const CONCORRENCIA = 25;
  const CHUNK_FLUSH = 100;
  let processados = 0;
  let sucessos = 0;
  let totalBensInseridos = 0;
  let bufferSql = [];

  async function flushBuffer() {
    if (bufferSql.length === 0) return;
    const sqlToRun = `START TRANSACTION;\n` + bufferSql.join('\n') + `\nCOMMIT;\n`;
    bufferSql = [];
    executeSql(sqlToRun);
  }

  const fila = [...candidatos];
  const startTime = Date.now();

  async function worker(workerId) {
    while (fila.length > 0) {
      const c = fila.shift();
      if (!c) break;

      let res = await fetchCandidate(c.perfil_g1_url);
      if (!res.ok) {
        // Tenta 1 retry
        await new Promise(r => setTimeout(r, 300));
        res = await fetchCandidate(c.perfil_g1_url);
      }

      processados++;

      if (res.ok) {
        sucessos++;
        const pat = res.patrimonio_total !== null ? res.patrimonio_total.toFixed(2) : '0.00';
        const rec = res.receitas_total !== null ? res.receitas_total.toFixed(2) : 'NULL';
        const desp = res.despesas_total !== null ? res.despesas_total.toFixed(2) : 'NULL';
        const lim = res.limite_gastos !== null ? res.limite_gastos.toFixed(2) : 'NULL';

        bufferSql.push(`UPDATE candidatos SET patrimonio_total = ${pat}, receitas_total = ${rec}, despesas_total = ${desp}, limite_gastos = ${lim} WHERE id = ${c.id};`);

        if (res.bens && res.bens.length > 0) {
          bufferSql.push(`DELETE FROM bens WHERE candidato_id = ${c.id};`);
          for (const b of res.bens) {
            const tipo = escapeSql((b.tipo || 'Outros').slice(0, 120));
            const desc = escapeSql(b.descricao || '');
            const val = (b.valor || 0).toFixed(2);
            bufferSql.push(`INSERT INTO bens (candidato_id, tipo, descricao, valor, created_at) VALUES (${c.id}, ${tipo}, ${desc}, ${val}, NOW());`);
            totalBensInseridos++;
          }
        }
      } else {
        // Se a página retornou 404 ou falhou, registra patrimonio_total = 0.00 para não ficar nulo
        bufferSql.push(`UPDATE candidatos SET patrimonio_total = 0.00 WHERE id = ${c.id};`);
      }

      if (bufferSql.length >= CHUNK_FLUSH) {
        await flushBuffer();
      }

      if (processados % 200 === 0 || processados === candidatos.length) {
        const elapsed = (Date.now() - startTime) / 1000;
        const speed = (processados / elapsed).toFixed(1);
        const remaining = ((candidatos.length - processados) / (processados / elapsed)).toFixed(0);
        console.log(`[Progresso] ${processados}/${candidatos.length} (${((processados/candidatos.length)*100).toFixed(1)}%) | Bens: ${totalBensInseridos} | Velocidade: ${speed} req/s | Restante: ~${remaining}s`);
      }
    }
  }

  const workers = Array.from({ length: CONCORRENCIA }, (_, i) => worker(i + 1));
  await Promise.all(workers);
  await flushBuffer();

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n=============================================================`);
  console.log(`ENRIQUECIMENTO CONCLUÍDO COM SUCESSO!`);
  console.log(`Total processados: ${processados} em ${totalTime}s`);
  console.log(`Candidaturas atualizadas com sucesso: ${sucessos}`);
  console.log(`Total de bens inseridos na tabela 'bens': ${totalBensInseridos}`);
}

main().catch(err => {
  console.error('ERRO FATAL:', err);
  process.exit(1);
});
