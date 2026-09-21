<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\CandidatoModel;
use CodeIgniter\HTTP\ResponseInterface;

class Rankings extends BaseController
{
    private const CAMPOS_RANKING = 'id, slug, nome, partido, numero, uf, cargo, foto_local, foto_url_original';

    private function responderComCache(array $dados): ResponseInterface
    {
        $json = json_encode($dados);
        return $this->response
            ->setHeader('Cache-Control', 'public, max-age=180, stale-while-revalidate=300')
            ->setHeader('X-Total-Count', (string) count($dados))
            ->setHeader('ETag', '"' . md5($json) . '"')
            ->setContentType('application/json')
            ->setBody($json);
    }

    public function patrimonio(): ResponseInterface
    {
        $cargo  = $this->request->getGet('cargo') ?? 'presidente';
        $uf     = trim((string) ($this->request->getGet('uf') ?? ''));
        $limite = (int) ($this->request->getGet('limite') ?? 13);
        $limite = max(1, min($limite, 100));

        $builder = (new CandidatoModel())
            ->select(self::CAMPOS_RANKING . ', patrimonio_total')
            ->where('cargo', $cargo);
        if ($uf !== '') {
            $builder = $builder->where('uf', $uf);
        }
        $rows = $builder->orderBy('patrimonio_total', 'DESC')->findAll($limite);

        return $this->responderComCache($rows);
    }

    public function receitas(): ResponseInterface
    {
        $cargo  = $this->request->getGet('cargo') ?? 'presidente';
        $uf     = trim((string) ($this->request->getGet('uf') ?? ''));
        $limite = (int) ($this->request->getGet('limite') ?? 13);
        $limite = max(1, min($limite, 100));

        $builder = (new CandidatoModel())
            ->select(self::CAMPOS_RANKING . ', receitas_total')
            ->where('cargo', $cargo);
        if ($uf !== '') {
            $builder = $builder->where('uf', $uf);
        }
        $rows = $builder->orderBy('receitas_total', 'DESC')->findAll($limite);

        return $this->responderComCache($rows);
    }

    public function gastos(): ResponseInterface
    {
        $cargo  = $this->request->getGet('cargo') ?? 'presidente';
        $uf     = trim((string) ($this->request->getGet('uf') ?? ''));
        $limite = (int) ($this->request->getGet('limite') ?? 13);
        $limite = max(1, min($limite, 100));

        $builder = (new CandidatoModel())
            ->select(self::CAMPOS_RANKING . ', despesas_total')
            ->where('cargo', $cargo);
        if ($uf !== '') {
            $builder = $builder->where('uf', $uf);
        }
        $rows = $builder->orderBy('despesas_total', 'DESC')->findAll($limite);

        return $this->responderComCache($rows);
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
                      COALESCE(d.valor, (c.receitas_total * d.percentual / 100), 0) as valor_calculado', false)
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

        return $this->responderComCache($rows);
    }
}

