<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimSurvei extends Model
{
    use HasFactory;

    protected $table = 'tim_survei';
    protected $primaryKey = 'id_tim_survei';
    protected $fillable = ['nama_tim_survei'];

    // Relasi: satu tim survei bisa punya banyak nama survei
    public function namaSurveis()
    {
        return $this->hasMany(NamaSurvei::class, 'id_tim_survei', 'id_tim_survei');
    }
}
