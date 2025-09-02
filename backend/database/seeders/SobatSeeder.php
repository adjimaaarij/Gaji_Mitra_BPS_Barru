<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SobatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Load data dari file sobat_data.php
        $sobats = include(database_path('seeders/data/sobat_data.php'));
        // Pastikan file ada di: database/seeders/data/sobat_data.php

        DB::table('sobats')->insert($sobats);
    }
}
