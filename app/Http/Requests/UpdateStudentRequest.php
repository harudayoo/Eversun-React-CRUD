<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
{
    /**
     *
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     *
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email' => [
                'required',
                'email',
                Rule::unique('students', 'email')->ignore($this->student ?? null),
            ],
            'year_level' => 'required|integer|min:1|max:5',
            'registered_date' => 'required|date',
        ];
    }

    /**
     *
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required.',
            'last_name.required' => 'Last name is required.',
            'contact_number.required' => 'Contact number is required.',
            'email.required' => 'Email address is required.',
            'email.unique' => 'This email address is already registered.',
            'year_level.required' => 'Year level is required.',
            'year_level.min' => 'Year level must be at least 1.',
            'year_level.max' => 'Year level cannot exceed 5.',
            'registered_date.required' => 'Registration date is required.',
        ];
    }
}