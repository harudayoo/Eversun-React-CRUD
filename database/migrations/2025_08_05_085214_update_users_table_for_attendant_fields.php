<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Split the name field into first_name and last_name with default values
            $table->string('first_name')->nullable()->after('id');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('contact_number')->nullable()->after('email');
            $table->date('hire_date')->nullable()->after('contact_number');
        });

        // Update existing users to populate the new fields if any exist
        DB::statement("UPDATE users SET first_name = CASE WHEN instr(name, ' ') > 0 THEN substr(name, 1, instr(name, ' ') - 1) ELSE name END, last_name = CASE WHEN instr(name, ' ') > 0 THEN substr(name, instr(name, ' ') + 1) ELSE '' END WHERE name IS NOT NULL");

        // Set default values for empty fields
        DB::statement("UPDATE users SET contact_number = 'N/A' WHERE contact_number IS NULL");
        DB::statement("UPDATE users SET hire_date = CURRENT_DATE WHERE hire_date IS NULL");

        // Drop the old name column
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('name');
        });

        // Make the fields non-nullable after populating them
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable(false)->change();
            $table->string('last_name')->nullable(false)->change();
            $table->string('contact_number')->nullable(false)->change();
            $table->date('hire_date')->nullable(false)->change();
        });
    }    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add back the name column
            $table->string('name')->after('id');
        });

        // Reconstruct name from first_name and last_name
        DB::statement("UPDATE users SET name = first_name || ' ' || last_name WHERE first_name IS NOT NULL AND last_name IS NOT NULL");

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['first_name', 'last_name', 'contact_number', 'hire_date']);
        });
    }
};
