<?php

namespace App\Models;

use App\Events\TransactionStatusChanged;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    use HasFactory;

    /**
     * The fillable attributes.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'students_id',
        'users_id',
        'transaction_date',
        'transaction_type',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'transaction_date' => 'date',
    ];

    /**
     * Boot the model and register model events.
     */
    protected static function boot()
    {
        parent::boot();

        static::updating(function (Transaction $transaction) {
            // Check if status is being changed
            if ($transaction->isDirty('status')) {
                $oldStatus = $transaction->getOriginal('status');
                $newStatus = $transaction->status;

                // Fire event after the model is saved
                static::updated(function ($transaction) use ($oldStatus, $newStatus) {
                    event(new TransactionStatusChanged($transaction, $oldStatus, $newStatus));
                });
            }
        });
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'students_id');
    }

    public function attendant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class, 'transactions_id');
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    /**
     * Mark transaction as completed
     */
    public function markAsCompleted(): void
    {
        $this->update(['status' => 'completed']);
    }

    /**
     * Mark transaction as cancelled
     */
    public function markAsCancelled(): void
    {
        $this->update(['status' => 'cancelled']);
    }
}
