<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\BemModel;
use App\Models\CandidaturaAnteriorModel;
use App\Models\CandidatoModel;
use App\Models\ColetaModel;
use App\Models\DoadorModel;
use App\Models\GastoModel;
use CodeIgniter\HTTP\ResponseInterface;

class Coletas extends BaseController
{
    public function importar(): ResponseInterface
    {
        $esperada = env('ELEICOES_API_KEY', '');
        $recebida = $this->request->getHeaderLine('X-API-Key');

        if ($esperada !== '' && ! hash_equals($esperada, $recebida)) {
            return $this->response->setStatusCode(401)->setJSON(['erro' => 'API key inválida']);
        }

        $payload = $this->request->getJSON(true) ?? [];
        $lote    = $payload['lote'] ?? $payload;

        if (! is_array($lote) || $lote === []) {
            return $this->response->setStatusCode(422)->setJSON(['erro' => 'Corpo esperado: { "lote": [ ...candidatos ] }']);
        }

        $candidatoModel = new CandidatoModel();
        $bemModel        = new BemModel();
        $histModel       = new CandidaturaAnteriorModel();
        $doadorModel     = new DoadorModel();
        $gastoModel      = new GastoModel();
        $coletaModel     = new ColetaModel();

        $coletaId = $coletaModel->insert([
            'iniciado_em'     => date('Y-m-d H:i:s'),
            'total_lista'     => count($lote),
            'total_perfis_ok' => 0,
            'total_falhas'    => 0,
            'detalhes'        => null,
        ]);

        $ok = 0;
        $falhas = [];

        foreach ($lote as $item) {
            if (empty($item['slug']) || empty($item['nome'])) {
                $falhas[] = ['item' => $item['slug'] ?? '?', 'motivo' => 'slug/nome ausentes'];
                continue;
            }

            $existente = $candidatoModel->where('slug', $item['slug'])->first();

            $dados = [
                'slug'                => $item['slug'],
                'nome'                => $item['nome'],
                'nome_completo'       => $item['nome_completo'] ?? null,
                'partido'             => $item['partido'] ?? null,
                'numero'              => $item['numero'] ?? null,
                'cargo'               => $item['cargo'] ?? 'presidente',
                'uf'                  => $item['uf'] ?? 'BR',
                'foto_url_original'   => $item['foto_url_original'] ?? null,
                'foto_local'          => $item['foto_local'] ?? ($existente['foto_local'] ?? null),
                'perfil_g1_url'       => $item['perfil_g1_url'] ?? null,
                'profissao'           => $item['profissao'] ?? null,
                'genero'              => $item['genero'] ?? null,
                'cor_etnia'           => $item['cor_etnia'] ?? null,
                'grau_instrucao'      => $item['grau_instrucao'] ?? null,
                'plano_governo_url'   => $item['plano_governo_url'] ?? null,
                'vice_nome'           => $item['vice_nome'] ?? null,
                'vice_partido'        => $item['vice_partido'] ?? null,
                'patrimonio_total'    => $item['patrimonio_total'] ?? null,
                'receitas_total'      => $item['receitas_total'] ?? null,
                'despesas_total'      => $item['despesas_total'] ?? null,
                'limite_gastos'       => $item['limite_gastos'] ?? null,
                'coletado_em'         => date('Y-m-d H:i:s'),
                'fonte_atualizado_em' => $item['fonte_atualizado_em'] ?? null,
                'raw_json'            => isset($item['raw']) ? json_encode($item['raw'], JSON_UNESCAPED_UNICODE) : null,
            ];

            try {
                if ($existente) {
                    $candidatoModel->update((int) $existente['id'], $dados);
                    $id = (int) $existente['id'];
                    foreach ([$bemModel, $histModel, $doadorModel, $gastoModel] as $rel) {
                        $rel->where('candidato_id', $id)->delete();
                    }
                } else {
                    $id = (int) $candidatoModel->insert($dados);
                }

                foreach ($item['bens'] ?? [] as $b) {
                    $bemModel->insert(['candidato_id' => $id, 'tipo' => $b['tipo'] ?? '—', 'descricao' => $b['descricao'] ?? null, 'valor' => $b['valor'] ?? null]);
                }
                foreach ($item['historico'] ?? [] as $h) {
                    $histModel->insert(['candidato_id' => $id, 'ano' => $h['ano'] ?? 0, 'cargo' => $h['cargo'] ?? '—', 'partido' => $h['partido'] ?? null, 'resultado' => $h['resultado'] ?? null]);
                }
                foreach ($item['doadores'] ?? [] as $d) {
                    $doadorModel->insert(['candidato_id' => $id, 'nome' => $d['nome'] ?? '—', 'valor' => $d['valor'] ?? null, 'percentual' => $d['percentual'] ?? null]);
                }
                foreach ($item['gastos'] ?? [] as $g) {
                    $gastoModel->insert(['candidato_id' => $id, 'nome' => $g['nome'] ?? '—', 'valor' => $g['valor'] ?? null, 'percentual' => $g['percentual'] ?? null]);
                }
                $ok++;
            } catch (\Throwable $e) {
                log_message('error', 'Importação candidato {slug}: {msg}', ['slug' => $item['slug'], 'msg' => $e->getMessage()]);
                $falhas[] = ['item' => $item['slug'], 'motivo' => $e->getMessage()];
            }
        }

        $coletaModel->update($coletaId, [
            'finalizado_em'   => date('Y-m-d H:i:s'),
            'total_perfis_ok' => $ok,
            'total_falhas'    => count($falhas),
            'detalhes'        => json_encode($falhas, JSON_UNESCAPED_UNICODE),
        ]);

        return $this->response->setJSON(['importados' => $ok, 'falhas' => $falhas, 'coleta_id' => $coletaId]);
    }
}
