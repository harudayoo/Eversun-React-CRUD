<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
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
            'transaction_date' => 'required|date',
            'transaction_type' => 'required|in:borrow,return,renew',
            'status' => 'required|in:pending,completed,cancelled',
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
            'transaction_date.required' => 'Transaction date is required.',
            'transaction_type.required' => 'Transaction type is required.',
            'transaction_type.in' => 'Transaction type must be borrow, return, or renew.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be pending, completed, or cancelled.',
        ];
    }
}
