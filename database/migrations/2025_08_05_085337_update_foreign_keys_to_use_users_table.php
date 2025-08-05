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
        // First drop the foreign key constraint
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['attendants_id']);
        });

        // Rename the column
        Schema::table('transactions', function (Blueprint $table) {
            $table->renameColumn('attendants_id', 'users_id');
        });

        // Add the new foreign key constraint
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreign('users_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the foreign key constraint
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['users_id']);
        });

        // Rename the column back
        Schema::table('transactions', function (Blueprint $table) {
            $table->renameColumn('users_id', 'attendants_id');
        });

        // Add back the original foreign key constraint
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreign('attendants_id')->references('id')->on('attendants')->onDelete('cascade');
        });
    }
};
