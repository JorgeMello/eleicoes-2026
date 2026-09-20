<?php

namespace App\Models;

use CodeIgniter\Model;

class GastoModel extends Model
{
    protected $table            = 'gastos';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = false;
    protected $allowedFields    = ['candidato_id', 'nome', 'documento', 'valor', 'percentual'];
}
