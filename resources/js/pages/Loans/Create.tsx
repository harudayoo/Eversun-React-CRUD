import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Book, Calendar, User } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Loans', href: '/loans' },
    { title: 'Create Loan', href: '/loans/create' },
];

interface Book {
    id: number;
    book_title: string;
    author: string;
    publisher: string;
}

interface Student {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    year_level: number;
}

interface Attendant {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface LoansCreateProps {
    books: Book[];
    students: Student[];
    attendants: Attendant[];
}

export default function LoansCreate({ books, students, attendants }: LoansCreateProps) {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        books_id: '',
        students_id: '',
        attendants_id: '',
        loan_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/loans');
    };

    const handleBookSelect = (bookId: string) => {
        setData('books_id', bookId);
        const book = books.find(b => b.id.toString() === bookId);
        setSelectedBook(book || null);
    };

    const handleStudentSelect = (studentId: string) => {
        setData('students_id', studentId);
        const student = students.find(s => s.id.toString() === studentId);
        setSelectedStudent(student || null);
    };

    const calculateDueDate = (loanDate: string, days: number = 14) => {
        const date = new Date(loanDate);
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    };

    const handleLoanDateChange = (loanDate: string) => {
        setData('loan_date', loanDate);
        setData('due_date', calculateDueDate(loanDate));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New Loan - Book Lending System" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Create New Loan</h1>
                        <p className="text-muted-foreground">
                            Issue a book to a student
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/loans">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Loans
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Book Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Book className="h-5 w-5" />
                                    Select Book
                                </CardTitle>
                                <CardDescription>
                                    Choose a book to lend
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="books_id">Available Books ({books.length} books available)</Label>
                                    {books.length === 0 ? (
                                        <div className="p-4 bg-orange-50 rounded-lg dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                                            <p className="text-orange-800 dark:text-orange-200 text-sm">
                                                No books are currently available for lending. All books may be on loan or in maintenance.
                                            </p>
                                        </div>
                                    ) : (
                                        <Select value={data.books_id} onValueChange={handleBookSelect}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a book..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {books.map((book) => (
                                                    <SelectItem key={book.id} value={book.id.toString()}>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{book.book_title}</span>
                                                            <span className="text-sm text-muted-foreground">
                                                                by {book.author} • {book.publisher}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                    {errors.books_id && (
                                        <p className="text-sm text-red-600 mt-1">{errors.books_id}</p>
                                    )}
                                </div>

                                {selectedBook && (
                                    <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-950/20">
                                        <h4 className="font-medium text-blue-900 dark:text-blue-100">
                                            Selected Book
                                        </h4>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            <strong>{selectedBook.book_title}</strong><br />
                                            by {selectedBook.author}<br />
                                            Publisher: {selectedBook.publisher}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Student Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Select Student
                                </CardTitle>
                                <CardDescription>
                                    Choose the student borrowing the book
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="students_id">Student ({students.length} registered)</Label>
                                    <Select value={data.students_id} onValueChange={handleStudentSelect}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a student..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students.map((student) => (
                                                <SelectItem key={student.id} value={student.id.toString()}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {student.first_name} {student.last_name}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            Year {student.year_level} • {student.email}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.students_id && (
                                        <p className="text-sm text-red-600 mt-1">{errors.students_id}</p>
                                    )}
                                </div>

                                {selectedStudent && (
                                    <div className="p-4 bg-green-50 rounded-lg dark:bg-green-950/20">
                                        <h4 className="font-medium text-green-900 dark:text-green-100">
                                            Selected Student
                                        </h4>
                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            <strong>{selectedStudent.first_name} {selectedStudent.last_name}</strong><br />
                                            Year Level: {selectedStudent.year_level}<br />
                                            Email: {selectedStudent.email}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Loan Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Loan Details
                            </CardTitle>
                            <CardDescription>
                                Set the loan and due dates
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <Label htmlFor="attendants_id">Library Attendant</Label>
                                    <Select
                                        value={data.attendants_id}
                                        onValueChange={(value) => setData('attendants_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select attendant..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {attendants.map((attendant) => (
                                                <SelectItem key={attendant.id} value={attendant.id.toString()}>
                                                    {attendant.first_name} {attendant.last_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.attendants_id && (
                                        <p className="text-sm text-red-600 mt-1">{errors.attendants_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="loan_date">Loan Date</Label>
                                    <Input
                                        id="loan_date"
                                        type="date"
                                        value={data.loan_date}
                                        onChange={(e) => handleLoanDateChange(e.target.value)}
                                    />
                                    {errors.loan_date && (
                                        <p className="text-sm text-red-600 mt-1">{errors.loan_date}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="due_date">Due Date</Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                    />
                                    {errors.due_date && (
                                        <p className="text-sm text-red-600 mt-1">{errors.due_date}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/loans">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing || books.length === 0}>
                            {processing ? 'Creating Loan...' : books.length === 0 ? 'No Books Available' : 'Create Loan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
