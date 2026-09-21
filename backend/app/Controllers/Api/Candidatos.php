<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\BemModel;
use App\Models\CandidaturaAnteriorModel;
use App\Models\CandidatoModel;
use App\Models\CandidatoSuplenteModel;
use App\Models\CandidatoTseModel;
use App\Models\DoadorModel;
use App\Models\GastoModel;
use CodeIgniter\HTTP\ResponseInterface;

class Candidatos extends BaseController
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
        $model = new CandidatoModel();
        $cargo      = $this->request->getGet('cargo') ?? 'presidente';
        $busca      = trim((string) ($this->request->getGet('busca') ?? ''));
        $partido    = trim((string) ($this->request->getGet('partido') ?? ''));
        $profissao  = trim((string) ($this->request->getGet('profissao') ?? ''));
        $instrucao  = trim((string) ($this->request->getGet('instrucao') ?? ''));
        $cor        = trim((string) ($this->request->getGet('cor') ?? ''));
        $uf         = trim((string) ($this->request->getGet('uf') ?? ''));
        $regiao     = trim((string) ($this->request->getGet('regiao') ?? ''));
        $ordenar    = $this->request->getGet('ordenar') ?? 'nome';

        $builder = $model->select('candidatos.*, candidatos_tse.status_geral as tse_status, candidatos_tse.situacao_registro as tse_situacao, candidatos_tse.cnpj_campanha as tse_cnpj, candidatos_tse.percentual_gasto_teto as tse_percentual_teto, candidatos_tse.validado_em as tse_validado_em')
            ->join('candidatos_tse', 'candidatos_tse.candidato_id = candidatos.id', 'left')
            ->where('candidatos.cargo', $cargo);

        if ($uf !== '') {
            if (str_contains($uf, ',')) {
                $builder = $builder->whereIn('candidatos.uf', array_filter(array_map('trim', explode(',', $uf))));
            } else {
                $builder = $builder->where('candidatos.uf', $uf);
            }
        } elseif ($regiao !== '' && isset(self::REGIOES_MAP[$regiao])) {
            $builder = $builder->whereIn('candidatos.uf', self::REGIOES_MAP[$regiao]);
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

        $pageParam     = $this->request->getGet('page') ?? $this->request->getGet('pagina');
        $limiteParam   = $this->request->getGet('limite') ?? $this->request->getGet('limit') ?? $this->request->getGet('por_pagina');
        $envelopeParam = $this->request->getGet('envelope');

        $builder = $builder->orderBy($col, $dir);

        // Se parâmetros de paginação ou envelope forem fornecidos, ativa paginação com padrão ouro de 30 itens
        $isPaginado = ($pageParam !== null || $limiteParam !== null || $envelopeParam === '1' || $envelopeParam === 'true');

        if ($isPaginado) {
            $limite   = $limiteParam !== null ? (int) $limiteParam : 30;
            $limite   = max(1, min($limite, 200));
            $page     = max(1, (int) ($pageParam ?? 1));
            $envelope = $envelopeParam !== '0' && $envelopeParam !== 'false';

            $total  = (clone $builder)->countAllResults(false);
            $offset = ($page - 1) * $limite;
            $rows   = $builder->findAll($limite, $offset);
            $totalPaginas = (int) max(1, ceil($total / $limite));

            $payload = $envelope
                ? [
                    'dados'         => $rows,
                    'paginacao'     => [
                        'pagina_atual'   => $page,
                        'por_pagina'     => $limite,
                        'total_registros'=> $total,
                        'total_paginas'  => $totalPaginas,
                        'tem_proxima'    => $page < $totalPaginas,
                        'tem_anterior'   => $page > 1,
                    ],
                ]
                : $rows;

            $json = json_encode($payload);
            return $this->response
                ->setHeader('Cache-Control', 'public, max-age=180, stale-while-revalidate=300')
                ->setHeader('X-Total-Count', (string) $total)
                ->setHeader('X-Page', (string) $page)
                ->setHeader('X-Per-Page', (string) $limite)
                ->setHeader('X-Total-Pages', (string) $totalPaginas)
                ->setHeader('ETag', '"' . md5($json) . '"')
                ->setContentType('application/json')
                ->setBody($json);
        }

        $rows = $builder->findAll();
        $json = json_encode($rows);
        return $this->response
            ->setHeader('Cache-Control', 'public, max-age=180, stale-while-revalidate=300')
            ->setHeader('X-Total-Count', (string) count($rows))
            ->setHeader('ETag', '"' . md5($json) . '"')
            ->setContentType('application/json')
            ->setBody($json);
    }

    public function show(string $slug): ResponseInterface
    {
        $model = new CandidatoModel();
        $candidato = $model->where('slug', $slug)->first();

        if (! $candidato) {
            return $this->response->setStatusCode(404)->setJSON(['erro' => 'Candidato não encontrado']);
        }

        $id = (int) $candidato['id'];

        $doadores  = (new DoadorModel())->where('candidato_id', $id)->orderBy('percentual', 'DESC')->findAll();
        $gastos    = (new GastoModel())->where('candidato_id', $id)->orderBy('percentual', 'DESC')->findAll();

        foreach ($doadores as &$d) {
            $d['documento'] = $this->mascararDocumento($d['documento'] ?? '');
        }
        unset($d);

        foreach ($gastos as &$g) {
            $g['documento'] = $this->mascararDocumento($g['documento'] ?? '');
        }
        unset($g);

        $suplentes = (new CandidatoSuplenteModel())->where('candidato_id', $id)->orderBy('ordem', 'ASC')->findAll();
        $sup1 = null;
        $sup2 = null;
        foreach ($suplentes as $s) {
            if ((int) $s['ordem'] === 1) {
                $sup1 = $s;
            } elseif ((int) $s['ordem'] === 2) {
                $sup2 = $s;
            }
        }

        $payload = [
            'candidato' => $candidato,
            'suplentes' => $suplentes,
            'chapa'     => [
                'titular'           => [
                    'nome'    => $candidato['nome'],
                    'partido' => $candidato['partido'],
                    'numero'  => $candidato['numero'],
                ],
                'primeiro_suplente' => $sup1,
                'segundo_suplente'  => $sup2,
            ],
            'tse'       => (new CandidatoTseModel())->where('candidato_id', $id)->first(),
            'bens'      => (new BemModel())->where('candidato_id', $id)->orderBy('valor', 'DESC')->findAll(),
            'historico' => (new CandidaturaAnteriorModel())->where('candidato_id', $id)->orderBy('ano', 'DESC')->findAll(),
            'doadores'  => $doadores,
            'gastos'    => $gastos,
        ];

        $json = json_encode($payload);
        return $this->response
            ->setHeader('Cache-Control', 'public, max-age=180, stale-while-revalidate=300')
            ->setHeader('ETag', '"' . md5($json) . '"')
            ->setContentType('application/json')
            ->setBody($json);
    }

    public function bens(string $slug): ResponseInterface
    {
        $model = new CandidatoModel();
        $candidato = $model->where('slug', $slug)->first();

        if (! $candidato) {
            return $this->response->setStatusCode(404)->setJSON(['erro' => 'Candidato não encontrado']);
        }

        $bens = (new BemModel())->where('candidato_id', (int) $candidato['id'])->orderBy('valor', 'DESC')->findAll();

        $json = json_encode($bens);
        return $this->response
            ->setHeader('Cache-Control', 'public, max-age=180, stale-while-revalidate=300')
            ->setHeader('ETag', '"' . md5($json) . '"')
            ->setContentType('application/json')
            ->setBody($json);
    }

    /**
     * Mascara documento conforme LGPD:
     * CPF (11 dígitos): ***.123.456-** (protege privacidade de cidadãos)
     * CNPJ (14 dígitos): mantido completo para transparência pública de pessoas jurídicas
     */
    private function mascararDocumento(?string $doc): string
    {
        if (! $doc) {
            return '';
        }
        $digits = preg_replace('/\D/', '', $doc);
        if (strlen($digits) === 11) {
            return '***.' . substr($digits, 3, 3) . '.' . substr($digits, 6, 3) . '-**';
        }
        return $doc;
    }
}
