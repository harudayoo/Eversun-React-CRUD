<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLoanRequest;
use App\Http\Requests\UpdateLoanRequest;
use App\Models\Loan;
use App\Models\Book;
use App\Models\Student;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class LoanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Loan::with(['book', 'transaction.student', 'transaction.attendant']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('book', function ($q) use ($search) {
                $q->where('book_title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%");
            })->orWhereHas('transaction.student', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by overdue loans
        if ($request->filled('overdue') && $request->overdue === 'true') {
            $query->where('status', 'active')
                  ->where('due_date', '<', Carbon::now());
        }

        // Default ordering: active loans first, then by due date
        $loans = $query->orderByRaw("CASE WHEN status = 'active' THEN 0 ELSE 1 END")
                      ->orderBy('due_date', 'asc')
                      ->orderBy('created_at', 'desc')
                      ->paginate(15);

        return Inertia::render('Loans/Index', [
            'loans' => $loans,
            'filters' => $request->only(['search', 'status', 'overdue']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Only get available books for lending
        $books = Book::where('status', 'available')
                    ->orderBy('book_title')
                    ->get();

        $students = Student::orderBy('first_name')
                          ->orderBy('last_name')
                          ->get();

        $attendants = User::orderBy('first_name')
                              ->orderBy('last_name')
                              ->get();

        return Inertia::render('Loans/Create', [
            'books' => $books,
            'students' => $students,
            'attendants' => $attendants,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLoanRequest $request)
    {
        $validated = $request->validated();

        // Create transaction first
        $transaction = Transaction::create([
            'students_id' => $validated['students_id'],
            'users_id' => $validated['users_id'],
            'transaction_date' => Carbon::now(),
            'transaction_type' => 'borrow',
            'status' => 'completed',
        ]);

        // Create loan
        $loan = Loan::create([
            'transactions_id' => $transaction->id,
            'books_id' => $validated['books_id'],
            'loan_date' => $validated['loan_date'],
            'due_date' => $validated['due_date'],
            'status' => 'active',
        ]);

        // Update book status
        Book::find($validated['books_id'])->update(['status' => 'borrowed']);

        return redirect()->route('loans.index')
            ->with('success', 'Book successfully lent to student. Due date: ' . Carbon::parse($validated['due_date'])->format('M j, Y'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Loan $loan)
    {
        $loan->load(['book', 'transaction.student', 'transaction.attendant']);

        return Inertia::render('Loans/Show', [
            'loan' => $loan,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Loan $loan)
    {
        $loan->load(['book', 'transaction.student', 'transaction.attendant']);

        return Inertia::render('Loans/Edit', [
            'loan' => $loan,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLoanRequest $request, Loan $loan)
    {
        $loan->update($request->validated());

        return redirect()->route('loans.index')
            ->with('success', 'Loan updated successfully.');
    }

    /**
     * Process loan return.
     */
    public function returnBook(Request $request, Loan $loan)
    {
        $request->validate([
            'users_id' => 'required|exists:users,id',
            'payment_amount' => 'nullable|numeric|min:0',
        ]);

        // Update loan
        $loan->update([
            'return_date' => Carbon::now(),
            'status' => 'returned',
            'payment_amount' => $request->payment_amount ?? 0,
        ]);

        // Create return transaction
        Transaction::create([
            'students_id' => $loan->transaction->students_id,
            'users_id' => $request->input('users_id'),
            'transaction_date' => Carbon::now(),
            'transaction_type' => 'return',
            'status' => 'completed',
        ]);

        // Update book status
        $loan->book->update(['status' => 'available']);

        return redirect()->route('loans.index')
            ->with('success', 'Book returned successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Loan $loan)
    {
        // Update book status back to available if needed
        if ($loan->status === 'active') {
            $loan->book->update(['status' => 'available']);
        }

        $loan->delete();

        return redirect()->route('loans.index')
            ->with('success', 'Loan deleted successfully.');
    }
}
