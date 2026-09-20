<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateCandidatosTse extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'                   => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'candidato_id'         => ['type' => 'INT', 'unsigned' => true],
            'sq_candidato'         => ['type' => 'VARCHAR', 'constraint' => 30, 'null' => true],
            'tse_documento_id'     => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => true],
            'cnpj_campanha'        => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'situacao_registro'    => ['type' => 'VARCHAR', 'constraint' => 60, 'default' => 'Deferido'],
            'processo_pje'         => ['type' => 'VARCHAR', 'constraint' => 60, 'null' => true],
            'limite_gastos_1t'     => ['type' => 'DECIMAL', 'constraint' => '15,2', 'null' => true],
            'limite_gastos_2t'     => ['type' => 'DECIMAL', 'constraint' => '15,2', 'null' => true],
            'patrimonio_declarado' => ['type' => 'DECIMAL', 'constraint' => '15,2', 'null' => true],
            'soma_bens_calculada'  => ['type' => 'DECIMAL', 'constraint' => '15,2', 'null' => true],
            'divergencia_bens'     => ['type' => 'DECIMAL', 'constraint' => '15,2', 'default' => 0.00],
            'bens_consistentes'    => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1],
            'receitas_total'       => ['type' => 'DECIMAL', 'constraint' => '15,2', 'null' => true],
            'despesas_total'       => ['type' => 'DECIMAL', 'constraint' => '15,2', 'null' => true],
            'saldo_campanha'       => ['type' => 'DECIMAL', 'constraint' => '15,2', 'null' => true],
            'situacao_caixa'       => ['type' => 'VARCHAR', 'constraint' => 40, 'default' => 'SUPERAVIT_OU_NEUTRO'],
            'dentro_limite_tse'    => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1],
            'percentual_gasto_teto'=> ['type' => 'DECIMAL', 'constraint' => '6,2', 'null' => true],
            'total_bens'           => ['type' => 'INT', 'unsigned' => true, 'default' => 0],
            'total_doadores'       => ['type' => 'INT', 'unsigned' => true, 'default' => 0],
            'total_fornecedores'   => ['type' => 'INT', 'unsigned' => true, 'default' => 0],
            'status_geral'         => ['type' => 'VARCHAR', 'constraint' => 30, 'default' => 'CONFORME'],
            'validado_em'          => ['type' => 'DATETIME', 'null' => true],
            'created_at'           => ['type' => 'DATETIME', 'null' => true],
            'updated_at'           => ['type' => 'DATETIME', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('candidato_id');
        $this->forge->addKey('sq_candidato');
        $this->forge->addKey('status_geral');
        $this->forge->addForeignKey('candidato_id', 'candidatos', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('candidatos_tse');
    }

    public function down()
    {
        $this->forge->dropTable('candidatos_tse');
    }
}
