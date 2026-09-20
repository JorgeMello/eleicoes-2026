<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateInstitutos extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'    => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'nome'  => ['type' => 'VARCHAR', 'constraint' => 80],
            'site'  => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('nome');
        $this->forge->createTable('institutos');
    }

    public function down()
    {
        $this->forge->dropTable('institutos');
    }
}
