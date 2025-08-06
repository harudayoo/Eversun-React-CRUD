<?php

namespace App\Jobs;

use App\Mail\TransactionCompleted;
use App\Mail\TransactionCancelled;
use App\Models\Transaction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendTransactionNotification implements ShouldQueue
{
    use Queueable;

    public $tries = 3;
    public $timeout = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Transaction $transaction,
        public string $notificationType
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $student = $this->transaction->student;

            if (!$student || !$student->email) {
                Log::warning("No email found for student in transaction {$this->transaction->id}");
                return;
            }

            switch ($this->notificationType) {
                case 'completed':
                    Mail::to($student->email)->send(new TransactionCompleted($this->transaction));
                    break;
                case 'cancelled':
                    Mail::to($student->email)->send(new TransactionCancelled($this->transaction));
                    break;
                default:
                    Log::warning("Unknown notification type: {$this->notificationType}");
                    return;
            }

            Log::info("Email notification sent successfully for transaction {$this->transaction->id}");
        } catch (\Exception $e) {
            Log::error("Failed to send email notification: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("SendTransactionNotification job failed for transaction {$this->transaction->id}: " . $exception->getMessage());
    }
}
