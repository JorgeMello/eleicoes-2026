<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\DoadorModel;
use App\Models\GastoModel;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Dossiê fase 1: agregado interno por documento (só dígitos).
 * Liga doadores/gastos de todos os candidatos que citam o mesmo CNPJ/CPF.
 */
class Empresas extends BaseController
{
    public function show(string $doc): ResponseInterface
    {
        $doc = preg_replace('/\D/', '', $doc);

        if ($doc === '' || strlen($doc) > 20) {
            return $this->response->setStatusCode(422)->setJSON(['erro' => 'Documento inválido']);
        }

        $doadores = (new DoadorModel())
            ->select("doadores.*, candidatos.slug AS candidato_slug, candidatos.nome AS candidato_nome, candidatos.partido, candidatos.cargo, candidatos.uf, 'doador' AS tipo")
            ->join('candidatos', 'candidatos.id = doadores.candidato_id')
            ->where('doadores.documento', $doc)
            ->orderBy('percentual', 'DESC')
            ->findAll();

        $gastos = (new GastoModel())
            ->select("gastos.*, candidatos.slug AS candidato_slug, candidatos.nome AS candidato_nome, candidatos.partido, candidatos.cargo, candidatos.uf, 'gasto' AS tipo")
            ->join('candidatos', 'candidatos.id = gastos.candidato_id')
            ->where('gastos.documento', $doc)
            ->orderBy('percentual', 'DESC')
            ->findAll();

        $todas = array_merge($doadores, $gastos);
        $nomes = array_values(array_unique(array_column($todas, 'nome')));

        return $this->response->setJSON([
            'documento'   => $doc,
            'tipo_doc'    => strlen($doc) === 14 ? 'CNPJ' : (strlen($doc) === 11 ? 'CPF' : '—'),
            'nomes'       => $nomes,
            'ocorrencias' => $todas,
        ]);
    }
}
