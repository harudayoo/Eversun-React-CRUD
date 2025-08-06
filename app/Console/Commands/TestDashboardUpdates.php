<?php

namespace App\Console\Commands;

use App\Models\Loan;
use App\Models\Book;
use App\Models\Student;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Console\Command;

class TestDashboardUpdates extends Command
{
    protected $signature = 'test:dashboard-updates {action=status : The action to perform: status, borrow, return}';
    protected $description = 'Test real-time dashboard updates by simulating loan actions';

    public function handle()
    {
        $action = $this->argument('action');

        switch ($action) {
            case 'status':
                $this->showCurrentStats();
                break;
            case 'borrow':
                $this->simulateBorrow();
                break;
            case 'return':
                $this->simulateReturn();
                break;
            default:
                $this->error('Invalid action. Use: status, borrow, or return');
                return 1;
        }

        return 0;
    }

    private function showCurrentStats()
    {
        $activeLoans = Loan::where('status', 'active')->count();
        $overdueLoans = Loan::where('status', 'active')
            ->where('due_date', '<', now())
            ->count();
        $todayReturns = Loan::where('status', 'returned')
            ->whereDate('return_date', today())
            ->count();
        $availableBooks = Book::where('status', 'available')->count();

        $this->info('Current Dashboard Stats:');
        $this->line("Active Loans: {$activeLoans}");
        $this->line("Overdue Loans: {$overdueLoans}");
        $this->line("Today's Returns: {$todayReturns}");
        $this->line("Available Books: {$availableBooks}");
    }

    private function simulateBorrow()
    {
        // Find an available book
        $book = Book::where('status', 'available')->first();
        if (!$book) {
            $this->error('No available books to borrow!');
            return;
        }

        // Find a student
        $student = Student::first();
        if (!$student) {
            $this->error('No students found!');
            return;
        }

        // Find an attendant
        $attendant = User::where('role', 'attendant')->first();
        if (!$attendant) {
            $this->error('No attendants found!');
            return;
        }

        $this->info("Simulating book borrow...");
        $this->line("Book: {$book->book_title}");
        $this->line("Student: {$student->first_name} {$student->last_name}");

        // Create transaction
        $transaction = Transaction::create([
            'student_id' => $student->id,
            'attendant_id' => $attendant->id,
            'transaction_date' => now(),
            'status' => 'completed',
        ]);

        // Create loan
        $loan = Loan::create([
            'transaction_id' => $transaction->id,
            'book_id' => $book->id,
            'loan_date' => now(),
            'due_date' => now()->addDays(14),
            'status' => 'active',
            'payment_amount' => 0,
        ]);

        // Update book status
        $book->update(['status' => 'borrowed']);

        $this->info("✅ Book borrowed successfully!");
        $this->line("Loan ID: {$loan->id}");
        $this->line("Transaction ID: {$transaction->id}");
        $this->line("Due Date: {$loan->due_date->format('Y-m-d')}");

        $this->showCurrentStats();
    }

    private function simulateReturn()
    {
        // Find an active loan
        $loan = Loan::where('status', 'active')->with(['book', 'transaction.student'])->first();
        if (!$loan) {
            $this->error('No active loans to return!');
            return;
        }

        $this->info("Simulating book return...");
        $this->line("Book: {$loan->book->book_title}");
        $this->line("Student: {$loan->transaction->student->first_name} {$loan->transaction->student->last_name}");
        $this->line("Original Due Date: {$loan->due_date->format('Y-m-d')}");

        // Calculate if overdue
        $isOverdue = now()->gt($loan->due_date);
        $daysOverdue = $isOverdue ? now()->diffInDays($loan->due_date) : 0;

        if ($isOverdue) {
            $this->warn("⚠️  Book is {$daysOverdue} days overdue!");
        }

        // Update loan
        $loan->update([
            'status' => 'returned',
            'return_date' => now(),
        ]);

        // Update book status
        $loan->book->update(['status' => 'available']);

        $this->info("✅ Book returned successfully!");
        $this->line("Return Date: " . now()->format('Y-m-d H:i:s'));

        $this->showCurrentStats();
    }
}
