<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\CandidatoModel;
use CodeIgniter\HTTP\ResponseInterface;

class Estatisticas extends BaseController
{
    public function index(): ResponseInterface
    {
        $cargo = $this->request->getGet('cargo') ?? 'presidente';
        $uf    = trim((string) ($this->request->getGet('uf') ?? ''));
        $model = new CandidatoModel();

        $builder = $model->where('cargo', $cargo);
        if ($uf !== '') {
            $builder = $builder->where('uf', $uf);
        }
        $rows = $builder->findAll();

        $porPartido = $porProfissao = $porInstrucao = $porCor = [];
        $patrimonios = [];

        foreach ($rows as $r) {
            $porPartido[$r['partido']]              = ($porPartido[$r['partido']] ?? 0) + 1;
            $porProfissao[$r['profissao'] ?? '—']   = ($porProfissao[$r['profissao'] ?? '—'] ?? 0) + 1;
            $porInstrucao[$r['grau_instrucao'] ?? '—'] = ($porInstrucao[$r['grau_instrucao'] ?? '—'] ?? 0) + 1;
            $porCor[$r['cor_etnia'] ?? '—']         = ($porCor[$r['cor_etnia'] ?? '—'] ?? 0) + 1;
            if ($r['patrimonio_total'] !== null) {
                $patrimonios[] = (float) $r['patrimonio_total'];
            }
        }

        $data = [
            'cargo'             => $cargo,
            'uf'                => $uf !== '' ? $uf : null,
            'total'             => count($rows),
            'por_partido'       => $porPartido,
            'por_profissao'     => $porProfissao,
            'por_instrucao'     => $porInstrucao,
            'por_cor'           => $porCor,
            'maior_patrimonio'  => $patrimonios ? max($patrimonios) : null,
            'menor_patrimonio'  => $patrimonios ? min($patrimonios) : null,
            'cargos_disponiveis'=> ['presidente', 'governador', 'senador', 'dep-federal', 'dep-estadual'],
        ];

        $json = json_encode($data);
        return $this->response
            ->setHeader('Cache-Control', 'public, max-age=180, stale-while-revalidate=300')
            ->setHeader('ETag', '"' . md5($json) . '"')
            ->setContentType('application/json')
            ->setBody($json);
    }
}
