<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('honor', function (Blueprint $table) {
            $table->id('id_honor');

            // Relasi ke sobat
            $table->string('id_sobat', 20); // foreign key ke sobat (string)
            $table->foreign('id_sobat')
                ->references('id_sobat')
                ->on('sobat')
                ->onDelete('cascade');

            // Relasi ke survei
            $table->unsignedBigInteger('id_survei');
            $table->foreign('id_survei')->references('id_survei')->on('survei')->onDelete('cascade');

            // Relasi ke nama_survei
            $table->unsignedBigInteger('id_nama_survei');
            $table->foreign('id_nama_survei')
                ->references('id_nama_survei')
                ->on('nama_survei')
                ->onDelete('cascade');


            // Kolom lainnya
            $table->decimal('nilai_honor', 15, 2);
            $table->decimal('nilai_pulsa', 15, 2);
            $table->timestamp('tanggal_input')->useCurrent();
            $table->date('bulan');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('honor');
    }
};
