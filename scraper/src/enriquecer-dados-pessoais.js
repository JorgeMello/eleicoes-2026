import https from 'node:https';
import { execSync } from 'node:child_process';
import { writeFileSync, unlinkSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agent = new https.Agent({ keepAlive: true, maxSockets: 35 });

const MYSQL_BIN = 'c:\\xampp3\\mysql\\bin\\mysql.exe';

function executeSql(sql) {
  const tmpFile = path.join(__dirname, `tmp_personal_${Date.now()}_${Math.random().toString(36).slice(2)}.sql`);
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
  if (str === null || str === undefined || str === '') return 'NULL';
  return `'${String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

const FEMALE_NAMES = new Set([
  'maria', 'ana', 'francisca', 'antonia', 'adriana', 'juliana', 'marcia', 'fernanda', 'patricia', 'aline',
  'sandra', 'camila', 'amanda', 'bruna', 'jessica', 'leticia', 'julia', 'luciana', 'vanessa', 'mariana',
  'gabriela', 'vera', 'vitoria', 'larissa', 'claudia', 'beatriz', 'rita', 'luana', 'sonia', 'renata',
  'eliane', 'daniela', 'simone', 'natalia', 'teresa', 'cristiane', 'carla', 'debora', 'rosana', 'solange',
  'andreia', 'marina', 'elizabeth', 'denise', 'monica', 'regina', 'silvia', 'raquel', 'fatima', 'sueli',
  'flavia', 'clara', 'barbara', 'rosangela', 'marta', 'helena', 'isabela', 'tatiana', 'lorena', 'valeria',
  'elisa', 'cecilia', 'paula', 'carolina', 'laura', 'bianca', 'viviane', 'alessandra', 'tamires', 'priscila',
  'mara', 'elba', 'rosa', 'neuza', 'neusa', 'cleusa', 'cleuza', 'ivone', 'cleide', 'marilene', 'roseli',
  'iracema', 'aparecida', 'lourdes', 'joana', 'madalena', 'tereza', 'terezinha', 'raimunda', 'sebastiana',
  'benedita', 'geralda', 'severina', 'marli', 'marly', 'dora', 'alice', 'ines', 'inês', 'luiza',
  'manuela', 'emanuelly', 'yasmin', 'isadora', 'livia', 'sophia', 'sarah', 'samara', 'rebeca', 'sabrina',
  'joelma', 'gildete', 'edileusa', 'gleide', 'maristela', 'katia', 'kátia', 'cinthia', 'cintia', 'kelly',
  'carmen', 'carminha', 'dalva', 'zilda', 'ivanete', 'iraci', 'rosalina', 'leila', 'lilian', 'valdirene'
]);

const MALE_NAMES = new Set([
  'jose', 'joao', 'antonio', 'francisco', 'carlos', 'paulo', 'pedro', 'lucas', 'luiz', 'marcos',
  'luis', 'gabriel', 'rafael', 'daniel', 'marcelo', 'bruno', 'eduardo', 'felipe', 'raimundo', 'rodrigo',
  'manoel', 'mateus', 'andre', 'fernando', 'fabio', 'leonardo', 'gustavo', 'guilherme', 'leandro', 'tiago',
  'anderson', 'alessandro', 'alberto', 'ricardo', 'marcio', 'jorge', 'sebastiao', 'alexandre', 'roberto', 'edson',
  'diego', 'vitor', 'sergio', 'claudio', 'matheus', 'thiago', 'geraldo', 'luciano', 'julio', 'ronaldo',
  'adriano', 'flavio', 'henrique', 'gilberto', 'valdir', 'robson', 'cesar', 'caio', 'vinicius', 'renato',
  'cleber', 'denis', 'reginaldo', 'mauro', 'wagner', 'elias', 'valter', 'renan', 'fabiano', 'humberto',
  'samuel', 'david', 'igor', 'otavio', 'otávio', 'arthur', 'artur', 'bernardo', 'heitor', 'davi', 'luan',
  'breno', 'caua', 'cauã', 'enzo', 'miguel', 'nicolas', 'murilo', 'yuri', 'erick', 'isaac', 'alvaro', 'álvaro',
  'cristiano', 'jailson', 'ademir', 'odair', 'nilton', 'newton', 'walter', 'clovis', 'clóvis', 'osvaldo',
  'wilson', 'milton', 'nelson', 'almir', 'airton', 'ayrton', 'rubens', 'evaldo', 'everaldo', 'osmar',
  'genivaldo', 'valdemar', 'valdecir', 'waldemar', 'claudemir', 'rosevaldo', 'sebastiao', 'vanderlei', 'wanderley'
]);

function inferirGenero(nome) {
  if (!nome) return 'Não informado';
  const clean = nome.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const semTitulo = clean.replace(/^(dr\.|dra\.|prof\.|profa\.|pastor|pastora|cabo|sargento|coronel|delegado|delegada|padre|irma|irmao|irmã|irmão|bispo|bispa|vereador|vereadora|deputado|deputada)\s+/i, '');
  const primeiroNome = semTitulo.split(/\s+/)[0];

  if (FEMALE_NAMES.has(primeiroNome)) return 'Feminino';
  if (MALE_NAMES.has(primeiroNome)) return 'Masculino';

  if (primeiroNome.endsWith('a') && !['lucas', 'jonas', 'elias', 'matias', 'dimas', 'barnabas', 'tobias', 'sousa', 'souza', 'costa', 'silva', 'franca'].includes(primeiroNome)) {
    return 'Feminino';
  }
  if (primeiroNome.endsWith('o') || primeiroNome.endsWith('or') || primeiroNome.endsWith('on') || primeiroNome.endsWith('os') || primeiroNome.endsWith('el')) {
    return 'Masculino';
  }
  return 'Não informado';
}

function fetchFacts(url) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) {
      return resolve({ ok: false, motivo: 'URL inválida' });
    }

    const req = https.get(url, { agent, headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return resolve({ ok: false, status: res.statusCode });
        }

        const factMatches = [...data.matchAll(/<dt class="glb-qee-detail__fact-label">([^<]+)<\/dt>\s*<dd class="glb-qee-detail__fact-value">([^<]+)<\/dd>/gi)];
        let profissao = null;
        let cor_etnia = null;
        let grau_instrucao = null;

        for (const m of factMatches) {
          const label = m[1].trim().toLowerCase();
          const val = m[2].trim();
          if (label.includes('profiss')) profissao = val;
          else if (label.includes('etnia') || label.includes('cor')) cor_etnia = val;
          else if (label.includes('instru')) grau_instrucao = val;
        }

        resolve({
          ok: true,
          profissao,
          cor_etnia,
          grau_instrucao
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

async function processarCargo(cargoNome) {
  console.log(`\n=== PROCESSANDO DADOS PESSOAIS PARA ${cargoNome.toUpperCase()} ===`);

  const query = `SELECT id, nome, perfil_g1_url FROM eleicoes.candidatos WHERE cargo='${cargoNome}' AND (profissao IS NULL OR cor_etnia IS NULL OR grau_instrucao IS NULL) ORDER BY id ASC;`;
  const tsv = execSync(`"${MYSQL_BIN}" -u root --default-character-set=utf8mb4 -e "${query}"`, { maxBuffer: 10 * 1024 * 1024 }).toString('utf8');
  const lines = tsv.split('\n').filter(Boolean).slice(1);

  const candidatos = lines.map(line => {
    const parts = line.split('\t');
    return {
      id: parseInt(parts[0], 10),
      nome: parts[1],
      perfil_g1_url: parts[2]?.trim()
    };
  }).filter(c => c.id && c.perfil_g1_url);

  console.log(`Total de candidaturas pendentes em ${cargoNome}: ${candidatos.length}`);

  if (candidatos.length === 0) {
    console.log(`Todos os candidatos de ${cargoNome} já possuem dados pessoais!`);
    return;
  }

  const CONCORRENCIA = 30;
  const CHUNK_FLUSH = 100;
  let processados = 0;
  let sucessos = 0;
  let bufferSql = [];

  async function flushBuffer() {
    if (bufferSql.length === 0) return;
    const sqlToRun = `START TRANSACTION;\n` + bufferSql.join('\n') + `\nCOMMIT;\n`;
    bufferSql = [];
    executeSql(sqlToRun);
  }

  const fila = [...candidatos];
  const startTime = Date.now();

  async function worker() {
    while (fila.length > 0) {
      const c = fila.shift();
      if (!c) break;

      let res = await fetchFacts(c.perfil_g1_url);
      if (!res.ok) {
        await new Promise(r => setTimeout(r, 250));
        res = await fetchFacts(c.perfil_g1_url);
      }

      processados++;
      const genero = inferirGenero(c.nome);

      if (res.ok) {
        sucessos++;
        const prof = escapeSql(res.profissao);
        const etnia = escapeSql(res.cor_etnia);
        const inst = escapeSql(res.grau_instrucao);
        const gen = escapeSql(genero);

        bufferSql.push(`UPDATE candidatos SET profissao = ${prof}, cor_etnia = ${etnia}, grau_instrucao = ${inst}, genero = ${gen} WHERE id = ${c.id};`);
      } else {
        const gen = escapeSql(genero);
        bufferSql.push(`UPDATE candidatos SET genero = ${gen} WHERE id = ${c.id};`);
      }

      if (bufferSql.length >= CHUNK_FLUSH) {
        await flushBuffer();
      }

      if (processados % 250 === 0 || processados === candidatos.length) {
        const elapsed = (Date.now() - startTime) / 1000;
        const speed = (processados / elapsed).toFixed(1);
        const remaining = ((candidatos.length - processados) / (processados / elapsed)).toFixed(0);
        console.log(`[${cargoNome}] ${processados}/${candidatos.length} (${((processados/candidatos.length)*100).toFixed(1)}%) | Velocidade: ${speed} req/s | Restante: ~${remaining}s`);
      }
    }
  }

  const workers = Array.from({ length: CONCORRENCIA }, () => worker());
  await Promise.all(workers);
  await flushBuffer();

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`Concluído ${cargoNome}: ${processados} processados em ${totalTime}s (Sucessos: ${sucessos})`);
}

async function atualizarGenerosGerais() {
  console.log(`\n=== ATUALIZANDO GÊNERO NAS DEMAIS CANDIDATURAS (PRESIDENTE, GOVERNADOR, SENADOR) ===`);
  const query = `SELECT id, nome FROM eleicoes.candidatos WHERE genero IS NULL OR genero = '' OR genero = 'Não informado' ORDER BY id ASC;`;
  const tsv = execSync(`"${MYSQL_BIN}" -u root --default-character-set=utf8mb4 -e "${query}"`, { maxBuffer: 10 * 1024 * 1024 }).toString('utf8');
  const lines = tsv.split('\n').filter(Boolean).slice(1);

  console.log(`Total de candidaturas para verificar gênero: ${lines.length}`);
  let buffer = [];
  for (const l of lines) {
    const [id, nome] = l.split('\t');
    const gen = inferirGenero(nome);
    if (gen && gen !== 'Não informado') {
      buffer.push(`UPDATE candidatos SET genero = '${gen}' WHERE id = ${id};`);
    }
  }
  if (buffer.length > 0) {
    const sqlToRun = `START TRANSACTION;\n` + buffer.join('\n') + `\nCOMMIT;\n`;
    executeSql(sqlToRun);
    console.log(`Gêneros atualizados: ${buffer.length}`);
  }
}

async function main() {
  await processarCargo('dep-estadual');
  await processarCargo('dep-federal');
  await atualizarGenerosGerais();
  console.log('\n=============================================================');
  console.log('ENRIQUECIMENTO COMPLETO DE DADOS PESSOAIS FINALIZADO COM SUCESSO!');
}

main().catch(err => {
  console.error('ERRO FATAL:', err);
  process.exit(1);
});
