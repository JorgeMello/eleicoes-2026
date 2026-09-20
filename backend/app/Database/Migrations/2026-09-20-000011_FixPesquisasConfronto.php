<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Um 2º turno tem várias simulações (Lula x Flávio, Lula x Caiado...):
 * a unicidade passa a incluir o confronto.
 */
class FixPesquisasConfronto extends Migration
{
    public function up()
    {
        $this->db->query('ALTER TABLE `pesquisas` ADD COLUMN `confronto` VARCHAR(120) NULL AFTER `tipo`');
        $this->db->query('ALTER TABLE `pesquisas` DROP INDEX `registro_tipo`');
        $this->db->query('ALTER TABLE `pesquisas` ADD UNIQUE KEY `registro_tipo_confronto` (`registro_tse`, `tipo`, `confronto`)');
    }

    public function down()
    {
        $this->db->query('ALTER TABLE `pesquisas` DROP INDEX `registro_tipo_confronto`');
        $this->db->query('ALTER TABLE `pesquisas` ADD UNIQUE KEY `registro_tipo` (`registro_tse`, `tipo`)');
        $this->db->query('ALTER TABLE `pesquisas` DROP COLUMN `confronto`');
    }
}
