<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            // [
            //     'name' => 'admin',
            //     'email' => 'admin@example.com',
            //     'password' => Hash::make('admin123'),
            //     'created_at' => now(),
            //     'updated_at' => now(),
            // ],
            [
                'name' => 'Bps User',
                'email' => 'MitraSobat@BPS.com',
                'password' => Hash::make('@MitraSobat'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
