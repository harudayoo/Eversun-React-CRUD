<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLoanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'students_id' => 'required|exists:students,id',
            'attendants_id' => 'required|exists:attendants,id',
            'books_id' => 'required|exists:books,id|unique:loans,books_id,NULL,id,status,active',
            'loan_date' => 'required|date',
            'due_date' => 'required|date|after:loan_date',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'students_id.required' => 'Student is required.',
            'students_id.exists' => 'Selected student does not exist.',
            'attendants_id.required' => 'Attendant is required.',
            'attendants_id.exists' => 'Selected attendant does not exist.',
            'books_id.required' => 'Book is required.',
            'books_id.exists' => 'Selected book does not exist.',
            'books_id.unique' => 'This book is already on loan.',
            'loan_date.required' => 'Loan date is required.',
            'due_date.required' => 'Due date is required.',
            'due_date.after' => 'Due date must be after loan date.',
        ];
    }
}
