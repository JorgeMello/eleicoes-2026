<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateCandidatos extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'                 => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'slug'               => ['type' => 'VARCHAR', 'constraint' => 80],
            'nome'               => ['type' => 'VARCHAR', 'constraint' => 120],
            'nome_completo'      => ['type' => 'VARCHAR', 'constraint' => 180, 'null' => true],
            'partido'            => ['type' => 'VARCHAR', 'constraint' => 20],
            'numero'             => ['type' => 'SMALLINT', 'unsigned' => true],
            'cargo'              => ['type' => 'VARCHAR', 'constraint' => 30, 'default' => 'presidente'],
            'uf'                 => ['type' => 'VARCHAR', 'constraint' => 2, 'default' => 'BR'],
            'foto_url_original'  => ['type' => 'TEXT', 'null' => true],
            'foto_local'         => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'perfil_g1_url'      => ['type' => 'TEXT', 'null' => true],
            'profissao'          => ['type' => 'VARCHAR', 'constraint' => 120, 'null' => true],
            'genero'             => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'cor_etnia'          => ['type' => 'VARCHAR', 'constraint' => 30, 'null' => true],
            'grau_instrucao'     => ['type' => 'VARCHAR', 'constraint' => 80, 'null' => true],
            'plano_governo_url'  => ['type' => 'TEXT', 'null' => true],
            'vice_nome'          => ['type' => 'VARCHAR', 'constraint' => 120, 'null' => true],
            'vice_partido'       => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'patrimonio_total'   => ['type' => 'DECIMAL', 'constraint' => '15,2', 'null' => true],
            'receitas_total'     => ['type' => 'DECIMAL', 'constraint' => '15,2', 'null' => true],
            'despesas_total'     => ['type' => 'DECIMAL', 'constraint' => '15,2', 'null' => true],
            'limite_gastos'      => ['type' => 'DECIMAL', 'constraint' => '15,2', 'null' => true],
            'coletado_em'        => ['type' => 'DATETIME', 'null' => true],
            'fonte_atualizado_em'=> ['type' => 'VARCHAR', 'constraint' => 60, 'null' => true],
            'raw_json'           => ['type' => 'MEDIUMTEXT', 'null' => true],
            'created_at'         => ['type' => 'DATETIME', 'null' => true],
            'updated_at'         => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('slug');
        $this->forge->addKey('partido');
        $this->forge->addKey('cargo');
        $this->forge->addKey(['cargo', 'numero']);
        $this->forge->createTable('candidatos');
    }

    public function down()
    {
        $this->forge->dropTable('candidatos');
    }
}
