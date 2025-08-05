<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLoanRequest extends FormRequest
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
            'loan_date' => 'required|date',
            'due_date' => 'required|date|after:loan_date',
            'return_date' => 'nullable|date',
            'status' => 'required|in:active,returned,overdue',
            'payment_amount' => 'nullable|numeric|min:0',
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
            'loan_date.required' => 'Loan date is required.',
            'due_date.required' => 'Due date is required.',
            'due_date.after' => 'Due date must be after loan date.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be one of: active, returned, overdue.',
            'payment_amount.min' => 'Payment amount cannot be negative.',
        ];
    }
}
