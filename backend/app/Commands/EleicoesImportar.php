<?php

namespace App\Commands;

use App\Models\BemModel;
use App\Models\CandidaturaAnteriorModel;
use App\Models\CandidatoModel;
use App\Models\CandidatoSuplenteModel;
use App\Models\DoadorModel;
use App\Models\GastoModel;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class EleicoesImportar extends BaseCommand
{
    protected $group       = 'eleicoes';
    protected $name        = 'eleicoes:importar';
    protected $description = 'Importa scraper/out/candidatos.json para o banco.';
    protected $usage       = 'eleicoes:importar <arquivo.json>';

    public function run(array $params)
    {
        $arquivo = $params[0] ?? 'scraper/out/candidatos.json';
        // Permite caminho relativo à raiz do projeto (eleicoes2026/)
        $candidatos = [dirname(APPPATH, 2) . DIRECTORY_SEPARATOR . $arquivo, $arquivo];
        $json = null;
        foreach ($candidatos as $c) {
            if (is_file($c)) {
                $json = $c;
                break;
            }
        }
        if (! $json) {
            CLI::error("Arquivo não encontrado: {$arquivo}");
            return;
        }

        $lote = json_decode(file_get_contents($json), true);
        $lote = $lote['lote'] ?? $lote;

        $candidatoModel = new CandidatoModel();
        $bemModel        = new BemModel();
        $histModel       = new CandidaturaAnteriorModel();
        $doadorModel     = new DoadorModel();
        $gastoModel      = new GastoModel();
        $suplenteModel   = new CandidatoSuplenteModel();

        $ok = 0;
        foreach ($lote as $item) {
            $existente = $candidatoModel
                ->where('slug', $item['slug'])
                ->where('cargo', $item['cargo'] ?? 'presidente')
                ->where('uf', $item['uf'] ?? 'BR')
                ->first();
            $dados = [
                'slug' => $item['slug'], 'nome' => $item['nome'],
                'partido' => $item['partido'] ?? null, 'numero' => $item['numero'] ?? null,
                'cargo' => $item['cargo'] ?? 'presidente', 'uf' => $item['uf'] ?? 'BR',
                'foto_url_original' => $item['foto_url_original'] ?? null,
                'foto_local'        => $item['foto_local'] ?? ($existente['foto_local'] ?? null),
                'perfil_g1_url'     => $item['perfil_g1_url'] ?? null,
                'profissao'         => $item['profissao'] ?? null,
                'genero'            => $item['genero'] ?? null,
                'cor_etnia'         => $item['cor_etnia'] ?? null,
                'grau_instrucao'    => $item['grau_instrucao'] ?? null,
                'plano_governo_url' => $item['plano_governo_url'] ?? null,
                'vice_nome'         => $item['vice_nome'] ?? null,
                'vice_partido'      => $item['vice_partido'] ?? null,
                'patrimonio_total'  => $item['patrimonio_total'] ?? null,
                'receitas_total'    => $item['receitas_total'] ?? null,
                'despesas_total'    => $item['despesas_total'] ?? null,
                'limite_gastos'     => $item['limite_gastos'] ?? null,
                'coletado_em'       => date('Y-m-d H:i:s'),
                'fonte_atualizado_em' => $item['fonte_atualizado_em'] ?? null,
            ];
            if ($existente) {
                $candidatoModel->update((int) $existente['id'], $dados);
                $id = (int) $existente['id'];
                foreach ([$bemModel, $histModel, $doadorModel, $gastoModel, $suplenteModel] as $rel) {
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
                $doadorModel->insert(['candidato_id' => $id, 'nome' => $d['nome'] ?? '—', 'documento' => $d['documento'] ?? null, 'valor' => $d['valor'] ?? null, 'percentual' => $d['percentual'] ?? null]);
            }
            foreach ($item['gastos'] ?? [] as $g) {
                $gastoModel->insert(['candidato_id' => $id, 'nome' => $g['nome'] ?? '—', 'documento' => $g['documento'] ?? null, 'valor' => $g['valor'] ?? null, 'percentual' => $g['percentual'] ?? null]);
            }

            // Suplentes de Senador
            if (!empty($item['suplentes']) && is_array($item['suplentes'])) {
                foreach ($item['suplentes'] as $s) {
                    $suplenteModel->insert([
                        'candidato_id'      => $id,
                        'ordem'             => (int) ($s['ordem'] ?? 1),
                        'nome_completo'     => $s['nome_completo'] ?? ($s['nome'] ?? '—'),
                        'nome_urna'         => $s['nome_urna'] ?? ($s['nome'] ?? '—'),
                        'partido'           => $s['partido'] ?? null,
                        'numero_urna'       => $s['numero_urna'] ?? null,
                        'situacao_registro' => $s['situacao_registro'] ?? 'Deferido',
                        'foto_url'          => $s['foto_url'] ?? null,
                        'cpf_mascarado'     => $s['cpf_mascarado'] ?? null,
                        'ocupacao'          => $s['ocupacao'] ?? null,
                        'total_bens'        => $s['total_bens'] ?? 0.00,
                        'processo_tse'      => $s['processo_tse'] ?? null,
                    ]);
                }
            } else {
                if (!empty($item['suplente1_nome'])) {
                    $suplenteModel->insert([
                        'candidato_id'      => $id,
                        'ordem'             => 1,
                        'nome_completo'     => $item['suplente1_nome'],
                        'nome_urna'         => $item['suplente1_nome_urna'] ?? $item['suplente1_nome'],
                        'partido'           => $item['suplente1_partido'] ?? $item['partido'] ?? null,
                        'situacao_registro' => 'Deferido',
                        'ocupacao'          => $item['suplente1_ocupacao'] ?? null,
                    ]);
                }
                if (!empty($item['suplente2_nome'])) {
                    $suplenteModel->insert([
                        'candidato_id'      => $id,
                        'ordem'             => 2,
                        'nome_completo'     => $item['suplente2_nome'],
                        'nome_urna'         => $item['suplente2_nome_urna'] ?? $item['suplente2_nome'],
                        'partido'           => $item['suplente2_partido'] ?? $item['partido'] ?? null,
                        'situacao_registro' => 'Deferido',
                        'ocupacao'          => $item['suplente2_ocupacao'] ?? null,
                    ]);
                }
            }
            $ok++;
            CLI::write("OK: {$item['slug']}");
        }
        CLI::write("Importados: {$ok}", 'green');

        // Sincroniza tabela candidatos_tse caso o relatório exista
        $relatorioTse = dirname(APPPATH, 2) . DIRECTORY_SEPARATOR . 'scraper/out/relatorio-validacao-tse.json';
        if (is_file($relatorioTse)) {
            CLI::write("\nSincronizando auditoria oficial do TSE...", 'cyan');
            command('tse:auditar');
        }
    }
}
