<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
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
            'book_title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher' => 'required|string|max:255',
            'published_year' => 'required|integer|min:1000|max:' . date('Y'),
            'genre' => 'required|string|max:100',
            'status' => 'required|in:available,borrowed,maintenance',
            'date_added' => 'required|date',
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
            'book_title.required' => 'Book title is required.',
            'author.required' => 'Author is required.',
            'publisher.required' => 'Publisher is required.',
            'published_year.required' => 'Published year is required.',
            'published_year.min' => 'Published year must be a valid year.',
            'published_year.max' => 'Published year cannot be in the future.',
            'genre.required' => 'Genre is required.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be one of: available, borrowed, maintenance.',
            'date_added.required' => 'Date added is required.',
        ];
    }
}