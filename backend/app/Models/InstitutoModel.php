<?php

namespace App\Models;

use CodeIgniter\Model;

class InstitutoModel extends Model
{
    protected $table            = 'institutos';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useTimestamps    = false;
    protected $allowedFields    = ['nome', 'site'];
}
