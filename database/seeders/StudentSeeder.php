<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;
use Carbon\Carbon;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = [
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'contact_number' => '09123456789',
                'email' => 'john.doe@student.edu',
                'year_level' => 1,
                'registered_date' => Carbon::now()->subDays(30),
            ],
            [
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'contact_number' => '09234567890',
                'email' => 'jane.smith@student.edu',
                'year_level' => 2,
                'registered_date' => Carbon::now()->subDays(25),
            ],
            [
                'first_name' => 'Michael',
                'last_name' => 'Johnson',
                'contact_number' => '09345678901',
                'email' => 'michael.johnson@student.edu',
                'year_level' => 3,
                'registered_date' => Carbon::now()->subDays(20),
            ],
            [
                'first_name' => 'Emily',
                'last_name' => 'Davis',
                'contact_number' => '09456789012',
                'email' => 'emily.davis@student.edu',
                'year_level' => 4,
                'registered_date' => Carbon::now()->subDays(15),
            ],
            [
                'first_name' => 'David',
                'last_name' => 'Wilson',
                'contact_number' => '09567890123',
                'email' => 'david.wilson@student.edu',
                'year_level' => 1,
                'registered_date' => Carbon::now()->subDays(10),
            ],
            [
                'first_name' => 'Sarah',
                'last_name' => 'Brown',
                'contact_number' => '09678901234',
                'email' => 'sarah.brown@student.edu',
                'year_level' => 2,
                'registered_date' => Carbon::now()->subDays(5),
            ],
        ];

        foreach ($students as $student) {
            Student::create($student);
        }
    }
}
