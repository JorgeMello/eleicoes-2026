<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class Estatisticas extends BaseController
{
    public const REGIOES_MAP = [
        'Sudeste'      => ['SP', 'MG', 'RJ', 'ES'],
        'Sul'          => ['RS', 'PR', 'SC'],
        'Nordeste'     => ['BA', 'PE', 'CE', 'MA', 'PB', 'RN', 'AL', 'PI', 'SE'],
        'Centro-Oeste' => ['GO', 'MT', 'MS', 'DF'],
        'Norte'        => ['PA', 'AM', 'RO', 'TO', 'AC', 'AP', 'RR'],
    ];

    public function index(): ResponseInterface
    {
        $cargo  = $this->request->getGet('cargo') ?? 'presidente';
        $uf     = trim((string) ($this->request->getGet('uf') ?? ''));
        $regiao = trim((string) ($this->request->getGet('regiao') ?? ''));

        $db = \Config\Database::connect();

        // Monta a cláusula WHERE base de forma segura e parametrizada
        $whereSql = 'WHERE cargo = ?';
        $params = [$cargo];

        if ($uf !== '') {
            if (str_contains($uf, ',')) {
                $ufs = array_filter(array_map('trim', explode(',', $uf)));
                if (!empty($ufs)) {
                    $inPlaceholders = implode(',', array_fill(0, count($ufs), '?'));
                    $whereSql .= " AND uf IN ($inPlaceholders)";
                    $params = array_merge($params, $ufs);
                }
            } else {
                $whereSql .= ' AND uf = ?';
                $params[] = $uf;
            }
        } elseif ($regiao !== '' && isset(self::REGIOES_MAP[$regiao])) {
            $ufs = self::REGIOES_MAP[$regiao];
            $inPlaceholders = implode(',', array_fill(0, count($ufs), '?'));
            $whereSql .= " AND uf IN ($inPlaceholders)";
            $params = array_merge($params, $ufs);
        }

        // 1. Resumo quantitativo e limites patrimoniais
        $sqlSummary = "SELECT COUNT(*) AS total, MAX(patrimonio_total) AS maior_pat, MIN(patrimonio_total) AS menor_pat FROM candidatos $whereSql";
        $summary = $db->query($sqlSummary, $params)->getRowArray();
        $total = (int) ($summary['total'] ?? 0);
        $maiorPat = $summary['maior_pat'] !== null ? (float) $summary['maior_pat'] : null;
        $menorPat = $summary['menor_pat'] !== null ? (float) $summary['menor_pat'] : null;

        // 2. Distribuição por Partido (agregação nativa em SQL B-Tree)
        $sqlPartido = "SELECT partido, COUNT(*) AS qtd FROM candidatos $whereSql AND partido IS NOT NULL AND partido != '' GROUP BY partido ORDER BY qtd DESC";
        $rowsPartido = $db->query($sqlPartido, $params)->getResultArray();
        $porPartido = [];
        foreach ($rowsPartido as $rp) {
            $porPartido[$rp['partido']] = (int) $rp['qtd'];
        }

        // 3. Distribuição por Profissão
        $sqlProfissao = "SELECT COALESCE(NULLIF(TRIM(profissao), ''), '—') AS item, COUNT(*) AS qtd FROM candidatos $whereSql GROUP BY item ORDER BY qtd DESC";
        $rowsProf = $db->query($sqlProfissao, $params)->getResultArray();
        $porProfissao = [];
        foreach ($rowsProf as $rp) {
            $porProfissao[$rp['item']] = (int) $rp['qtd'];
        }

        // 4. Distribuição por Grau de Instrução
        $sqlInstrucao = "SELECT COALESCE(NULLIF(TRIM(grau_instrucao), ''), '—') AS item, COUNT(*) AS qtd FROM candidatos $whereSql GROUP BY item ORDER BY qtd DESC";
        $rowsInst = $db->query($sqlInstrucao, $params)->getResultArray();
        $porInstrucao = [];
        foreach ($rowsInst as $ri) {
            $porInstrucao[$ri['item']] = (int) $ri['qtd'];
        }

        // 5. Distribuição por Cor / Etnia
        $sqlCor = "SELECT COALESCE(NULLIF(TRIM(cor_etnia), ''), '—') AS item, COUNT(*) AS qtd FROM candidatos $whereSql GROUP BY item ORDER BY qtd DESC";
        $rowsCor = $db->query($sqlCor, $params)->getResultArray();
        $porCor = [];
        foreach ($rowsCor as $rc) {
            $porCor[$rc['item']] = (int) $rc['qtd'];
        }

        $data = [
            'cargo'              => $cargo,
            'uf'                 => $uf !== '' ? $uf : null,
            'regiao'             => $regiao !== '' ? $regiao : null,
            'total'              => $total,
            'por_partido'        => $porPartido,
            'por_profissao'      => $porProfissao,
            'por_instrucao'      => $porInstrucao,
            'por_cor'            => $porCor,
            'maior_patrimonio'   => $maiorPat,
            'menor_patrimonio'   => $menorPat,
            'cargos_disponiveis' => ['presidente', 'governador', 'senador', 'dep-federal', 'dep-estadual'],
        ];

        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return $this->response
            ->setHeader('Cache-Control', 'public, max-age=180, stale-while-revalidate=300')
            ->setHeader('ETag', '"' . md5($json) . '"')
            ->setContentType('application/json')
            ->setBody($json);
    }
}
