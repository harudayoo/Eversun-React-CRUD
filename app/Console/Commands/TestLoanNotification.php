<?php

namespace App\Console\Commands;

use App\Models\Loan;
use App\Models\Book;
use App\Models\Student;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class TestLoanNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:loan-notification {action=create} {--loan_id=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test loan notification system by creating a new loan or returning an existing one';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $action = $this->argument('action');

        switch ($action) {
            case 'create':
                return $this->createTestLoan();
            case 'return':
                return $this->returnTestLoan();
            default:
                $this->error('Invalid action. Use "create" or "return".');
                return 1;
        }
    }

    private function createTestLoan()
    {
        $this->info('Creating a test loan...');

        // Get a random available book
        $book = Book::where('status', 'available')->first();
        if (!$book) {
            $this->error('No available books found.');
            return 1;
        }

        // Get a random student
        $student = Student::first();
        if (!$student) {
            $this->error('No students found.');
            return 1;
        }

        // Get a random attendant (user)
        $attendant = User::first();
        if (!$attendant) {
            $this->error('No attendants found.');
            return 1;
        }

        $this->info("Book: {$book->book_title} by {$book->author}");
        $this->info("Student: {$student->first_name} {$student->last_name}");
        $this->info("Student email: {$student->email}");

        // Create transaction
        $transaction = Transaction::create([
            'students_id' => $student->id,
            'users_id' => $attendant->id,
            'transaction_date' => Carbon::now(),
            'transaction_type' => 'borrow',
            'status' => 'completed',
        ]);

        // Create loan
        $loan = Loan::create([
            'transactions_id' => $transaction->id,
            'books_id' => $book->id,
            'loan_date' => Carbon::now(),
            'due_date' => Carbon::now()->addDays(14),
            'status' => 'active',
            'payment_amount' => 0,
        ]);

        // Update book status
        $book->update(['status' => 'borrowed']);

        $this->info("✅ Loan created successfully!");
        $this->info("Loan ID: {$loan->id}");
        $this->info("Due date: {$loan->due_date->format('Y-m-d')}");
        $this->info("Email notification has been queued.");
        $this->info("WebSocket event has been broadcasted for real-time updates.");

        return 0;
    }

    private function returnTestLoan()
    {
        $loanId = $this->option('loan_id');

        if (!$loanId) {
            // Get the first active loan
            $loan = Loan::where('status', 'active')->with(['book', 'transaction.student'])->first();
            if (!$loan) {
                $this->error('No active loans found. Use --loan_id=X to specify a loan.');
                return 1;
            }
        } else {
            $loan = Loan::with(['book', 'transaction.student'])->find($loanId);
            if (!$loan) {
                $this->error("Loan with ID {$loanId} not found.");
                return 1;
            }
        }

        if ($loan->status === 'returned') {
            $this->warning('This loan is already returned.');
            return 0;
        }

        $this->info("Returning loan for: {$loan->transaction->student->first_name} {$loan->transaction->student->last_name}");
        $this->info("Book: {$loan->book->book_title}");
        $this->info("Student email: {$loan->transaction->student->email}");

        // Update loan status
        $loan->update([
            'return_date' => Carbon::now(),
            'status' => 'returned',
        ]);

        // Update book status
        $loan->book->update(['status' => 'available']);

        $this->info("✅ Book returned successfully!");
        $this->info("Return date: {$loan->return_date->format('Y-m-d H:i:s')}");
        $this->info("Email notification has been queued.");
        $this->info("WebSocket event has been broadcasted for real-time updates.");

        return 0;
    }
}
