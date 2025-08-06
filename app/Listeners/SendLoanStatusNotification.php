<?php

namespace App\Listeners;

use App\Events\LoanStatusChanged;
use App\Jobs\SendLoanNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendLoanStatusNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(LoanStatusChanged $event): void
    {
        try {
            $loan = $event->loan;
            $newStatus = $event->newStatus;

            // Determine notification type based on status change
            $notificationType = null;

            switch ($newStatus) {
                case 'active':
                    // Send borrowing notification if transitioning from new/pending to active
                    if ($event->oldStatus === 'new' || $event->oldStatus === null || $event->oldStatus === 'pending') {
                        $notificationType = 'borrowed';
                    }
                    break;
                case 'returned':
                    $notificationType = 'returned';
                    break;
                default:
                    // Don't send notifications for other status changes
                    Log::info("No notification needed for loan status change to: {$newStatus}");
                    return;
            }

            if ($notificationType) {
                // Dispatch the email job to queue
                SendLoanNotification::dispatch($loan, $notificationType)
                    ->onQueue('emails')
                    ->delay(now()->addSeconds(5)); // Small delay to ensure loan is fully saved

                Log::info("Queued email notification for loan {$loan->id} with type: {$notificationType}");
            }
        } catch (\Exception $e) {
            Log::error("Failed to queue loan notification: " . $e->getMessage());
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(LoanStatusChanged $event, \Throwable $exception): void
    {
        Log::error("SendLoanStatusNotification listener failed for loan {$event->loan->id}: " . $exception->getMessage());
    }
}
