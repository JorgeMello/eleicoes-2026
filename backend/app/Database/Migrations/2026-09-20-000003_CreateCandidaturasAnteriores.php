<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateCandidaturasAnteriores extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'           => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'candidato_id' => ['type' => 'INT', 'unsigned' => true],
            'ano'          => ['type' => 'SMALLINT'],
            'cargo'        => ['type' => 'VARCHAR', 'constraint' => 60],
            'partido'      => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'resultado'    => ['type' => 'VARCHAR', 'constraint' => 30, 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('candidato_id');
        $this->forge->addForeignKey('candidato_id', 'candidatos', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('candidaturas_anteriores');
    }

    public function down()
    {
        $this->forge->dropTable('candidaturas_anteriores');
    }
}
