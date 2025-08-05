<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    use HasFactory;

    /**
     *
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'book_title',
        'author',
        'publisher',
        'published_year',
        'genre',
        'status',
        'date_added',
    ];

    /**
     *
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_added' => 'date',
        'published_year' => 'integer',
    ];

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class, 'books_id');
    }

    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }

    public function isBorrowed(): bool
    {
        return $this->status === 'borrowed';
    }

    public function isMaintenance(): bool
    {
        return $this->status === 'maintenance';
    }
}