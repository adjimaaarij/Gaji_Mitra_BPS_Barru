<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sobat extends Model
{
    protected $table = 'sobat';
    protected $primaryKey = 'id_sobat';
    public $incrementing = false; // karena NIK (id_sobat) bukan auto increment
    protected $keyType = 'string';

    protected $fillable = [
        'id_sobat',
        'nama',
        'email',
        'total_honor',
        'total_pulsa',
    ];

    public function honors()
    {
        return $this->hasMany(Honor::class, 'id_sobat', 'id_sobat');
    }
}
