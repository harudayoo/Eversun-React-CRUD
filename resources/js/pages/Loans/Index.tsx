import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Book, Calendar, Clock, Plus, RotateCcw, Search, User } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Loans', href: '/loans' },
];

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
    };
    transaction: {
        student: {
            id: number;
            first_name: string;
            last_name: string;
        };
        attendant: {
            id: number;
            first_name: string;
            last_name: string;
        };
    };
}

interface LoansIndexProps {
    loans: {
        data: Loan[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        overdue?: string;
    };
}

export default function LoansIndex({ loans, filters }: LoansIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [showOverdue, setShowOverdue] = useState(filters.overdue === 'true');

    const handleSearch = () => {
        router.get('/loans', {
            search: search || undefined,
            status: status === 'all' ? undefined : status,
            overdue: showOverdue ? 'true' : undefined,
        }, {
            preserveState: true,
        });
    };

    const handleReturnBook = (loanId: number) => {
        if (confirm('Are you sure you want to mark this book as returned?')) {
            router.patch(`/loans/${loanId}/return`, {
                attendants_id: 1, // In a real app, this would be the authenticated attendant's ID
                payment_amount: 0, // Default to no payment
            });
        }
    };

    const getStatusBadge = (loan: Loan) => {
        if (loan.status === 'returned') {
            return <Badge variant="secondary">Returned</Badge>;
        }

        const isOverdue = loan.status === 'active' && new Date(loan.due_date) < new Date();
        if (isOverdue) {
            return <Badge variant="destructive">Overdue</Badge>;
        }

        return <Badge variant="default">Active</Badge>;
    };

    const getDaysUntilDue = (dueDate: string) => {
        const due = new Date(dueDate);
        const now = new Date();
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book Loans - Book Lending System" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Book Loans</h1>
                        <p className="text-muted-foreground">
                            Manage book lending transactions and returns
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/loans/create">
                            <Plus className="h-4 w-4 mr-2" />
                            New Loan
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filter Loans</CardTitle>
                        <CardDescription>
                            Search and filter loan records
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <label htmlFor="search" className="text-sm font-medium">
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Search by book title, student name..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="status" className="text-sm font-medium">
                                    Status
                                </label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="returned">Returned</SelectItem>
                                        <SelectItem value="overdue">Overdue</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="overdue"
                                    checked={showOverdue}
                                    onChange={(e) => setShowOverdue(e.target.checked)}
                                />
                                <label htmlFor="overdue" className="text-sm font-medium">
                                    Show only overdue
                                </label>
                            </div>
                            <Button onClick={handleSearch}>
                                <Search className="h-4 w-4 mr-2" />
                                Search
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Loans Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Loan Records ({loans.total} total)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Book</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Loan Date</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loans.data.map((loan) => {
                                    const daysUntilDue = getDaysUntilDue(loan.due_date);
                                    return (
                                        <TableRow key={loan.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Book className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">{loan.book.book_title}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            by {loan.book.author}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        {loan.transaction.student.first_name} {loan.transaction.student.last_name}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    {new Date(loan.loan_date).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        {new Date(loan.due_date).toLocaleDateString()}
                                                        {loan.status === 'active' && (
                                                            <div className={`text-xs ${daysUntilDue < 0 ? 'text-red-600' : daysUntilDue <= 3 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                                                                {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(loan)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    {loan.status === 'active' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleReturnBook(loan.id)}
                                                        >
                                                            <RotateCcw className="h-4 w-4 mr-1" />
                                                            Return
                                                        </Button>
                                                    )}
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/loans/${loan.id}`}>
                                                            View
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {loans.data.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <Book className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">No loans found</p>
                                <p>Try adjusting your search criteria or create a new loan.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
