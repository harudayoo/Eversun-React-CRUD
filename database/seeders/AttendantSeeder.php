<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Attendant;
use Carbon\Carbon;

class AttendantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attendants = [
            [
                'first_name' => 'Alice',
                'last_name' => 'Thompson',
                'email' => 'alice.thompson@library.edu',
                'contact_number' => '09111222333',
                'hire_date' => Carbon::now()->subMonths(6),
            ],
            [
                'first_name' => 'Robert',
                'last_name' => 'Garcia',
                'email' => 'robert.garcia@library.edu',
                'contact_number' => '09222333444',
                'hire_date' => Carbon::now()->subMonths(12),
            ],
            [
                'first_name' => 'Linda',
                'last_name' => 'Martinez',
                'email' => 'linda.martinez@library.edu',
                'contact_number' => '09333444555',
                'hire_date' => Carbon::now()->subMonths(18),
            ],
            [
                'first_name' => 'James',
                'last_name' => 'Lee',
                'email' => 'james.lee@library.edu',
                'contact_number' => '09444555666',
                'hire_date' => Carbon::now()->subMonths(24),
            ],
        ];

        foreach ($attendants as $attendant) {
            Attendant::create($attendant);
        }
    }
}
