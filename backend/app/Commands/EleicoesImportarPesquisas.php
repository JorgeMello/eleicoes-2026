<?php

namespace App\Commands;

use App\Libraries\PesquisaImporter;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class EleicoesImportarPesquisas extends BaseCommand
{
    protected $group       = 'eleicoes';
    protected $name        = 'eleicoes:importar-pesquisas';
    protected $description = 'Importa scraper/out/pesquisas.json para o banco.';
    protected $usage       = 'eleicoes:importar-pesquisas [arquivo.json]';

    public function run(array $params)
    {
        $arquivo = $params[0] ?? 'scraper/out/pesquisas.json';
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

        $r = PesquisaImporter::importar($lote);
        CLI::write('Importadas: ' . $r['importadas'], 'green');
        CLI::write('Ignoradas (já existiam): ' . count($r['ignoradas']));
        foreach ($r['falhas'] as $f) {
            CLI::error(($f['item'] ?? '?') . ' — ' . ($f['motivo'] ?? ''));
        }
    }
}
