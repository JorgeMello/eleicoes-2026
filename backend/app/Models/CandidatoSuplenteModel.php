<?php

namespace App\Models;

use CodeIgniter\Model;

class CandidatoSuplenteModel extends Model
{
    protected $table            = 'candidato_suplentes';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'candidato_id',
        'ordem',
        'nome_completo',
        'nome_urna',
        'partido',
        'numero_urna',
        'situacao_registro',
        'foto_url',
        'cpf_mascarado',
        'ocupacao',
        'total_bens',
        'processo_tse',
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
