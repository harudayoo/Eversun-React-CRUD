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
        // Drop foreign key constraint from loans table
        Schema::table('loans', function (Blueprint $table) {
            $table->dropForeign(['transactions_id']);
        });

        // Drop and recreate transactions table with standard id
        Schema::dropIfExists('transactions');
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('students_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('attendants_id')->constrained('attendants')->onDelete('cascade');
            $table->date('transaction_date');
            $table->enum('transaction_type', ['borrow', 'return', 'renew']);
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();
        });

        // Update loans table foreign key
        Schema::table('loans', function (Blueprint $table) {
            $table->foreign('transactions_id')->references('id')->on('transactions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop foreign key constraint from loans table
        Schema::table('loans', function (Blueprint $table) {
            $table->dropForeign(['transactions_id']);
        });

        // Recreate transactions table with transaction_id
        Schema::dropIfExists('transactions');
        Schema::create('transactions', function (Blueprint $table) {
            $table->id('transaction_id');
            $table->foreignId('students_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('attendants_id')->constrained('attendants')->onDelete('cascade');
            $table->date('transaction_date');
            $table->enum('transaction_type', ['borrow', 'return', 'renew']);
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();
        });

        // Restore loans table foreign key
        Schema::table('loans', function (Blueprint $table) {
            $table->foreign('transactions_id')->references('transaction_id')->on('transactions')->onDelete('cascade');
        });
    }
};
