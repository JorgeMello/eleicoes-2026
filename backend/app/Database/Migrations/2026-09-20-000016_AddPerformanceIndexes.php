<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddPerformanceIndexes extends Migration
{
    public function up()
    {
        // Índices compostos de alta performance para candidatos
        $queries = [
            'ALTER TABLE candidatos ADD INDEX idx_cand_cargo_uf_nome (cargo, uf, nome)',
            'ALTER TABLE candidatos ADD INDEX idx_cand_cargo_uf_numero (cargo, uf, numero)',
            'ALTER TABLE candidatos ADD INDEX idx_cand_cargo_uf_partido (cargo, uf, partido)',
            'ALTER TABLE bens ADD INDEX idx_bens_cand_valor (candidato_id, valor)',
        ];

        foreach ($queries as $sql) {
            try {
                $this->db->query($sql);
            } catch (\Throwable $e) {
                // Se já existir, ignora
            }
        }
    }

    public function down()
    {
        $queries = [
            'ALTER TABLE candidatos DROP INDEX idx_cand_cargo_uf_nome',
            'ALTER TABLE candidatos DROP INDEX idx_cand_cargo_uf_numero',
            'ALTER TABLE candidatos DROP INDEX idx_cand_cargo_uf_partido',
            'ALTER TABLE bens DROP INDEX idx_bens_cand_valor',
        ];

        foreach ($queries as $sql) {
            try {
                $this->db->query($sql);
            } catch (\Throwable $e) {
                // Silencioso
            }
        }
    }
}
