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
        DB::table('sobat')->insert($sobat);

        // Ambil semua ID Sobat setelah insert
        $sobatIds = DB::table('sobat')->pluck('id_sobat')->toArray();

        // ================== BULAN ==================
        $bulanData = [
            '2025-07-01',
            '2025-08-01',
            '2025-09-01',
            '2025-10-01',
        ];

        // ================== SURVEI ==================
        $surveiData = [
            ['jenis_survei' => 'Bulanan'],
            ['jenis_survei' => 'Triwulanan'],
            ['jenis_survei' => 'Subround'],
            ['jenis_survei' => 'Tahunan'],
        ];

        $surveiIds = [];
        foreach ($surveiData as $survei) {
            $surveiIds[] = DB::table('survei')->insertGetId([
                'jenis_survei' => $survei['jenis_survei'],
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }

        // ================== NAMA_SURVEI ==================
        $namaSurveiData = [
            ['nama_survei' => 'SUSENAS'],
            ['nama_survei' => 'Sakernas'],
            ['nama_survei' => 'Pertanian'],
            ['nama_survei' => 'Pariwisata'],
        ];

        $namaSurveiIds = [];
        foreach ($namaSurveiData as $nama) {
            $namaSurveiIds[] = DB::table('nama_survei')->insertGetId([
                'nama_survei' => $nama['nama_survei'],
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }

        // ================== HONOR ==================
        foreach ($sobatIds as $index => $sobatId) {
            $surveiIndex     = $index % count($surveiIds);
            $namaSurveiIndex = $index % count($namaSurveiIds);
            $bulanIndex      = $index % count($bulanData);

            $nilaiHonor = rand(10, 20000); // contoh random nilai honor
            $nilaiPulsa = rand(10, 20000);  // contoh random nilai pulsa

            // Ambil nama survei sesuai id
            $namaSurvei = DB::table('nama_survei')->where('id_nama_survei', $namaSurveiIds[$namaSurveiIndex])->value('nama_survei');

            DB::table('honor')->insert([
                'id_sobat'      => $sobatId,
                'id_survei'     => $surveiIds[$surveiIndex],
                'id_nama_survei'=> $namaSurveiIds[$namaSurveiIndex],
                'nilai_honor'   => $nilaiHonor,
                'nilai_pulsa'   => $nilaiPulsa,
                'tanggal_input' => now(),
                'bulan'         => $bulanData[$bulanIndex],
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);

            // Update total di tabel sobat
            DB::table('sobat')
                ->where('id_sobat', $sobatId)
                ->increment('total_honor', $nilaiHonor);

            DB::table('sobat')
                ->where('id_sobat', $sobatId)
                ->increment('total_pulsa', $nilaiPulsa);
        }
    }
}
