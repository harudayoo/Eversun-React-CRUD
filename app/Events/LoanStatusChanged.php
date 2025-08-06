<?php

namespace App\Events;

use App\Models\Loan;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LoanStatusChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public Loan $loan,
        public string $oldStatus,
        public string $newStatus
    ) {
        $this->loan->load(['book', 'transaction.student', 'transaction.attendant']);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('loans'),
            new Channel('transactions'),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'loan.status.changed';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'loan' => [
                'id' => $this->loan->id,
                'status' => $this->loan->status,
                'old_status' => $this->oldStatus,
                'new_status' => $this->newStatus,
                'loan_date' => $this->loan->loan_date->toISOString(),
                'due_date' => $this->loan->due_date->toISOString(),
                'return_date' => $this->loan->return_date?->toISOString(),
                'payment_amount' => $this->loan->payment_amount,
                'book' => [
                    'id' => $this->loan->book->id,
                    'book_title' => $this->loan->book->book_title,
                    'author' => $this->loan->book->author,
                ],
                'transaction' => [
                    'id' => $this->loan->transaction->id,
                    'student' => [
                        'id' => $this->loan->transaction->student->id,
                        'first_name' => $this->loan->transaction->student->first_name,
                        'last_name' => $this->loan->transaction->student->last_name,
                    ],
                    'attendant' => [
                        'id' => $this->loan->transaction->attendant->id,
                        'first_name' => $this->loan->transaction->attendant->first_name,
                        'last_name' => $this->loan->transaction->attendant->last_name,
                    ],
                ],
            ],
            'timestamp' => now()->toISOString(),
        ];
    }
}
