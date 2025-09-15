<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Honor extends Model
{
    use HasFactory;

    protected $table = 'honor';
    protected $primaryKey = 'id_honor';
    public $timestamps = true;

    protected $fillable = [
        'id_sobat',
        'id_survei',
        'id_nama_survei',
        'nilai_honor',
        'nilai_pulsa',
        'tanggal_input',
        'bulan',
    ];

    public function sobat()
    {
        return $this->belongsTo(Sobat::class, 'id_sobat', 'id_sobat');
    }

    public function survei()
    {
        return $this->belongsTo(Survei::class, 'id_survei', 'id_survei');
    }

    public function namaSurvei()
    {
        return $this->belongsTo(NamaSurvei::class, 'id_nama_survei', 'id_nama_survei');
    }
}
