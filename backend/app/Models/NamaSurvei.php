<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NamaSurvei extends Model
{

    use HasFactory;

    protected $table = 'nama_survei';
    protected $primaryKey = 'id_nama_survei';
    public $timestamps = true;

    // Nama tabel (jika tidak sesuai konvensi Laravel)
   protected $fillable = [
        'nama_survei',
    ];

    public function honors()
    {
        return $this->hasMany(Honor::class, 'id_nama_survei');
    }
}
