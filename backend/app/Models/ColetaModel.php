<?php

namespace App\Models;

use CodeIgniter\Model;

class ColetaModel extends Model
{
    protected $table            = 'coletas';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = false;
    protected $allowedFields    = ['iniciado_em', 'finalizado_em', 'total_lista', 'total_perfis_ok', 'total_falhas', 'detalhes'];
}
