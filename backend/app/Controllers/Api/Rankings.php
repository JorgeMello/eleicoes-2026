<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\CandidatoModel;
use CodeIgniter\HTTP\ResponseInterface;

class Rankings extends BaseController
{
    public function patrimonio(): ResponseInterface
    {
        $cargo  = $this->request->getGet('cargo') ?? 'presidente';
        $limite = (int) ($this->request->getGet('limite') ?? 13);
        $limite = max(1, min($limite, 100));

        $rows = (new CandidatoModel())
            ->where('cargo', $cargo)
            ->orderBy('patrimonio_total', 'DESC')
            ->findAll($limite);

        return $this->response->setJSON($rows);
    }

    public function receitas(): ResponseInterface
    {
        $cargo  = $this->request->getGet('cargo') ?? 'presidente';
        $limite = (int) ($this->request->getGet('limite') ?? 13);
        $limite = max(1, min($limite, 100));

        $rows = (new CandidatoModel())
            ->where('cargo', $cargo)
            ->orderBy('receitas_total', 'DESC')
            ->findAll($limite);

        return $this->response->setJSON($rows);
    }
}
