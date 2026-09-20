<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateCandidatoSuplentes extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'                => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'candidato_id'      => ['type' => 'INT', 'unsigned' => true],
            'ordem'             => ['type' => 'TINYINT', 'comment' => '1 para 1º Suplente, 2 para 2º Suplente'],
            'nome_completo'     => ['type' => 'VARCHAR', 'constraint' => 255],
            'nome_urna'         => ['type' => 'VARCHAR', 'constraint' => 150, 'null' => true],
            'partido'           => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => true],
            'numero_urna'       => ['type' => 'VARCHAR', 'constraint' => 10, 'null' => true],
            'situacao_registro' => ['type' => 'VARCHAR', 'constraint' => 100, 'default' => 'Deferido'],
            'foto_url'          => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'cpf_mascarado'     => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'ocupacao'          => ['type' => 'VARCHAR', 'constraint' => 150, 'null' => true],
            'total_bens'        => ['type' => 'DECIMAL', 'constraint' => '15,2', 'default' => 0.00],
            'processo_tse'      => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'created_at'        => ['type' => 'DATETIME', 'null' => true],
            'updated_at'        => ['type' => 'DATETIME', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey(['candidato_id', 'ordem']);
        $this->forge->addForeignKey('candidato_id', 'candidatos', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('candidato_suplentes');
    }

    public function down()
    {
        $this->forge->dropTable('candidato_suplentes');
    }
}
