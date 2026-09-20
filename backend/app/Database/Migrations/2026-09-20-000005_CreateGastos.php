<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateGastos extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'           => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'candidato_id' => ['type' => 'INT', 'unsigned' => true],
            'nome'         => ['type' => 'VARCHAR', 'constraint' => 180],
            'valor'        => ['type' => 'DECIMAL', 'constraint' => '15,2', 'null' => true],
            'percentual'   => ['type' => 'DECIMAL', 'constraint' => '5,2', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('candidato_id');
        $this->forge->addForeignKey('candidato_id', 'candidatos', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('gastos');
    }

    public function down()
    {
        $this->forge->dropTable('gastos');
    }
}
