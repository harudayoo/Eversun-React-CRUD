<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AttendantController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\LoanController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        // Get lending statistics
        $activeLoans = \App\Models\Loan::where('status', 'active')->count();
        $overdueLoans = \App\Models\Loan::where('status', 'active')
            ->where('due_date', '<', now())
            ->count();
        $todayReturns = \App\Models\Loan::where('status', 'returned')
            ->whereDate('return_date', today())
            ->count();
        $availableBooks = \App\Models\Book::where('status', 'available')->count();

        return Inertia::render('dashboard', [
            'stats' => [
                'activeLoans' => $activeLoans,
                'overdueLoans' => $overdueLoans,
                'todayReturns' => $todayReturns,
                'availableBooks' => $availableBooks,
            ]
        ]);
    })->name('dashboard');

    // CRUD Routes
    Route::resource('students', StudentController::class);
    Route::resource('attendants', AttendantController::class);
    Route::resource('books', BookController::class);
    Route::resource('transactions', TransactionController::class);
    Route::resource('loans', LoanController::class);

    // Special loan operations
    Route::patch('loans/{loan}/return', [LoanController::class, 'returnBook'])->name('loans.return');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
