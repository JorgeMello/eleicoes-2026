<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Liga doadores/gastos a empresas pelo documento (só dígitos: 14=CNPJ, 11=CPF).
 */
class AddDocumentoDoadoresGastos extends Migration
{
    public function up()
    {
        $this->db->query('ALTER TABLE `doadores` ADD COLUMN `documento` VARCHAR(20) NULL AFTER `nome`');
        $this->db->query('ALTER TABLE `doadores` ADD INDEX `idx_documento` (`documento`)');
        $this->db->query('ALTER TABLE `gastos` ADD COLUMN `documento` VARCHAR(20) NULL AFTER `nome`');
        $this->db->query('ALTER TABLE `gastos` ADD INDEX `idx_documento` (`documento`)');
    }

    public function down()
    {
        $this->db->query('ALTER TABLE `doadores` DROP INDEX `idx_documento`');
        $this->db->query('ALTER TABLE `doadores` DROP COLUMN `documento`');
        $this->db->query('ALTER TABLE `gastos` DROP INDEX `idx_documento`');
        $this->db->query('ALTER TABLE `gastos` DROP COLUMN `documento`');
    }
}
