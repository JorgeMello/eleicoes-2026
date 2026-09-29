/**
 * Sincronizador Oficial dos Rankings de Doadores e Fornecedores do TSE
 * Fonte Direta: DivulgaCandContas (Endpoint que atualiza a cada 60 min)
 * URL de Origem: https://divulgacandcontas.tse.jus.br/divulga/#/consulta-individual/rank-doadores-fornecedores/20322002026/2026
 */

import { execSync } from 'node:child_process';
import { writeFileSync, unlinkSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MYSQL_BIN = 'c:\\xampp3\\mysql\\bin\\mysql.exe';
const ID_ELEICAO = '20322002026';
const ANO = '2026';

const HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'Referer': `https://divulgacandcontas.tse.jus.br/divulga/#/consulta-individual/rank-doadores-fornecedores/${ID_ELEICAO}/${ANO}`,
};

function executeSql(sql) {
  const tmp = path.join(__dirname, `tmp_sync_${Date.now()}_${Math.random().toString(36).slice(2)}.sql`);
  writeFileSync(tmp, sql, 'utf8');
  try {
    execSync(`"${MYSQL_BIN}" -u root --default-character-set=utf8mb4 eleicoes < "${tmp}"`);
  } finally {
    if (existsSync(tmp)) unlinkSync(tmp);
  }
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return await res.json();
}

async function main() {
  console.log(`=== SINCRONIZADOR OFICIAL TSE: RANKING DOADORES E FORNECEDORES ===`);
  console.log(`Eleição: ${ID_ELEICAO} · Ano: ${ANO}\n`);

  const baseUrl = 'https://divulgacandcontas.tse.jus.br/divulga/rest/v1/prestador';

  console.log('1. Coletando Totais Gerais do TSE...');
  const totais = await fetchJson(`${baseUrl}/ranks/total/${ID_ELEICAO}`);
  console.log(`   • Total Concentração Despesas: R$ ${Number(totais.totalConcentracaoDespesas).toLocaleString('pt-BR')}`);
  console.log(`   • Total Doações Pessoas Físicas: R$ ${Number(totais.totalDoacoes).toLocaleString('pt-BR')}`);
  console.log(`   • Total Fornecimentos: R$ ${Number(totais.totalFornecimentos).toLocaleString('pt-BR')}`);
  console.log(`   • Total Recursos Próprios: R$ ${Number(totais.totalRecursos).toLocaleString('pt-BR')}`);

  console.log('\n2. Coletando Ranking de Fornecedores (Despesas)...');
  const fornecedores = await fetchJson(`${baseUrl}/ranks/fornecedores/${ID_ELEICAO}/${ANO}`);
  console.log(`   • Obtidos: ${fornecedores.length} maiores fornecedores nacionais.`);

  console.log('\n3. Coletando Ranking de Doadores (Receitas)...');
  const doadores = await fetchJson(`${baseUrl}/ranks/doadores/${ID_ELEICAO}/${ANO}`);
  console.log(`   • Obtidos: ${doadores.length} maiores doadores nacionais.`);

  console.log('\n4. Coletando Concentração de Tipos de Despesas...');
  const concentracao = await fetchJson(`${baseUrl}/ranks/concentracao/${ID_ELEICAO}/${ANO}`);
  console.log(`   • Obtidas: ${concentracao.length} categorias de despesas.`);

  // Salvar no banco de dados local
  // Vamos vincular aos candidatos ou como ranking nacional referencial
  // Primeiro, buscamos um candidato_id referencial para armazenar ou enriquecer
  const sqlCommands = [];

  // Criar tabela ranking_tse_fornecedores e ranking_tse_doadores se não existirem, ou alimentar gastos e doadores
  sqlCommands.push(`
    CREATE TABLE IF NOT EXISTS ranking_tse_fornecedores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ordem INT NOT NULL,
      documento VARCHAR(20) NOT NULL,
      nome VARCHAR(255) NOT NULL,
      qtd_despesas INT DEFAULT 0,
      valor DECIMAL(15,2) NOT NULL,
      percentual DECIMAL(6,2) NOT NULL,
      ano INT DEFAULT 2026,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_doc (documento),
      INDEX idx_ordem (ordem)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  sqlCommands.push(`
    CREATE TABLE IF NOT EXISTS ranking_tse_doadores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ordem INT NOT NULL,
      documento VARCHAR(20) NOT NULL,
      nome VARCHAR(255) NOT NULL,
      qtd_doacoes INT DEFAULT 0,
      valor DECIMAL(15,2) NOT NULL,
      percentual DECIMAL(6,2) NOT NULL,
      ano INT DEFAULT 2026,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_doc (documento),
      INDEX idx_ordem (ordem)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  sqlCommands.push(`
    CREATE TABLE IF NOT EXISTS ranking_tse_totais (
      id INT PRIMARY KEY,
      total_concentracao_despesas DECIMAL(15,2),
      total_doacoes DECIMAL(15,2),
      total_fornecimentos DECIMAL(15,2),
      total_recursos DECIMAL(15,2),
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Inserir totais
  sqlCommands.push(`
    INSERT INTO ranking_tse_totais (id, total_concentracao_despesas, total_doacoes, total_fornecimentos, total_recursos)
    VALUES (1, ${totais.totalConcentracaoDespesas}, ${totais.totalDoacoes}, ${totais.totalFornecimentos}, ${totais.totalRecursos})
    ON DUPLICATE KEY UPDATE 
      total_concentracao_despesas = VALUES(total_concentracao_despesas),
      total_doacoes = VALUES(total_doacoes),
      total_fornecimentos = VALUES(total_fornecimentos),
      total_recursos = VALUES(total_recursos);
  `);

  // Truncar tabelas de ranking oficiais antes de reinserir
  sqlCommands.push(`TRUNCATE TABLE ranking_tse_fornecedores;`);
  for (const f of fornecedores) {
    const doc = String(f.cpfCpjFornecedor || '').replace(/\D/g, '');
    const nome = String(f.nomeFornecedor || '').replace(/'/g, "''");
    const valor = parseFloat(f.valor || 0);
    const perc = parseFloat(f.percentual || 0);
    const qtd = parseInt(f.qtDespesas || 0, 10);
    const ordem = parseInt(f.ordem || 0, 10);
    sqlCommands.push(`INSERT INTO ranking_tse_fornecedores (ordem, documento, nome, qtd_despesas, valor, percentual, ano) VALUES (${ordem}, '${doc}', '${nome}', ${qtd}, ${valor}, ${perc}, 2026);`);
  }

  sqlCommands.push(`TRUNCATE TABLE ranking_tse_doadores;`);
  for (const d of doadores) {
    const doc = String(d.cpfCnpjDoador || '').replace(/\D/g, '');
    const nome = String(d.nomeDoador || '').replace(/'/g, "''");
    const valor = parseFloat(d.valor || 0);
    const perc = parseFloat(d.percentual || 0);
    const qtd = parseInt(d.qtDoacoes || 0, 10);
    const ordem = parseInt(d.ordem || 0, 10);
    sqlCommands.push(`INSERT INTO ranking_tse_doadores (ordem, documento, nome, qtd_doacoes, valor, percentual, ano) VALUES (${ordem}, '${doc}', '${nome}', ${qtd}, ${valor}, ${perc}, 2026);`);
  }

  // Também verificar se algum fornecedor ou doador bate com a tabela de gastos e enriquecer com documento limpo
  for (const f of fornecedores) {
    const doc = String(f.cpfCpjFornecedor || '').replace(/\D/g, '');
    const nome = String(f.nomeFornecedor || '').replace(/'/g, "''");
    sqlCommands.push(`UPDATE gastos SET documento = '${doc}' WHERE documento IS NULL AND (LOWER(nome) = LOWER('${nome}') OR nome LIKE '${nome.slice(0, 20)}%');`);
  }

  console.log(`\n5. Gravando ${sqlCommands.length} comandos no banco de dados local...`);
  executeSql(`START TRANSACTION;\n${sqlCommands.join('\n')}\nCOMMIT;`);

  console.log(`\n✅ SINCRONIZAÇÃO OFICIAL CONCLUÍDA COM SUCESSO!`);
  console.log(`• ${fornecedores.length} Fornecedores oficiais do TSE salvos em ranking_tse_fornecedores`);
  console.log(`• ${doadores.length} Doadores oficiais do TSE salvos em ranking_tse_doadores`);
  console.log(`• Totais macroeconômicos do TSE gravados em ranking_tse_totais`);
}

main().catch(console.error);
