<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // ================== SOBAT ==================
        $sobat = include(database_path('seeders/data/sobat_data.php'));
        $timSurvei   = include database_path('seeders/data/tim_survei.php');
        $jenisSurvei = include database_path('seeders/data/jenis_survei.php');
        $namaSurvei  = include database_path('seeders/data/nama_survei.php');
        $honor = include database_path('seeders/data/honor.php');

        DB::table('sobat')->insert($sobat);
        $sobatIds = DB::table('sobat')->pluck('id_sobat')->toArray();

        // ================== BULAN ==================
        $bulanData = [
            '2025-07-01',
            '2025-08-01',
            '2025-09-01',
            '2025-10-01',
        ];

        // ================== TIM SURVEI ==================
        $timSurveiIds = [];
        foreach ($timSurvei as $id => $namaTim) {
            $timSurveiIds[$id] = DB::table('tim_survei')->insertGetId([
                'nama_tim_survei' => $namaTim,
                'created_at'      => now(),
                'updated_at'      => now(),
            ]);
        }

        // ================== JENIS SURVEI ==================
        $jenisSurveiIds = [];
        foreach ($jenisSurvei as $id => $jenis) {
            $jenisSurveiIds[$id] = DB::table('survei')->insertGetId([
                'jenis_survei' => $jenis,
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }

        // ================== NAMA SURVEI ==================
        $namaSurveiIds = [];
        foreach ($namaSurvei as $item) {
            $namaSurveiIds[] = DB::table('nama_survei')->insertGetId([
                'id_tim_survei' => $timSurveiIds[$item['id_tim_survei']], // ganti tim_id jadi id_tim_survei
                'nama_survei'   => $item['nama_survei'],
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);
        }


        // // ================== HONOR ==================
        // $honorIds = [];
        // foreach ($honor as $item) {
        //     $honorIds[] = DB::table('honor')->insertGetId([
        //         'id_sobat'       => $item['id_sobat'],
        //         'id_nama_survei' => $item['nama_survei'], // nanti diganti pas insert dummy
        //         'id_survei'      => $item['jenis_survei'], // nanti diganti pas insert dummy
        //         'nilai_honor'    => $item['nilai_honor'],
        //         'nilai_pulsa'    => rand(10, 20000),
        //         'tanggal_input'  => now(),
        //         'bulan'          => '2025-07-01', // nanti diganti pas insert dummy
        //         'created_at'     => now(),
        //         'updated_at'     => now(),
        //     ]);
        // }

        // foreach ($sobatIds as $index => $sobatId) {
        //     $surveiIndex     = $index % count($jenisSurveiIds);
        //     $namaSurveiIndex = $index % count($namaSurveiIds);
        //     $bulanIndex      = $index % count($bulanData);

        //     $nilaiHonor = rand(10, 20000);
        //     $nilaiPulsa = rand(10, 20000);

        //     DB::table('honor')->insert([
        //         'id_sobat'       => $sobatId,
        //         'id_survei'      => $jenisSurveiIds[$surveiIndex + 1], // indexing mulai 1
        //         'id_nama_survei' => $namaSurveiIds[$namaSurveiIndex],
        //         'nilai_honor'    => $nilaiHonor,
        //         'nilai_pulsa'    => $nilaiPulsa,
        //         'tanggal_input'  => now(),
        //         'bulan'          => $bulanData[$bulanIndex],
        //         'created_at'     => now(),
        //         'updated_at'     => now(),
        //     ]);

        //     DB::table('sobat')
        //         ->where('id_sobat', $sobatId)
        //         ->increment('total_honor', $nilaiHonor);

        //     DB::table('sobat')
        //         ->where('id_sobat', $sobatId)
        //         ->increment('total_pulsa', $nilaiPulsa);
        // }
    }
}
