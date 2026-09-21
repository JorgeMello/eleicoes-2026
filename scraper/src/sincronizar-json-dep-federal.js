import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'out');
const MYSQL_BIN = 'c:\\xampp3\\mysql\\bin\\mysql.exe';

console.log('Sincronizando arquivos JSON de dep-federal a partir do MySQL...');
const sql = "SELECT slug, uf, patrimonio_total, receitas_total, despesas_total, limite_gastos FROM eleicoes.candidatos WHERE cargo='dep-federal';";
const res = execSync(`"${MYSQL_BIN}" -u root --default-character-set=utf8mb4 -e "${sql}"`).toString('utf8');

const map = new Map();
for (const line of res.split('\n').filter(Boolean).slice(1)) {
  const [slug, uf, pat, rec, desp, lim] = line.trim().split('\t');
  map.set(`${slug}_${uf}`, {
    patrimonio_total: pat === 'NULL' ? null : parseFloat(pat),
    receitas_total: rec === 'NULL' ? null : parseFloat(rec),
    despesas_total: desp === 'NULL' ? null : parseFloat(desp),
    limite_gastos: lim === 'NULL' ? null : parseFloat(lim)
  });
}

const arquivoTodos = path.join(OUT_DIR, 'dep-federal-todos.json');
if (existsSync(arquivoTodos)) {
  const todos = JSON.parse(readFileSync(arquivoTodos, 'utf8'));
  let updated = 0;
  for (const c of todos) {
    const key = `${c.slug}_${c.uf}`;
    if (map.has(key)) {
      const v = map.get(key);
      c.patrimonio_total = v.patrimonio_total;
      c.receitas_total = v.receitas_total;
      c.despesas_total = v.despesas_total;
      c.limite_gastos = v.limite_gastos;
      updated++;
    }
  }
  writeFileSync(arquivoTodos, JSON.stringify(todos, null, 2), 'utf8');
  console.log(`dep-federal-todos.json atualizado com ${updated} registros.`);
}
