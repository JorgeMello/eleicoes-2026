<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class CandidatosPresidente2026 extends Seeder
{
    public function run()
    {
        $base = 'https://g1.globo.com/politica/eleicoes/2026/quem-sao-os-candidatos/presidente/';
        $lista = [
            ['clariana-barao', 'Clariana Barao', 'DC', 27],
            ['edmilson-costa', 'Edmilson Costa', 'PCB', 21],
            ['escritor-augusto-cury', 'Escritor Augusto Cury', 'AVANTE', 70],
            ['flavio-bolsonaro', 'Flavio Bolsonaro', 'PL', 22],
            ['hertz-dias', 'Hertz Dias', 'PSTU', 16],
            ['leonardo-avalanche', 'Leonardo Avalanche', 'PRTB', 28],
            ['lula', 'Lula', 'PT', 13],
            ['renan-santos', 'Renan Santos', 'MISSÃO', 14],
            ['ronaldo-caiado', 'Ronaldo Caiado', 'PSD', 55],
            ['rui-costa-pimenta', 'Rui Costa Pimenta', 'PCO', 29],
            ['samara', 'Samara', 'UP', 80],
            ['veterinario-wilson-grassi', 'Veterinário Wilson Grassi', 'DEMOCRATA', 35],
            ['zema', 'Zema', 'NOVO', 30],
        ];

        foreach ($lista as [$slug, $nome, $partido, $numero]) {
            $existe = $this->db->table('candidatos')->where('slug', $slug)->countAllResults();
            if ($existe) {
                continue;
            }
            $this->db->table('candidatos')->insert([
                'slug' => $slug, 'nome' => $nome, 'partido' => $partido, 'numero' => $numero,
                'cargo' => 'presidente', 'uf' => 'BR',
                'perfil_g1_url' => $base . $slug . '.ghtml',
                'coletado_em'   => date('Y-m-d H:i:s'),
            ]);
        }
    }
}
