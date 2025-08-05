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
        Schema::dropIfExists('attendants');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('attendants', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('contact_number');
            $table->date('hire_date');
            $table->timestamps();
        });
    }
};
