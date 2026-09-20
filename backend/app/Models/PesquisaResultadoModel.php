<?php

namespace App\Models;

use CodeIgniter\Model;

class PesquisaResultadoModel extends Model
{
    protected $table            = 'pesquisa_resultados';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = false;
    protected $allowedFields    = ['pesquisa_id', 'candidato_id', 'candidato_nome', 'partido', 'percentual'];
}
