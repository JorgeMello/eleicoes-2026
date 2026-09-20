<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\BemModel;
use App\Models\CandidaturaAnteriorModel;
use App\Models\CandidatoModel;
use App\Models\CandidatoTseModel;
use App\Models\DoadorModel;
use App\Models\GastoModel;
use CodeIgniter\HTTP\ResponseInterface;

class Candidatos extends BaseController
{
    public function index(): ResponseInterface
    {
        $model = new CandidatoModel();
        $cargo      = $this->request->getGet('cargo') ?? 'presidente';
        $busca      = trim((string) ($this->request->getGet('busca') ?? ''));
        $partido    = trim((string) ($this->request->getGet('partido') ?? ''));
        $profissao  = trim((string) ($this->request->getGet('profissao') ?? ''));
        $instrucao  = trim((string) ($this->request->getGet('instrucao') ?? ''));
        $cor        = trim((string) ($this->request->getGet('cor') ?? ''));
        $uf         = trim((string) ($this->request->getGet('uf') ?? ''));
        $ordenar    = $this->request->getGet('ordenar') ?? 'nome';

        $builder = $model->select('candidatos.*, candidatos_tse.status_geral as tse_status, candidatos_tse.situacao_registro as tse_situacao, candidatos_tse.cnpj_campanha as tse_cnpj, candidatos_tse.percentual_gasto_teto as tse_percentual_teto, candidatos_tse.validado_em as tse_validado_em')
            ->join('candidatos_tse', 'candidatos_tse.candidato_id = candidatos.id', 'left')
            ->where('candidatos.cargo', $cargo);

        if ($uf !== '') {
            $builder = $builder->where('candidatos.uf', $uf);
        }

        if ($busca !== '') {
            $builder = $builder->groupStart()
                ->like('nome', $busca)
                ->orLike('numero', $busca)
                ->groupEnd();
        }
        if ($partido !== '') {
            $builder = $builder->where('partido', $partido);
        }
        if ($profissao !== '') {
            $builder = $builder->where('profissao', $profissao);
        }
        if ($instrucao !== '') {
            $builder = $builder->where('grau_instrucao', $instrucao);
        }
        if ($cor !== '') {
            $builder = $builder->where('cor_etnia', $cor);
        }
        $patMin = trim((string) ($this->request->getGet('patrimonio_min') ?? ''));
        $patMax = trim((string) ($this->request->getGet('patrimonio_max') ?? ''));
        if ($patMin !== '' && is_numeric($patMin)) {
            $builder = $builder->where('patrimonio_total >=', (float) $patMin);
        }
        if ($patMax !== '' && is_numeric($patMax)) {
            $builder = $builder->where('patrimonio_total <=', (float) $patMax);
        }

        $orderMap = [
            'nome'            => ['nome', 'ASC'],
            'numero'          => ['numero', 'ASC'],
            'patrimonio_desc' => ['patrimonio_total', 'DESC'],
            'patrimonio_asc'  => ['patrimonio_total', 'ASC'],
        ];
        [$col, $dir] = $orderMap[$ordenar] ?? $orderMap['nome'];
        $rows = $builder->orderBy($col, $dir)->findAll();

        return $this->response->setJSON($rows);
    }

    public function show(string $slug): ResponseInterface
    {
        $model = new CandidatoModel();
        $candidato = $model->where('slug', $slug)->first();

        if (! $candidato) {
            return $this->response->setStatusCode(404)->setJSON(['erro' => 'Candidato não encontrado']);
        }

        $id = (int) $candidato['id'];

        return $this->response->setJSON([
            'candidato' => $candidato,
            'tse'       => (new CandidatoTseModel())->where('candidato_id', $id)->first(),
            'bens'      => (new BemModel())->where('candidato_id', $id)->orderBy('valor', 'DESC')->findAll(),
            'historico' => (new CandidaturaAnteriorModel())->where('candidato_id', $id)->orderBy('ano', 'DESC')->findAll(),
            'doadores'  => (new DoadorModel())->where('candidato_id', $id)->orderBy('percentual', 'DESC')->findAll(),
            'gastos'    => (new GastoModel())->where('candidato_id', $id)->orderBy('percentual', 'DESC')->findAll(),
        ]);
    }

    public function bens(string $slug): ResponseInterface
    {
        $model = new CandidatoModel();
        $candidato = $model->where('slug', $slug)->first();

        if (! $candidato) {
            return $this->response->setStatusCode(404)->setJSON(['erro' => 'Candidato não encontrado']);
        }

        $bens = (new BemModel())->where('candidato_id', (int) $candidato['id'])->orderBy('valor', 'DESC')->findAll();

        return $this->response->setJSON($bens);
    }
}
