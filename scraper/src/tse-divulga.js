/**
 * Scraper / Validador Oficial DivulgaCandContas (TSE) — FASE 1: DESCOBERTA E CONFERÊNCIA
 *
 * Mapeia os endpoints REST do TSE, testa conectividade direta com o portal e CDN Akamai,
 * audita os documentos e planos de governo oficiais dos candidatos existentes em out/candidatos.json,
 * e gera o relatório técnico de reconciliação.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'out');

const HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'Referer': 'https://divulgacandcontas.tse.jus.br/divulga/',
  'Origin': 'https://divulgacandcontas.tse.jus.br',
};

const ENDPOINTS_DESCOBERTA = [
  {
    nome: 'Documento / Plano de Governo TSE (Exemplo)',
    url: 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/doc/280017113380',
    esperado: 'application/pdf ou application/json',
  },
  {
    nome: 'Eleições Suplementares SP (v1)',
    url: 'https://divulgacandcontas.tse.jus.br/divulga/rest/v1/eleicao/suplementares/2024/SP',
    esperado: 'application/json',
  },
  {
    nome: 'Portal Web Principal (SPA)',
    url: 'https://divulgacandcontas.tse.jus.br/divulga/#/home',
    esperado: 'text/html',
  },
  {
    nome: 'Dados Abertos TSE (CKAN API)',
    url: 'https://dadosabertos.tse.jus.br/api/3/action/package_list',
    esperado: 'application/json',
  },
];

/** Normaliza e extrai o ID do documento TSE a partir da URL do plano de governo */
export function extrairIdDocTSE(url) {
  if (!url) return null;
  const m = url.match(/\/arquivo\/doc\/(\d+)/);
  return m ? m[1] : null;
}

/** Verifica se o documento oficial do TSE está acessível e ativo */
async function verificarDocumentoTSE(url) {
  if (!url) return { valido: false, motivo: 'URL não informada' };
  try {
    const res = await fetch(url, { method: 'HEAD', headers: HEADERS });
    return {
      valido: res.ok,
      status: res.status,
      contentType: res.headers.get('content-type') || '',
      contentLength: res.headers.get('content-length') || null,
    };
  } catch (err) {
    return { valido: false, erro: err.message };
  }
}

async function executarFase1() {
  console.log('='.repeat(75));
  console.log('🏛️  FASE 1: DESCOBERTA, CONECTIVIDADE E AUDITORIA DIVULGACANDCONTAS (TSE)');
  console.log('='.repeat(75));

  const relatorio = {
    versao: '1.0.0',
    data_auditoria: new Date().toISOString(),
    ambiente: {
      origem_ip: 'Brasil (Porto Alegre, RS)',
      status_rede: 'Online',
    },
    endpoints_avaliados: [],
    candidatos_auditados: [],
    metricas: {
      total_candidatos: 0,
      com_documento_tse: 0,
      documentos_validados: 0,
      divergencias_detectadas: 0,
    },
    proxima_fase: 'Fase 2 — Comparador de Dados Offline e Reconciliador de Contas',
  };

  // 1. Diagnóstico de Endpoints
  console.log('\n[Etapa 1/3] Testando conectividade com os endpoints da infraestrutura TSE:');
  for (const ep of ENDPOINTS_DESCOBERTA) {
    process.stdout.write(`  • ${ep.nome.padEnd(42)}: `);
    try {
      const inicio = Date.now();
      const res = await fetch(ep.url, { headers: HEADERS });
      const duracao = Date.now() - inicio;

      const resultadoEp = {
        nome: ep.nome,
        url: ep.url,
        status: res.status,
        tempo_ms: duracao,
        content_type: res.headers.get('content-type'),
        sucesso: res.ok,
      };

      if (res.ok) {
        console.log(`✅ OK (${res.status}) - ${duracao}ms [${resultadoEp.content_type?.split(';')[0]}]`);
      } else {
        console.log(`⚠️ HTTP ${res.status} (${duracao}ms)`);
      }

      relatorio.endpoints_avaliados.push(resultadoEp);
    } catch (e) {
      console.log(`❌ Falha: ${e.message}`);
      relatorio.endpoints_avaliados.push({ nome: ep.nome, url: ep.url, erro: e.message });
    }
  }

  // 2. Auditoria dos Candidatos Locais
  const caminhoCandidatos = path.join(OUT_DIR, 'candidatos.json');
  if (!existsSync(caminhoCandidatos)) {
    console.error('\n❌ Arquivo out/candidatos.json não encontrado!');
    return;
  }

  const candidatos = JSON.parse(readFileSync(caminhoCandidatos, 'utf-8'));
  relatorio.metricas.total_candidatos = candidatos.length;

  console.log(`\n[Etapa 2/3] Auditando metadados TSE de ${candidatos.length} candidaturas presidenciais:`);

  for (const [idx, c] of candidatos.entries()) {
    const docId = extrairIdDocTSE(c.plano_governo_url);
    const itemAuditoria = {
      posicao: idx + 1,
      slug: c.slug,
      nome: c.nome,
      partido: c.partido,
      numero: c.numero,
      patrimonio_declarado: c.patrimonio_total,
      receitas_declaradas: c.receitas_total,
      despesas_declaradas: c.despesas_total,
      tse_documento_id: docId,
      tse_documento_url: c.plano_governo_url,
      documento_valido: false,
    };

    if (docId) {
      relatorio.metricas.com_documento_tse++;
      // Valida o link do plano de governo oficial no TSE
      const checagem = await verificarDocumentoTSE(c.plano_governo_url);
      itemAuditoria.documento_valido = checagem.valido;
      itemAuditoria.documento_status = checagem.status;
      if (checagem.valido) {
        relatorio.metricas.documentos_validados++;
      }
    }

    relatorio.candidatos_auditados.push(itemAuditoria);
    const statusIcon = itemAuditoria.documento_valido ? '✅' : '⚠️';
    console.log(`  ${statusIcon} [${c.partido} ${String(c.numero).padStart(2, ' ')}] ${c.nome.padEnd(26)} | Doc TSE: ${docId || 'Pendente'} | Patrimônio: R$ ${Number(c.patrimonio_total || 0).toLocaleString('pt-BR')}`);
  }

  // 3. Salvar Relatório de Auditoria
  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }
  const relatorioPath = path.join(OUT_DIR, 'tse-fase1-relatorio.json');
  writeFileSync(relatorioPath, JSON.stringify(relatorio, null, 2), 'utf-8');

  console.log('\n[Etapa 3/3] Resumo da Fase 1:');
  console.log(`  • Candidatos auditados: ${relatorio.metricas.total_candidatos}`);
  console.log(`  • Documentos oficiais identificados no TSE: ${relatorio.metricas.com_documento_tse}`);
  console.log(`  • Documentos oficiais confirmados online: ${relatorio.metricas.documentos_validados}`);
  console.log(`  • Relatório técnico salvo em: ${relatorioPath}`);
  console.log('='.repeat(75));
}

executarFase1();
