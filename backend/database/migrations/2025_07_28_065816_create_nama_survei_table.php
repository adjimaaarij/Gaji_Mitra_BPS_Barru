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
        Schema::create('nama_survei', function (Blueprint $table) {
            $table->id('id_nama_survei'); // gunakan snake_case
            $table->unsignedBigInteger('id_tim_survei');
            $table->string('nama_survei', 255);
            $table->timestamps();

            $table->foreign('id_tim_survei')
                ->references('id_tim_survei') // ✅ must match the actual PK column
                ->on('tim_survei')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nama_survei');
    }
};
