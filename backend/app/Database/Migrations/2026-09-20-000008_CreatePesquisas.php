<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePesquisas extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'            => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'instituto_id'  => ['type' => 'INT', 'unsigned' => true],
            'cargo'         => ['type' => 'VARCHAR', 'constraint' => 30, 'default' => 'presidente'],
            'uf'            => ['type' => 'VARCHAR', 'constraint' => 2, 'default' => 'BR'],
            'tipo'          => ['type' => 'ENUM', 'constraint' => ['1-turno', '2-turno', 'espontanea', 'rejeicao'], 'default' => '1-turno'],
            'data_inicio'   => ['type' => 'DATE', 'null' => true],
            'data_fim'      => ['type' => 'DATE', 'null' => true],
            'margem_erro'   => ['type' => 'DECIMAL', 'constraint' => '4,2', 'null' => true],
            'amostra'       => ['type' => 'INT', 'unsigned' => true, 'null' => true],
            'registro_tse'  => ['type' => 'VARCHAR', 'constraint' => 30],
            'fonte_url'     => ['type' => 'TEXT', 'null' => true],
            'coletado_em'   => ['type' => 'DATETIME', 'null' => true],
            'created_at'    => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('registro_tse');
        $this->forge->addKey(['cargo', 'uf']);
        $this->forge->addForeignKey('instituto_id', 'institutos', 'id', 'RESTRICT', 'CASCADE');
        $this->forge->createTable('pesquisas');
    }

    public function down()
    {
        $this->forge->dropTable('pesquisas');
    }
}
