<?php

namespace App\Models;

use CodeIgniter\Model;

class CandidaturaAnteriorModel extends Model
{
    protected $table            = 'candidaturas_anteriores';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = false;
    protected $allowedFields    = ['candidato_id', 'ano', 'cargo', 'partido', 'resultado'];
}
