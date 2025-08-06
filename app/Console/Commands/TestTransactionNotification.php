<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use Illuminate\Console\Command;

class TestTransactionNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:transaction-notification {transaction_id} {action=complete}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test transaction notification system by completing or cancelling a transaction';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $transactionId = $this->argument('transaction_id');
        $action = $this->argument('action');

        $transaction = Transaction::with(['student', 'attendant'])->find($transactionId);

        if (!$transaction) {
            $this->error("Transaction with ID {$transactionId} not found.");
            return 1;
        }

        $this->info("Current transaction status: {$transaction->status}");
        $this->info("Student: {$transaction->student->first_name} {$transaction->student->last_name}");
        $this->info("Student email: {$transaction->student->email}");

        if ($action === 'complete') {
            if ($transaction->status === 'completed') {
                $this->warning('Transaction is already completed.');
                return 0;
            }

            $transaction->markAsCompleted();
            $this->info('Transaction marked as completed! Email notification has been queued.');
        } elseif ($action === 'cancel') {
            if ($transaction->status === 'cancelled') {
                $this->warning('Transaction is already cancelled.');
                return 0;
            }

            $transaction->markAsCancelled();
            $this->info('Transaction cancelled! Email notification has been queued.');
        } else {
            $this->error('Invalid action. Use "complete" or "cancel".');
            return 1;
        }

        $this->info('WebSocket event has been broadcasted for real-time updates.');
        $this->info('Check the queue jobs with: php artisan queue:work');

        return 0;
    }
}
