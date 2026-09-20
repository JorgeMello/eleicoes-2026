<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateColetas extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'             => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'iniciado_em'    => ['type' => 'DATETIME', 'null' => true],
            'finalizado_em'  => ['type' => 'DATETIME', 'null' => true],
            'total_lista'    => ['type' => 'SMALLINT', 'default' => 0],
            'total_perfis_ok'=> ['type' => 'SMALLINT', 'default' => 0],
            'total_falhas'   => ['type' => 'SMALLINT', 'default' => 0],
            'detalhes'       => ['type' => 'MEDIUMTEXT', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('coletas');
    }

    public function down()
    {
        $this->forge->dropTable('coletas');
    }
}
