<?php

namespace App\Listeners;

use App\Events\TransactionStatusChanged;
use App\Jobs\SendTransactionNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendTransactionStatusNotification implements ShouldQueue
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
    public function handle(TransactionStatusChanged $event): void
    {
        try {
            $transaction = $event->transaction;
            $newStatus = $event->newStatus;

            // Determine notification type based on status change
            $notificationType = null;

            switch ($newStatus) {
                case 'completed':
                    $notificationType = 'completed';
                    break;
                case 'cancelled':
                    $notificationType = 'cancelled';
                    break;
                default:
                    // Don't send notifications for other status changes
                    Log::info("No notification needed for status change to: {$newStatus}");
                    return;
            }

            if ($notificationType) {
                // Dispatch the email job to queue
                SendTransactionNotification::dispatch($transaction, $notificationType)
                    ->onQueue('emails')
                    ->delay(now()->addSeconds(5)); // Small delay to ensure transaction is fully saved

                Log::info("Queued email notification for transaction {$transaction->id} with type: {$notificationType}");
            }
        } catch (\Exception $e) {
            Log::error("Failed to queue transaction notification: " . $e->getMessage());
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(TransactionStatusChanged $event, \Throwable $exception): void
    {
        Log::error("SendTransactionStatusNotification listener failed for transaction {$event->transaction->id}: " . $exception->getMessage());
    }
}
