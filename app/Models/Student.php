<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory;

    /**
     *
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'contact_number',
        'email',
        'year_level',
        'registered_date',
    ];

    /**
     *
     *
     * @var array<string, string>
     */
    protected $casts = [
        'registered_date' => 'date',
        'year_level' => 'integer',
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'students_id');
    }

    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}