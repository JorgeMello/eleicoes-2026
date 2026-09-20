<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Libraries\PesquisaImporter;
use App\Models\PesquisaModel;
use App\Models\PesquisaResultadoModel;
use CodeIgniter\HTTP\ResponseInterface;

class Pesquisas extends BaseController
{
    private function baseQuery()
    {
        $cargo     = $this->request->getGet('cargo') ?? 'presidente';
        $uf        = $this->request->getGet('uf');
        $instituto = trim((string) ($this->request->getGet('instituto') ?? ''));
        $tipo      = trim((string) ($this->request->getGet('tipo') ?? ''));

        $builder = (new PesquisaModel())
            ->select('pesquisas.*, institutos.nome AS instituto')
            ->join('institutos', 'institutos.id = pesquisas.instituto_id')
            ->where('cargo', $cargo)
            ->orderBy('data_fim', 'DESC');

        if ($uf) {
            $builder = $builder->where('uf', $uf);
        }
        if ($instituto !== '') {
            $builder = $builder->where('institutos.nome', $instituto);
        }
        if ($tipo !== '') {
            $builder = $builder->where('tipo', $tipo);
        }

        return $builder;
    }

    public function index(): ResponseInterface
    {
        return $this->response->setJSON($this->baseQuery()->findAll());
    }

    public function show(int $id): ResponseInterface
    {
        $pesquisa = (new PesquisaModel())
            ->select('pesquisas.*, institutos.nome AS instituto')
            ->join('institutos', 'institutos.id = pesquisas.instituto_id')
            ->find($id);

        if (! $pesquisa) {
            return $this->response->setStatusCode(404)->setJSON(['erro' => 'Pesquisa não encontrada']);
        }

        $resultados = (new PesquisaResultadoModel())
            ->select('pesquisa_resultados.*, candidatos.slug AS candidato_slug')
            ->join('candidatos', 'candidatos.id = pesquisa_resultados.candidato_id', 'left')
            ->where('pesquisa_id', $id)
            ->orderBy('percentual', 'DESC')
            ->findAll();

        return $this->response->setJSON(['pesquisa' => $pesquisa, 'resultados' => $resultados]);
    }

    /** Séries temporais p/ o gráfico de evolução (uma entrada por pesquisa, com resultados). */
    public function evolucao(): ResponseInterface
    {
        $rows = $this->baseQuery()->orderBy('data_fim', 'ASC')->findAll();
        $resultadoModel = new PesquisaResultadoModel();

        foreach ($rows as &$p) {
            $p['resultados'] = $resultadoModel
                ->select('pesquisa_resultados.*, candidatos.slug AS candidato_slug')
                ->join('candidatos', 'candidatos.id = pesquisa_resultados.candidato_id', 'left')
                ->where('pesquisa_id', (int) $p['id'])
                ->orderBy('percentual', 'DESC')
                ->findAll();
        }

        return $this->response->setJSON($rows);
    }

    public function importar(): ResponseInterface
    {
        $esperada = trim((string) env('ELEICOES_API_KEY', ''));
        $recebida = trim((string) $this->request->getHeaderLine('X-API-Key'));

        if ($esperada === '' || ! hash_equals($esperada, $recebida)) {
            return $this->response->setStatusCode(401)->setJSON(['erro' => 'Acesso não autorizado: API key ausente ou inválida']);
        }

        $payload = $this->request->getJSON(true) ?? [];
        $lote    = $payload['lote'] ?? $payload;

        if (! is_array($lote) || $lote === []) {
            return $this->response->setStatusCode(422)->setJSON(['erro' => 'Corpo esperado: { "lote": [ ...pesquisas ] }']);
        }

        return $this->response->setJSON(PesquisaImporter::importar($lote));
    }
}
