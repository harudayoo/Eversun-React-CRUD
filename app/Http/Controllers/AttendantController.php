<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendantRequest;
use App\Http\Requests\UpdateAttendantRequest;
use App\Models\Attendant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Attendant::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('contact_number', 'like', "%{$search}%");
            });
        }

        $attendants = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Attendants/Index', [
            'attendants' => $attendants,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Attendants/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendantRequest $request)
    {
        Attendant::create($request->validated());

        return redirect()->route('attendants.index')
            ->with('success', 'Attendant created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendant $attendant)
    {
        return Inertia::render('Attendants/Show', [
            'attendant' => $attendant,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attendant $attendant)
    {
        return Inertia::render('Attendants/Edit', [
            'attendant' => $attendant,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendantRequest $request, Attendant $attendant)
    {
        $attendant->update($request->validated());

        return redirect()->route('attendants.index')
            ->with('success', 'Attendant updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendant $attendant)
    {
        try {
            $attendant->delete();

            return redirect()->route('attendants.index')
                ->with('success', 'Attendant deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('attendants.index')
                ->with('error', 'Cannot delete attendant. They may have associated transactions.');
        }
    }
}
