<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Slugs se repetem entre UFs (ex.: dois "silva" em estados diferentes):
 * a unicidade passa a ser composta (cargo, uf, slug).
 */
class FixCandidatosCargoUfSlug extends Migration
{
    public function up()
    {
        $this->db->query('ALTER TABLE `candidatos` DROP INDEX `slug`');
        $this->db->query('ALTER TABLE `candidatos` ADD UNIQUE KEY `cargo_uf_slug` (`cargo`, `uf`, `slug`)');
    }

    public function down()
    {
        $this->db->query('ALTER TABLE `candidatos` DROP INDEX `cargo_uf_slug`');
        $this->db->query('ALTER TABLE `candidatos` ADD UNIQUE KEY `slug` (`slug`)');
    }
}
