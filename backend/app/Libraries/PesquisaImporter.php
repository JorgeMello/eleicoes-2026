<?php

namespace App\Libraries;

use App\Models\CandidatoModel;
use App\Models\InstitutoModel;
use App\Models\PesquisaModel;
use App\Models\PesquisaResultadoModel;

/**
 * Importa lotes de pesquisas (scraper ou POST /api/pesquisas).
 * Deduplica por registro_tse; resolve/cria institutos; vincula
 * candidato_id via CandidatoMatcher (null quando o nome não bate).
 */
class PesquisaImporter
{
    public static function importar(array $lote): array
    {
        $institutoModel = new InstitutoModel();
        $pesquisaModel  = new PesquisaModel();
        $resultadoModel = new PesquisaResultadoModel();
        $candidatoModel = new CandidatoModel();

        $ok = 0;
        $ignoradas = [];
        $falhas = [];

        foreach ($lote as $item) {
            $registro = trim((string) ($item['registro_tse'] ?? ''));
            if ($registro === '' || empty($item['instituto'])) {
                $falhas[] = ['item' => $item['fonte_url'] ?? '?', 'motivo' => 'registro_tse/instituto ausentes'];
                continue;
            }

            $tipo      = $item['tipo'] ?? '1-turno';
            $confronto = $item['confronto'] ?? null;
            if ($pesquisaModel->where('registro_tse', $registro)->where('tipo', $tipo)->where('confronto', $confronto)->first()) {
                $ignoradas[] = $registro . '|' . $tipo . '|' . ($confronto ?? '—');
                continue;
            }

            $inst = $institutoModel->where('nome', $item['instituto'])->first();
            $institutoId = $inst ? (int) $inst['id'] : (int) $institutoModel->insert(['nome' => $item['instituto']]);

            // Candidatos do mesmo cargo/uf para o vínculo por nome
            $cargo = $item['cargo'] ?? 'presidente';
            $uf    = $item['uf'] ?? 'BR';
            $candidatos = $candidatoModel->where('cargo', $cargo)->where('uf', $uf)->findAll();

            try {
                $pesquisaId = (int) $pesquisaModel->insert([
                    'instituto_id' => $institutoId,
                    'cargo'        => $cargo,
                    'uf'           => $uf,
                    'tipo'         => $tipo,
                    'confronto'    => $confronto,
                    'data_inicio'  => $item['data_inicio'] ?? null,
                    'data_fim'     => $item['data_fim'] ?? null,
                    'margem_erro'  => $item['margem_erro'] ?? null,
                    'amostra'      => $item['amostra'] ?? null,
                    'registro_tse' => $registro,
                    'fonte_url'    => $item['fonte_url'] ?? null,
                    'coletado_em'  => date('Y-m-d H:i:s'),
                ]);

                foreach ($item['resultados'] ?? [] as $r) {
                    if (! isset($r['nome'], $r['percentual'])) {
                        continue;
                    }
                    $resultadoModel->insert([
                        'pesquisa_id'    => $pesquisaId,
                        'candidato_id'   => CandidatoMatcher::match($r['nome'], $candidatos),
                        'candidato_nome' => $r['nome'],
                        'partido'        => $r['partido'] ?? null,
                        'percentual'     => $r['percentual'],
                    ]);
                }
                $ok++;
            } catch (\Throwable $e) {
                log_message('error', 'Importação pesquisa {reg}: {msg}', ['reg' => $registro, 'msg' => $e->getMessage()]);
                $falhas[] = ['item' => $registro, 'motivo' => $e->getMessage()];
            }
        }

        return ['importadas' => $ok, 'ignoradas' => $ignoradas, 'falhas' => $falhas];
    }
}
