<?php

namespace App\Models;

use CodeIgniter\Model;

class CandidatoTseModel extends Model
{
    protected $table            = 'candidatos_tse';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = true;
    protected $createdField     = 'created_at';
    protected $updatedField     = 'updated_at';
    protected $allowedFields    = [
        'candidato_id',
        'sq_candidato',
        'tse_documento_id',
        'cnpj_campanha',
        'situacao_registro',
        'processo_pje',
        'limite_gastos_1t',
        'limite_gastos_2t',
        'patrimonio_declarado',
        'soma_bens_calculada',
        'divergencia_bens',
        'bens_consistentes',
        'receitas_total',
        'despesas_total',
        'saldo_campanha',
        'situacao_caixa',
        'dentro_limite_tse',
        'percentual_gasto_teto',
        'total_bens',
        'total_doadores',
        'total_fornecedores',
        'status_geral',
        'validado_em',
    ];
}
