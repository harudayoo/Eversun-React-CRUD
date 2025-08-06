<?php

namespace App\Jobs;

use App\Mail\BookReturned;
use App\Mail\BookBorrowed;
use App\Models\Loan;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendLoanNotification implements ShouldQueue
{
    use Queueable;

    public $tries = 3;
    public $timeout = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Loan $loan,
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
            $student = $this->loan->transaction->student;

            if (!$student || !$student->email) {
                Log::warning("No email found for student in loan {$this->loan->id}");
                return;
            }

            switch ($this->notificationType) {
                case 'borrowed':
                    Mail::to($student->email)->send(new BookBorrowed($this->loan));
                    break;
                case 'returned':
                    Mail::to($student->email)->send(new BookReturned($this->loan));
                    break;
                default:
                    Log::warning("Unknown loan notification type: {$this->notificationType}");
                    return;
            }

            Log::info("Email notification sent successfully for loan {$this->loan->id}");
        } catch (\Exception $e) {
            Log::error("Failed to send loan email notification: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("SendLoanNotification job failed for loan {$this->loan->id}: " . $exception->getMessage());
    }
}
