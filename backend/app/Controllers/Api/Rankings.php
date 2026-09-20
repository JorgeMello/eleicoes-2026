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
        $uf     = trim((string) ($this->request->getGet('uf') ?? ''));
        $limite = (int) ($this->request->getGet('limite') ?? 13);
        $limite = max(1, min($limite, 100));

        $builder = (new CandidatoModel())->where('cargo', $cargo);
        if ($uf !== '') {
            $builder = $builder->where('uf', $uf);
        }
        $rows = $builder->orderBy('patrimonio_total', 'DESC')->findAll($limite);

        return $this->response->setJSON($rows);
    }

    public function receitas(): ResponseInterface
    {
        $cargo  = $this->request->getGet('cargo') ?? 'presidente';
        $uf     = trim((string) ($this->request->getGet('uf') ?? ''));
        $limite = (int) ($this->request->getGet('limite') ?? 13);
        $limite = max(1, min($limite, 100));

        $builder = (new CandidatoModel())->where('cargo', $cargo);
        if ($uf !== '') {
            $builder = $builder->where('uf', $uf);
        }
        $rows = $builder->orderBy('receitas_total', 'DESC')->findAll($limite);

        return $this->response->setJSON($rows);
    }

    public function gastos(): ResponseInterface
    {
        $cargo  = $this->request->getGet('cargo') ?? 'presidente';
        $uf     = trim((string) ($this->request->getGet('uf') ?? ''));
        $limite = (int) ($this->request->getGet('limite') ?? 13);
        $limite = max(1, min($limite, 100));

        $builder = (new CandidatoModel())->where('cargo', $cargo);
        if ($uf !== '') {
            $builder = $builder->where('uf', $uf);
        }
        $rows = $builder->orderBy('despesas_total', 'DESC')->findAll($limite);

        return $this->response->setJSON($rows);
    }

    public function doadores(): ResponseInterface
    {
        $cargo  = $this->request->getGet('cargo') ?? 'presidente';
        $uf     = trim((string) ($this->request->getGet('uf') ?? ''));
        $limite = (int) ($this->request->getGet('limite') ?? 13);
        $limite = max(1, min($limite, 100));

        $db = \Config\Database::connect();
        $builder = $db->table('doadores d')
            ->select('d.id, d.nome, d.documento, d.valor, d.percentual,
                      c.id as candidato_id, c.nome as candidato_nome, c.partido as candidato_partido,
                      c.numero as candidato_numero, c.slug as candidato_slug, c.receitas_total,
                      CASE
                        WHEN d.valor IS NOT NULL AND d.valor > 0 THEN d.valor
                        WHEN c.receitas_total IS NOT NULL AND d.percentual IS NOT NULL THEN (c.receitas_total * d.percentual / 100)
                        ELSE 0
                      END as valor_calculado', false)
            ->join('candidatos c', 'c.id = d.candidato_id')
            ->where('c.cargo', $cargo);

        if ($uf !== '') {
            $builder->where('c.uf', $uf);
        }

        $rows = $builder->orderBy('valor_calculado', 'DESC')
            ->orderBy('d.percentual', 'DESC')
            ->limit($limite)
            ->get()
            ->getResultArray();

        foreach ($rows as &$r) {
            $r['valor_calculado'] = (float) $r['valor_calculado'];
            $r['percentual']      = $r['percentual'] !== null ? (float) $r['percentual'] : null;
            if ($r['valor'] !== null) {
                $r['valor'] = (float) $r['valor'];
            }
            // Conformidade LGPD: Mascara CPF (11 dígitos) de pessoas físicas
            $docDigits = preg_replace('/\D/', '', (string) ($r['documento'] ?? ''));
            if (strlen($docDigits) === 11) {
                $r['documento'] = '***.' . substr($docDigits, 3, 3) . '.' . substr($docDigits, 6, 3) . '-**';
            }
        }
        unset($r);

        return $this->response->setJSON($rows);
    }
}
