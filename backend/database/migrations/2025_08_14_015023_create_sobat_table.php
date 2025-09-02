<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sobat', function (Blueprint $table) {
            $table->id('id_sobat'); // primary key
            $table->string('nama', 255);
            $table->string('email', 255)->unique();
            $table->decimal('total_honor', 15, 2)->default(0);
            $table->decimal('total_pulsa', 15, 2)->default(0);
            $table->timestamps(); // created_at & updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sobat');
    }
};
