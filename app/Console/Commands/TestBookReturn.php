<?php

namespace App\Console\Commands;

use App\Models\Loan;
use Carbon\Carbon;
use Illuminate\Console\Command;

class TestBookReturn extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:book-return {loan_id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test book return notification system by returning a book';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $loanId = $this->argument('loan_id');

        $loan = Loan::with(['book', 'transaction.student', 'transaction.attendant'])->find($loanId);

        if (!$loan) {
            $this->error("Loan with ID {$loanId} not found.");
            return 1;
        }

        if ($loan->status === 'returned') {
            $this->warning('Book is already returned.');
            return 0;
        }

        $this->info("Current loan status: {$loan->status}");
        $this->info("Book: {$loan->book->book_title} by {$loan->book->author}");
        $this->info("Student: {$loan->transaction->student->first_name} {$loan->transaction->student->last_name}");
        $this->info("Student email: {$loan->transaction->student->email}");
        $this->info("Loan date: {$loan->loan_date->format('Y-m-d')}");
        $this->info("Due date: {$loan->due_date->format('Y-m-d')}");

        // Update loan to returned status
        $loan->update([
            'return_date' => Carbon::now(),
            'status' => 'returned',
            'payment_amount' => 0,
        ]);

        // Update book status
        $loan->book->update(['status' => 'available']);

        $this->info('Book marked as returned! Email notification has been queued.');
        $this->info('WebSocket event has been broadcasted for real-time updates.');
        $this->info('Check the queue jobs with: php artisan queue:work');

        return 0;
    }
}
