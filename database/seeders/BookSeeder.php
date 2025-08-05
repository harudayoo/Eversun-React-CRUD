<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Book;
use Carbon\Carbon;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $books = [
            [
                'book_title' => 'Introduction to Programming',
                'author' => 'John Programming',
                'publisher' => 'Tech Books Publishing',
                'published_year' => 2020,
                'genre' => 'Computer Science',
                'status' => 'available',
                'date_added' => Carbon::now()->subDays(100),
            ],
            [
                'book_title' => 'Database Design Fundamentals',
                'author' => 'Maria Database',
                'publisher' => 'Data Science Press',
                'published_year' => 2019,
                'genre' => 'Computer Science',
                'status' => 'available',
                'date_added' => Carbon::now()->subDays(95),
            ],
            [
                'book_title' => 'Web Development Essentials',
                'author' => 'Alex Web',
                'publisher' => 'Modern Web Publishing',
                'published_year' => 2021,
                'genre' => 'Computer Science',
                'status' => 'borrowed',
                'date_added' => Carbon::now()->subDays(90),
            ],
            [
                'book_title' => 'Mathematics for Engineers',
                'author' => 'Dr. Sarah Numbers',
                'publisher' => 'Academic Press',
                'published_year' => 2018,
                'genre' => 'Mathematics',
                'status' => 'available',
                'date_added' => Carbon::now()->subDays(85),
            ],
            [
                'book_title' => 'Physics Principles',
                'author' => 'Prof. Michael Force',
                'publisher' => 'Science Publishers',
                'published_year' => 2020,
                'genre' => 'Physics',
                'status' => 'available',
                'date_added' => Carbon::now()->subDays(80),
            ],
            [
                'book_title' => 'Software Engineering Practices',
                'author' => 'Lisa Developer',
                'publisher' => 'Tech Books Publishing',
                'published_year' => 2022,
                'genre' => 'Computer Science',
                'status' => 'borrowed',
                'date_added' => Carbon::now()->subDays(75),
            ],
            [
                'book_title' => 'History of Technology',
                'author' => 'Dr. Robert Past',
                'publisher' => 'Historical Books',
                'published_year' => 2017,
                'genre' => 'History',
                'status' => 'available',
                'date_added' => Carbon::now()->subDays(70),
            ],
            [
                'book_title' => 'English Literature Classics',
                'author' => 'Emma Words',
                'publisher' => 'Literary Press',
                'published_year' => 2019,
                'genre' => 'Literature',
                'status' => 'available',
                'date_added' => Carbon::now()->subDays(65),
            ],
            [
                'book_title' => 'Chemistry Fundamentals',
                'author' => 'Dr. Peter Elements',
                'publisher' => 'Science Publishers',
                'published_year' => 2021,
                'genre' => 'Chemistry',
                'status' => 'borrowed',
                'date_added' => Carbon::now()->subDays(60),
            ],
            [
                'book_title' => 'Business Management Basics',
                'author' => 'Susan Manager',
                'publisher' => 'Business Books Inc.',
                'published_year' => 2020,
                'genre' => 'Business',
                'status' => 'available',
                'date_added' => Carbon::now()->subDays(55),
            ],
        ];

        foreach ($books as $book) {
            Book::create($book);
        }
    }
}
