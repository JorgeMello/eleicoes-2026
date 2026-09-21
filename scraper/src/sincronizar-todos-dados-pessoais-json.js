import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'out');
const MYSQL_BIN = 'c:\\xampp3\\mysql\\bin\\mysql.exe';

console.log('Sincronizando dados pessoais (profissao, cor_etnia, grau_instrucao, genero) nos JSONs...');

function sincronizarCargo(cargo, arquivoTodos, prefixoUf) {
  console.log(`\nSincronizando ${cargo}...`);
  const sql = `SELECT slug, uf, patrimonio_total, receitas_total, despesas_total, limite_gastos, profissao, cor_etnia, grau_instrucao, genero FROM eleicoes.candidatos WHERE cargo='${cargo}';`;
  const res = execSync(`"${MYSQL_BIN}" -u root --default-character-set=utf8mb4 -e "${sql}"`, { maxBuffer: 15 * 1024 * 1024 }).toString('utf8');

  const map = new Map();
  for (const line of res.split('\n').filter(Boolean).slice(1)) {
    const parts = line.trim().split('\t');
    const [slug, uf, pat, rec, desp, lim, prof, etnia, inst, gen] = parts;
    map.set(`${slug}_${uf}`, {
      patrimonio_total: pat === 'NULL' || pat === undefined ? null : parseFloat(pat),
      receitas_total: rec === 'NULL' || rec === undefined ? null : parseFloat(rec),
      despesas_total: desp === 'NULL' || desp === undefined ? null : parseFloat(desp),
      limite_gastos: lim === 'NULL' || lim === undefined ? null : parseFloat(lim),
      profissao: prof === 'NULL' || prof === undefined ? null : prof,
      cor_etnia: etnia === 'NULL' || etnia === undefined ? null : etnia,
      grau_instrucao: inst === 'NULL' || inst === undefined ? null : inst,
      genero: gen === 'NULL' || gen === undefined ? null : gen
    });
  }

  const pathTodos = path.join(OUT_DIR, arquivoTodos);
  if (existsSync(pathTodos)) {
    const todos = JSON.parse(readFileSync(pathTodos, 'utf8'));
    let updated = 0;
    for (const c of todos) {
      const key = `${c.slug}_${c.uf}`;
      if (map.has(key)) {
        const v = map.get(key);
        c.patrimonio_total = v.patrimonio_total;
        c.receitas_total = v.receitas_total;
        c.despesas_total = v.despesas_total;
        c.limite_gastos = v.limite_gastos;
        c.profissao = v.profissao;
        c.cor_etnia = v.cor_etnia;
        c.grau_instrucao = v.grau_instrucao;
        c.genero = v.genero;
        updated++;
      }
    }
    writeFileSync(pathTodos, JSON.stringify(todos, null, 2), 'utf8');
    console.log(`${arquivoTodos} atualizado com ${updated} registros.`);
  }

  // Sincronizar também arquivos por UF
  const ufs = ['ac','al','am','ap','ba','ce','df','es','go','ma','mg','ms','mt','pa','pb','pe','pi','pr','rj','rn','ro','rr','rs','sc','se','sp','to'];
  for (const uf of ufs) {
    const pUf = path.join(OUT_DIR, `${prefixoUf}-${uf}.json`);
    if (existsSync(pUf)) {
      try {
        const dados = JSON.parse(readFileSync(pUf, 'utf8'));
        if (Array.isArray(dados)) {
          let upUf = 0;
          for (const c of dados) {
            const key = `${c.slug}_${c.uf || uf.toUpperCase()}`;
            if (map.has(key)) {
              const v = map.get(key);
              c.profissao = v.profissao;
              c.cor_etnia = v.cor_etnia;
              c.grau_instrucao = v.grau_instrucao;
              c.genero = v.genero;
              upUf++;
            }
          }
          writeFileSync(pUf, JSON.stringify(dados, null, 2), 'utf8');
        }
      } catch (err) {
        // ignora se arquivo tiver outro formato
      }
    }
  }
}

sincronizarCargo('dep-estadual', 'dep-estadual-todos.json', 'dep-estadual');
sincronizarCargo('dep-federal', 'dep-federal-todos.json', 'dep-federal');

console.log('\nSincronização dos arquivos JSON concluída com sucesso!');
