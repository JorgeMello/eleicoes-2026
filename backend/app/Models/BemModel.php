<?php

namespace App\Models;

use CodeIgniter\Model;

class BemModel extends Model
{
    protected $table            = 'bens';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = false;
    protected $allowedFields    = ['candidato_id', 'tipo', 'descricao', 'valor'];
}
