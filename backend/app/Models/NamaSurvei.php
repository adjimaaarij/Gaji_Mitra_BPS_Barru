<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NamaSurvei extends Model
{

    use HasFactory;

    protected $table = 'nama_survei';
    protected $primaryKey = 'id_nama_survei';
    protected $fillable = ['nama_survei', 'id_tim_survei'];
    public $timestamps = true;

    public function timSurvei()
    {
        return $this->belongsTo(TimSurvei::class, 'id_tim_survei');
    }


    public function honors()
    {
        return $this->hasMany(Honor::class, 'id_nama_survei', 'id_nama_survei');
    }
}
