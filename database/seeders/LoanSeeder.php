<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Loan;
use App\Models\Transaction;
use App\Models\Book;
use Carbon\Carbon;

class LoanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get transactions and books for the loans
        $transactions = Transaction::all();
        $borrowedBooks = Book::where('status', 'borrowed')->get();

        if ($transactions->isEmpty() || $borrowedBooks->isEmpty()) {
            $this->command->info('Please run TransactionSeeder and BookSeeder first.');
            return;
        }

        $loans = [
            [
                'transactions_id' => $transactions->where('status', 'completed')->first()->id ?? $transactions->first()->id,
                'books_id' => $borrowedBooks->first()->id,
                'loan_date' => Carbon::now()->subDays(10),
                'due_date' => Carbon::now()->addDays(4), // 14 days from loan date
                'return_date' => null,
                'status' => 'active',
                'payment_amount' => 0.00,
            ],
            [
                'transactions_id' => $transactions->where('status', 'completed')->skip(1)->first()->id ?? $transactions->skip(1)->first()->id,
                'books_id' => $borrowedBooks->skip(1)->first()->id ?? $borrowedBooks->first()->id,
                'loan_date' => Carbon::now()->subDays(8),
                'due_date' => Carbon::now()->addDays(6), // 14 days from loan date
                'return_date' => null,
                'status' => 'active',
                'payment_amount' => 0.00,
            ],
            [
                'transactions_id' => $transactions->where('status', 'completed')->skip(2)->first()->id ?? $transactions->skip(2)->first()->id,
                'books_id' => $borrowedBooks->skip(2)->first()->id ?? $borrowedBooks->first()->id,
                'loan_date' => Carbon::now()->subDays(15),
                'due_date' => Carbon::now()->subDays(1), // Was due yesterday
                'return_date' => Carbon::now()->subDays(1),
                'status' => 'returned',
                'payment_amount' => 0.00,
            ],
            [
                'transactions_id' => $transactions->where('status', 'completed')->skip(3)->first()->id ?? $transactions->skip(3)->first()->id,
                'books_id' => $borrowedBooks->last()->id,
                'loan_date' => Carbon::now()->subDays(5),
                'due_date' => Carbon::now()->addDays(9), // 14 days from loan date
                'return_date' => null,
                'status' => 'active',
                'payment_amount' => 0.00,
            ],
            [
                'transactions_id' => $transactions->where('transaction_type', 'return')->first()->id ?? $transactions->skip(4)->first()->id,
                'books_id' => $borrowedBooks->count() > 4 ? $borrowedBooks->skip(4)->first()->id : $borrowedBooks->first()->id,
                'loan_date' => Carbon::now()->subDays(12),
                'due_date' => Carbon::now()->addDays(2), // 14 days from loan date
                'return_date' => Carbon::now()->subDays(2),
                'status' => 'returned',
                'payment_amount' => 0.00,
            ],
            // Add an overdue loan
            [
                'transactions_id' => $transactions->where('status', 'pending')->first()->id ?? $transactions->last()->id,
                'books_id' => $borrowedBooks->count() > 5 ? $borrowedBooks->skip(5)->first()->id : $borrowedBooks->first()->id,
                'loan_date' => Carbon::now()->subDays(20),
                'due_date' => Carbon::now()->subDays(6), // Overdue by 6 days
                'return_date' => null,
                'status' => 'overdue',
                'payment_amount' => 30.00, // Late fee
            ],
        ];

        foreach ($loans as $loanData) {
            Loan::create($loanData);
        }
    }
}
