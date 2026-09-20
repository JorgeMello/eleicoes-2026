<?php

namespace App\Models;

use CodeIgniter\Model;

class DoadorModel extends Model
{
    protected $table            = 'doadores';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = false;
    protected $allowedFields    = ['candidato_id', 'nome', 'valor', 'percentual'];
}
