<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Loan extends Model
{
    use HasFactory;

    /**
     *
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'transactions_id',
        'books_id',
        'loan_date',
        'due_date',
        'return_date',
        'status',
        'payment_amount',
    ];

    /**
     *
     *
     * @var array<string, string>
     */
    protected $casts = [
        'loan_date' => 'datetime',
        'due_date' => 'datetime',
        'return_date' => 'datetime',
        'payment_amount' => 'decimal:2',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'transactions_id');
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class, 'books_id');
    }

    public function student(): ?Student
    {
        return $this->transaction?->student;
    }

    public function attendant(): ?Attendant
    {
        return $this->transaction?->attendant;
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isReturned(): bool
    {
        return $this->status === 'returned';
    }

    public function isOverdue(): bool
    {
        return $this->status === 'overdue' ||
            ($this->status === 'active' && now()->gt($this->due_date));
    }

    public function getDaysOverdueAttribute(): int
    {
        if (!$this->isOverdue()) {
            return 0;
        }

        $endDate = $this->return_date ?? now();
        return $endDate->diffInDays($this->due_date);
    }

    public function calculateFine(float $dailyRate = 5.00): float
    {
        return $this->days_overdue * $dailyRate;
    }
}