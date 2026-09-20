<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePesquisaResultados extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'              => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'pesquisa_id'     => ['type' => 'INT', 'unsigned' => true],
            'candidato_id'    => ['type' => 'INT', 'unsigned' => true, 'null' => true],
            'candidato_nome'  => ['type' => 'VARCHAR', 'constraint' => 120],
            'partido'         => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'percentual'      => ['type' => 'DECIMAL', 'constraint' => '5,2'],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('pesquisa_id');
        $this->forge->addKey('candidato_id');
        $this->forge->addForeignKey('pesquisa_id', 'pesquisas', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('candidato_id', 'candidatos', 'id', 'SET NULL', 'CASCADE');
        $this->forge->createTable('pesquisa_resultados');
    }

    public function down()
    {
        $this->forge->dropTable('pesquisa_resultados');
    }
}
