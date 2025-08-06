<?php

namespace App\Events;

use App\Models\Transaction;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TransactionStatusChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public Transaction $transaction,
        public string $oldStatus,
        public string $newStatus
    ) {
        $this->transaction->load(['student', 'attendant', 'loans.book']);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('transactions'),
            new Channel('loans'),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'transaction.status.changed';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'transaction' => [
                'id' => $this->transaction->id,
                'status' => $this->transaction->status,
                'old_status' => $this->oldStatus,
                'new_status' => $this->newStatus,
                'student' => [
                    'id' => $this->transaction->student->id,
                    'first_name' => $this->transaction->student->first_name,
                    'last_name' => $this->transaction->student->last_name,
                ],
                'attendant' => [
                    'id' => $this->transaction->attendant->id,
                    'first_name' => $this->transaction->attendant->first_name,
                    'last_name' => $this->transaction->attendant->last_name,
                ],
                'loans' => $this->transaction->loans->map(function ($loan) {
                    return [
                        'id' => $loan->id,
                        'status' => $loan->status,
                        'book' => [
                            'id' => $loan->book->id,
                            'book_title' => $loan->book->book_title,
                            'author' => $loan->book->author,
                        ],
                    ];
                }),
            ],
            'timestamp' => now()->toISOString(),
        ];
    }
}
