<?php

namespace App\Models;

use CodeIgniter\Model;

class PesquisaModel extends Model
{
    protected $table            = 'pesquisas';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = false;
    protected $createdField     = 'created_at';
    protected $allowedFields    = [
        'instituto_id', 'cargo', 'uf', 'tipo', 'confronto', 'data_inicio', 'data_fim',
        'margem_erro', 'amostra', 'registro_tse', 'fonte_url', 'coletado_em',
    ];
}
