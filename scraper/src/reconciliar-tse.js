/**
 * Scraper / Validador Oficial DivulgaCandContas (TSE) — FASE 2: RECONCILIAÇÃO E AUDITORIA CONTÁBIL
 *
 * Lê os dados oficiais consolidados em out/candidatos.json, executa checagens cruzadas de:
 * 1. Soma de bens declarados vs. Patrimônio Total;
 * 2. Balanço de campanha (Receitas vs. Despesas vs. Limite de Gastos do TSE);
 * 3. Validação documental de Doadores (CPFs/CNPJs) e Fornecedores;
 * 4. Geração do relatório final de reconciliação out/relatorio-validacao-tse.json.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'out');

/** Valida o formato básico de CPF (11 dígitos) ou CNPJ (14 dígitos) */
function validarFormatoDoc(doc) {
  if (!doc) return { valido: false, tipo: 'Sem documento' };
  const limpo = String(doc).replace(/\D/g, '');
  if (limpo.length === 11) return { valido: true, tipo: 'CPF (Pessoa Física)' };
  if (limpo.length === 14) return { valido: true, tipo: 'CNPJ (Pessoa Jurídica / Partido)' };
  return { valido: false, tipo: 'Inválido' };
}

export async function reconciliar() {
  console.log('='.repeat(80));
  console.log('⚖️   FASE 2: RECONCILIAÇÃO E AUDITORIA CONTÁBIL DOS DADOS DO TSE');
  console.log('='.repeat(80));

  const caminhoCandidatos = path.join(OUT_DIR, 'candidatos.json');
  if (!existsSync(caminhoCandidatos)) {
    console.error('❌ Arquivo out/candidatos.json não encontrado!');
    return;
  }

  const candidatos = JSON.parse(readFileSync(caminhoCandidatos, 'utf-8'));

  const relatorio = {
    versao: '2.0.0',
    data_reconciliacao: new Date().toISOString(),
    resumo_global: {
      total_candidatos: candidatos.length,
      patrimonio_total_declarado: 0,
      receitas_totais_declaradas: 0,
      despesas_totais_declaradas: 0,
      limite_gastos_total: 0,
      candidatos_dentro_do_limite_tse: 0,
      candidatos_com_superavit_parcial: 0,
      candidatos_com_deficit_parcial: 0,
      total_bens_auditados: 0,
      total_doadores_auditados: 0,
      total_fornecedores_auditados: 0,
      divergencias_contabeis: [],
    },
    candidatos_reconciliados: [],
  };

  console.log(`\n🔍 Auditando ${candidatos.length} candidaturas presidenciais com regras oficiais do TSE...\n`);

  for (const [idx, c] of candidatos.entries()) {
    const bens = Array.isArray(c.bens) ? c.bens : [];
    const doadores = Array.isArray(c.doadores) ? c.doadores : [];
    const gastos = Array.isArray(c.gastos) ? c.gastos : [];

    // 1. Auditoria da Soma dos Bens
    const somaBensCalculada = bens.reduce((acc, b) => acc + (Number(b.valor) || 0), 0);
    const patrimonioDeclarado = Number(c.patrimonio_total || 0);
    const difPatrimonio = Math.abs(somaBensCalculada - patrimonioDeclarado);
    const patrimonioConsistente = difPatrimonio < 1.0; // tolerância de R$ 1,00 para arredondamento de centavos

    // 2. Auditoria Contábil de Campanha
    const receitas = Number(c.receitas_total || 0);
    const despesas = Number(c.despesas_total || 0);
    const limiteGastos = Number(c.limite_gastos || 0);
    const saldoCampanha = receitas - despesas;
    const dentroDoLimiteTSE = despesas <= limiteGastos || limiteGastos === 0;
    const situacaoCaixa = saldoCampanha >= 0 ? 'SUPERAVIT_OU_NEUTRO' : 'DEFICIT_PARCIAL';

    // 3. Auditoria de Doadores e Documentos
    const doadoresAuditados = doadores.map((d) => {
      const docInfo = validarFormatoDoc(d.documento);
      const perc = Number(d.percentual || 0);
      const valorEstimado = receitas > 0 ? (receitas * perc) / 100 : 0;
      return {
        nome: d.nome,
        documento: d.documento,
        tipo_documento: docInfo.tipo,
        documento_valido: docInfo.valido,
        percentual: perc,
        valor_estimado: valorEstimado,
      };
    });

    // 4. Auditoria de Fornecedores / Gastos
    const gastosAuditados = gastos.map((g) => {
      const docInfo = validarFormatoDoc(g.documento);
      const perc = Number(g.percentual || 0);
      const valorEstimado = despesas > 0 ? (despesas * perc) / 100 : 0;
      return {
        nome: g.nome,
        documento: g.documento,
        tipo_documento: docInfo.tipo,
        documento_valido: docInfo.valido,
        percentual: perc,
        valor_estimado: valorEstimado,
      };
    });

    // Atualiza Métricas Globais
    relatorio.resumo_global.patrimonio_total_declarado += patrimonioDeclarado;
    relatorio.resumo_global.receitas_totais_declaradas += receitas;
    relatorio.resumo_global.despesas_totais_declaradas += despesas;
    relatorio.resumo_global.limite_gastos_total += limiteGastos;
    relatorio.resumo_global.total_bens_auditados += bens.length;
    relatorio.resumo_global.total_doadores_auditados += doadores.length;
    relatorio.resumo_global.total_fornecedores_auditados += gastos.length;

    if (dentroDoLimiteTSE) relatorio.resumo_global.candidatos_dentro_do_limite_tse++;
    if (situacaoCaixa === 'SUPERAVIT_OU_NEUTRO') relatorio.resumo_global.candidatos_com_superavit_parcial++;
    else relatorio.resumo_global.candidatos_com_deficit_parcial++;

    if (!patrimonioConsistente) {
      relatorio.resumo_global.divergencias_contabeis.push({
        candidato: c.nome,
        partido: c.partido,
        declarado: patrimonioDeclarado,
        soma_itens: somaBensCalculada,
        diferenca: difPatrimonio,
      });
    }

    const itemReconciliado = {
      posicao: idx + 1,
      slug: c.slug,
      nome: c.nome,
      partido: c.partido,
      numero: c.numero,
      tse_documento_id: c.plano_governo_url?.match(/\/arquivo\/doc\/(\d+)/)?.[1] || null,
      auditoria_bens: {
        total_itens: bens.length,
        patrimonio_declarado: patrimonioDeclarado,
        soma_itens_calculada: somaBensCalculada,
        consistente: patrimonioConsistente,
        diferenca: difPatrimonio,
      },
      auditoria_campanha: {
        receitas_total: receitas,
        despesas_total: despesas,
        limite_tse: limiteGastos,
        saldo_campanha: saldoCampanha,
        situacao_caixa: situacaoCaixa,
        dentro_do_limite_tse: dentroDoLimiteTSE,
        percentual_gasto_do_teto: limiteGastos > 0 ? (despesas / limiteGastos) * 100 : 0,
      },
      total_doadores: doadores.length,
      total_fornecedores: gastos.length,
      status_geral: patrimonioConsistente && dentroDoLimiteTSE ? 'CONFORME' : 'ALERTA',
    };

    relatorio.candidatos_reconciliados.push(itemReconciliado);

    // Impressão em linha
    const statusBens = patrimonioConsistente ? '✅ Bens OK' : `⚠️ Dif R$ ${difPatrimonio.toFixed(2)}`;
    const statusTeto = dentroDoLimiteTSE ? '✅ Teto OK' : '🚨 Estourou Teto';
    const statusSaldo = saldoCampanha >= 0 ? `+${(saldoCampanha / 1e6).toFixed(1)}M` : `${(saldoCampanha / 1e6).toFixed(1)}M (Dívida)`;

    console.log(
      `#${String(idx + 1).padStart(2, '0')} [${c.partido.padEnd(9, ' ')} ${String(c.numero).padStart(2, ' ')}] ` +
      `${c.nome.padEnd(25, ' ')} | ${statusBens.padEnd(14, ' ')} | ` +
      `Rec: R$ ${(receitas / 1e6).toFixed(1).padStart(5, ' ')}M | ` +
      `Desp: R$ ${(despesas / 1e6).toFixed(1).padStart(5, ' ')}M (${statusSaldo}) | ` +
      `${statusTeto}`
    );
  }

  // 5. Salvar Relatório de Reconciliação
  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }
  const relatorioPath = path.join(OUT_DIR, 'relatorio-validacao-tse.json');
  writeFileSync(relatorioPath, JSON.stringify(relatorio, null, 2), 'utf-8');

  console.log('\n' + '-'.repeat(80));
  console.log('📊 RESUMO CONSOLIDADO DA AUDITORIA CONTÁBIL:');
  console.log(`• Total de Candidaturas Auditadas: ${relatorio.resumo_global.total_candidatos}`);
  console.log(`• Total de Bens Verificados: ${relatorio.resumo_global.total_bens_auditados}`);
  console.log(`• Patrimônio Total Declarado Somado: R$ ${relatorio.resumo_global.patrimonio_total_declarado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  console.log(`• Receitas Totais Arrecadadas: R$ ${relatorio.resumo_global.receitas_totais_declaradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  console.log(`• Despesas Totais Contratadas: R$ ${relatorio.resumo_global.despesas_totais_declaradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  console.log(`• Candidaturas 100% Dentro do Teto de Gastos do TSE: ${relatorio.resumo_global.candidatos_dentro_do_limite_tse}/${relatorio.resumo_global.total_candidatos}`);
  console.log(`• Candidaturas com Saldo Positivo/Neutro: ${relatorio.resumo_global.candidatos_com_superavit_parcial}`);
  console.log(`• Candidaturas com Déficit Temporário (despesas > receitas): ${relatorio.resumo_global.candidatos_com_deficit_parcial}`);
  console.log(`• Fornecedores Auditados: ${relatorio.resumo_global.total_fornecedores_auditados}`);
  console.log(`• Doadores Auditados: ${relatorio.resumo_global.total_doadores_auditados}`);
  console.log(`\n💾 Relatório salvo com sucesso em: ${relatorioPath}`);
  console.log('='.repeat(80));
}

reconciliar();
