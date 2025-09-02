<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survei extends Model
{
    use HasFactory;

    protected $table = 'survei';
    protected $primaryKey = 'id_survei';
    public $timestamps = true;

    protected $fillable = [
        'jenis_survei',
    ];

    public function honors()
    {
        return $this->hasMany(Honor::class, 'id_survei');
    }
}
