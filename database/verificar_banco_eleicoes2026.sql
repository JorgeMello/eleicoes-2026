-- ==============================================================================
-- SCRIPT DE CONFERÊNCIA E AUDITORIA - BANCO DE DADOS ELEIÇÕES 2026
-- Compatível com: Local (XAMPP) e Servidor Web (Hostinger phpMyAdmin / MySQL CLI)
-- Base consolidada com as 27 UFs: 513 Candidatos e 615 Suplentes de Senador
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PAINEL CONSOLIDADO (Todas as métricas principais em 1 única linha)
-- ------------------------------------------------------------------------------
SELECT 
    (SELECT COUNT(*) FROM candidatos) AS total_candidatos,
    (SELECT COUNT(*) FROM candidato_suplentes) AS total_suplentes_senado,
    (SELECT COUNT(*) FROM candidatos_tse) AS total_auditoria_tse,
    (SELECT COUNT(*) FROM bens) AS total_bens,
    (SELECT COUNT(*) FROM doadores) AS total_doadores,
    (SELECT COUNT(*) FROM gastos) AS total_despesas_gastos;

-- ------------------------------------------------------------------------------
-- 2. AUDITORIA DAS 12 TABELAS COMPLETAS DO SISTEMA
-- ------------------------------------------------------------------------------
SELECT '1. candidatos' AS tabela, COUNT(*) AS total_registros, '513 candidaturas (13 Pres, 192 Gov, 308 Sen nas 27 UFs)' AS descricao FROM candidatos
UNION ALL
SELECT '2. candidato_suplentes', COUNT(*), '615 suplentes (308 primeiros e 307 segundos suplentes nas 27 UFs)' FROM candidato_suplentes
UNION ALL
SELECT '3. candidatos_tse', COUNT(*), '513 auditorias e tetos legais homologados' FROM candidatos_tse
UNION ALL
SELECT '4. bens', COUNT(*), '3.888 bens patrimoniais declarados' FROM bens
UNION ALL
SELECT '5. doadores', COUNT(*), '2.118 receitas e doações de campanha' FROM doadores
UNION ALL
SELECT '6. gastos', COUNT(*), '1.887 despesas e fornecedores declarados' FROM gastos
UNION ALL
SELECT '7. candidaturas_anteriores', COUNT(*), '111 históricos eleitorais prévios' FROM candidaturas_anteriores
UNION ALL
SELECT '8. pesquisas', COUNT(*), '11 levantamentos de intenção de voto' FROM pesquisas
UNION ALL
SELECT '9. pesquisa_resultados', COUNT(*), '73 percentuais estimulados' FROM pesquisa_resultados
UNION ALL
SELECT '10. institutos', COUNT(*), 'Institutos de pesquisa estatística' FROM institutos
UNION ALL
SELECT '11. coletas', COUNT(*), 'Logs de execução de scrapers' FROM coletas
UNION ALL
SELECT '12. migrations', COUNT(*), '15 migrações do CodeIgniter 4' FROM migrations;

-- ------------------------------------------------------------------------------
-- 3. AUDITORIA ELEITORAL POR CARGO E VALIDAÇÃO TSE (100% HOMOLOGADO)
-- ------------------------------------------------------------------------------
SELECT 
    c.cargo AS cargo,
    COUNT(c.id) AS total_candidatos,
    COUNT(DISTINCT c.uf) AS total_ufs,
    SUM(CASE WHEN t.id IS NOT NULL THEN 1 ELSE 0 END) AS homologados_tse,
    SUM(CASE WHEN c.cargo = 'senador' THEN (SELECT COUNT(*) FROM candidato_suplentes s WHERE s.candidato_id = c.id) ELSE 0 END) AS suplentes_vinculados
FROM candidatos c
LEFT JOIN candidatos_tse t ON t.candidato_id = c.id
GROUP BY c.cargo
ORDER BY FIELD(c.cargo, 'presidente', 'governador', 'senador');

-- ------------------------------------------------------------------------------
-- 4. CONFERÊNCIA DOS SUPLENTES DO SENADO (27 UFs)
-- ------------------------------------------------------------------------------
SELECT 
    CASE ordem 
        WHEN 1 THEN '1º Suplente'
        WHEN 2 THEN '2º Suplente'
        ELSE CONCAT(ordem, 'º Suplente')
    END AS tipo_suplente,
    COUNT(*) AS total_cadastrados
FROM candidato_suplentes
GROUP BY ordem;
