<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateBens extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'           => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'candidato_id' => ['type' => 'INT', 'unsigned' => true],
            'tipo'         => ['type' => 'VARCHAR', 'constraint' => 120],
            'descricao'    => ['type' => 'TEXT', 'null' => true],
            'valor'        => ['type' => 'DECIMAL', 'constraint' => '15,2', 'null' => true],
            'created_at'   => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('candidato_id');
        $this->forge->addForeignKey('candidato_id', 'candidatos', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('bens');
    }

    public function down()
    {
        $this->forge->dropTable('bens');
    }
}
