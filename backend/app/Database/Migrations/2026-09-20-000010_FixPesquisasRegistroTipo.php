<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Uma pesquisa registrada (registro_tse) gera até 3 cenários (1-turno, 2-turno,
 * rejeicao): a unicidade passa a ser composta (registro_tse, tipo).
 */
class FixPesquisasRegistroTipo extends Migration
{
    public function up()
    {
        $this->db->query('ALTER TABLE `pesquisas` DROP INDEX `registro_tse`');
        $this->db->query('ALTER TABLE `pesquisas` ADD UNIQUE KEY `registro_tipo` (`registro_tse`, `tipo`)');
    }

    public function down()
    {
        $this->db->query('ALTER TABLE `pesquisas` DROP INDEX `registro_tipo`');
        $this->db->query('ALTER TABLE `pesquisas` ADD UNIQUE KEY `registro_tse` (`registro_tse`)');
    }
}
