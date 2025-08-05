import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Book, Calendar, RotateCcw, User, UserCheck } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Loan {
    id: number;
    loan_date: string;
    due_date: string;
    return_date?: string;
    status: 'active' | 'returned' | 'overdue';
    payment_amount: number;
    book: {
        id: number;
        book_title: string;
        author: string;
        publisher: string;
        genre: string;
    };
    transaction: {
        transaction_date: string;
        transaction_type: string;
        status: string;
        student: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            year_level: number;
        };
        attendant: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
        };
    };
}

interface LoansShowProps {
    loan: Loan;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Loans', href: '/loans' },
    { title: 'Loan Details', href: '#' },
];

export default function LoansShow({ loan }: LoansShowProps) {
    const handleReturnBook = () => {
        if (confirm('Are you sure you want to mark this book as returned?')) {
            router.patch(`/loans/${loan.id}/return`, {
                attendants_id: loan.transaction.attendant.id,
                payment_amount: 0,
            });
        }
    };

    const getStatusBadge = () => {
        if (loan.status === 'returned') {
            return <Badge variant="secondary">Returned</Badge>;
        }

        const isOverdue = loan.status === 'active' && new Date(loan.due_date) < new Date();
        if (isOverdue) {
            return <Badge variant="destructive">Overdue</Badge>;
        }

        return <Badge variant="default">Active</Badge>;
    };

    const getDaysUntilDue = () => {
        const due = new Date(loan.due_date);
        const now = new Date();
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysUntilDue = getDaysUntilDue();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Loan Details - ${loan.book.book_title}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Loan Details</h1>
                        <p className="text-muted-foreground">
                            Loan ID: {loan.id}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {loan.status === 'active' && (
                            <Button onClick={handleReturnBook}>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Return Book
                            </Button>
                        )}
                        <Button variant="outline" asChild>
                            <Link href="/loans">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Loans
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Book Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Book className="h-5 w-5" />
                                Book Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">{loan.book.book_title}</h3>
                                <p className="text-muted-foreground">by {loan.book.author}</p>
                            </div>
                            <div className="grid gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium">Publisher:</span>
                                    <span>{loan.book.publisher}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Genre:</span>
                                    <span>{loan.book.genre}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Student Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Student Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {loan.transaction.student.first_name} {loan.transaction.student.last_name}
                                </h3>
                                <p className="text-muted-foreground">Year {loan.transaction.student.year_level}</p>
                            </div>
                            <div className="grid gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium">Email:</span>
                                    <span>{loan.transaction.student.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Student ID:</span>
                                    <span>{loan.transaction.student.id}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Loan Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Loan Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium">Status:</span>
                                    <span>{getStatusBadge()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Loan Date:</span>
                                    <span>{new Date(loan.loan_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Due Date:</span>
                                    <span className={loan.status === 'active' && daysUntilDue < 0 ? 'text-red-600 font-semibold' : ''}>
                                        {new Date(loan.due_date).toLocaleDateString()}
                                    </span>
                                </div>
                                {loan.status === 'active' && (
                                    <div className="flex justify-between">
                                        <span className="font-medium">Days Until Due:</span>
                                        <span className={daysUntilDue < 0 ? 'text-red-600 font-semibold' : daysUntilDue <= 3 ? 'text-orange-600 font-semibold' : ''}>
                                            {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`}
                                        </span>
                                    </div>
                                )}
                                {loan.return_date && (
                                    <div className="flex justify-between">
                                        <span className="font-medium">Return Date:</span>
                                        <span>{new Date(loan.return_date).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {loan.payment_amount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="font-medium">Payment Amount:</span>
                                        <span className="font-semibold">${loan.payment_amount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendant Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5" />
                                Library Attendant
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {loan.transaction.attendant.first_name} {loan.transaction.attendant.last_name}
                                </h3>
                                <p className="text-muted-foreground">Processing Attendant</p>
                            </div>
                            <div className="grid gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium">Email:</span>
                                    <span>{loan.transaction.attendant.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Transaction Date:</span>
                                    <span>{new Date(loan.transaction.transaction_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>
                            Additional actions for this loan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link href={`/students/${loan.transaction.student.id}`}>
                                    <User className="h-4 w-4 mr-2" />
                                    View Student Profile
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={`/books/${loan.book.id}`}>
                                    <Book className="h-4 w-4 mr-2" />
                                    View Book Details
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
