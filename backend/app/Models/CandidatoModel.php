<?php

namespace App\Models;

use CodeIgniter\Model;

class CandidatoModel extends Model
{
    protected $table            = 'candidatos';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = true;
    protected $createdField     = 'created_at';
    protected $updatedField     = 'updated_at';
    protected $allowedFields    = [
        'slug', 'nome', 'nome_completo', 'partido', 'numero', 'cargo', 'uf',
        'foto_url_original', 'foto_local', 'perfil_g1_url', 'profissao', 'genero',
        'cor_etnia', 'grau_instrucao', 'plano_governo_url', 'vice_nome', 'vice_partido',
        'patrimonio_total', 'receitas_total', 'despesas_total', 'limite_gastos',
        'coletado_em', 'fonte_atualizado_em', 'raw_json',
    ];
}
