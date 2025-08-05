<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\Student;
use App\Models\Attendant;
use Carbon\Carbon;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some students and attendants for the transactions
        $students = Student::all();
        $attendants = Attendant::all();

        if ($students->isEmpty() || $attendants->isEmpty()) {
            $this->command->info('Please run StudentSeeder and AttendantSeeder first.');
            return;
        }

        $transactions = [
            [
                'students_id' => $students->random()->id,
                'attendants_id' => $attendants->random()->id,
                'transaction_date' => Carbon::now()->subDays(10),
                'transaction_type' => 'borrow',
                'status' => 'completed',
            ],
            [
                'students_id' => $students->random()->id,
                'attendants_id' => $attendants->random()->id,
                'transaction_date' => Carbon::now()->subDays(8),
                'transaction_type' => 'borrow',
                'status' => 'completed',
            ],
            [
                'students_id' => $students->random()->id,
                'attendants_id' => $attendants->random()->id,
                'transaction_date' => Carbon::now()->subDays(15),
                'transaction_type' => 'borrow',
                'status' => 'completed',
            ],
            [
                'students_id' => $students->random()->id,
                'attendants_id' => $attendants->random()->id,
                'transaction_date' => Carbon::now()->subDays(5),
                'transaction_type' => 'borrow',
                'status' => 'completed',
            ],
            [
                'students_id' => $students->random()->id,
                'attendants_id' => $attendants->random()->id,
                'transaction_date' => Carbon::now()->subDays(12),
                'transaction_type' => 'return',
                'status' => 'completed',
            ],
            [
                'students_id' => $students->random()->id,
                'attendants_id' => $attendants->random()->id,
                'transaction_date' => Carbon::now()->subDays(3),
                'transaction_type' => 'borrow',
                'status' => 'pending',
            ],
        ];

        foreach ($transactions as $transaction) {
            Transaction::create($transaction);
        }
    }
}
