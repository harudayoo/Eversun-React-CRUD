import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Book, Users, FileText, Plus, Eye, Clock, CheckCircle } from 'lucide-react';
import { useDashboardUpdates } from '@/hooks/use-websocket-updates';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    stats?: {
        activeLoans: number;
        overdueLoans: number;
        todayReturns: number;
        availableBooks: number;
    };
}

export default function Dashboard({ stats }: DashboardProps) {
    // Enable real-time dashboard stats updates via WebSocket
    useDashboardUpdates();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Book Lending System" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-foreground">Book Lending System</h1>
                    <p className="text-muted-foreground">Simple book lending management for library attendants</p>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                Active Loans
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats?.activeLoans ?? 0}</div>
                            <p className="text-xs text-muted-foreground">Currently borrowed</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4 text-red-600" />
                                Overdue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats?.overdueLoans ?? 0}</div>
                            <p className="text-xs text-muted-foreground">Past due date</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                Today's Returns
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats?.todayReturns ?? 0}</div>
                            <p className="text-xs text-muted-foreground">Books returned today</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Book className="h-4 w-4 text-gray-600" />
                                Available Books
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-600">{stats?.availableBooks ?? 0}</div>
                            <p className="text-xs text-muted-foreground">Ready to lend</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Primary Action - New Loan */}
                    <Card className="hover:shadow-md transition-shadow border-primary/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Plus className="h-5 w-5 text-primary" />
                                New Book Loan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="mb-4">
                                Issue a book to a student
                            </CardDescription>
                            <Button className="w-full" asChild>
                                <Link href="/loans/create">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Create Loan
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Active Loans */}
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-orange-500" />
                                Manage Returns
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="mb-4">
                                Process book returns and handle overdue items
                            </CardDescription>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/loans?status=active">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Active Loans
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Students */}
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                Student Lookup
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="mb-4">
                                Find students and view their lending history
                            </CardDescription>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/students">
                                    <Users className="h-4 w-4 mr-2" />
                                    Browse Students
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Management Tools */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Books Management */}
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Book className="h-5 w-5 text-green-600" />
                                Book Collection
                            </CardTitle>
                            <CardDescription>
                                Browse available books and manage inventory
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Button size="sm" asChild>
                                    <Link href="/books?status=available">
                                        <Book className="h-4 w-4" />
                                        Available Books
                                    </Link>
                                </Button>
                                <Button size="sm" variant="outline" asChild>
                                    <Link href="/books">
                                        <Eye className="h-4 w-4" />
                                        All Books
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Loan History */}
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-purple-600" />
                                Loan History
                            </CardTitle>
                            <CardDescription>
                                View transaction history and generate reports
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Button size="sm" asChild>
                                    <Link href="/loans">
                                        <FileText className="h-4 w-4" />
                                        All Loans
                                    </Link>
                                </Button>
                                <Button size="sm" variant="outline" asChild>
                                    <Link href="/loans?overdue=true">
                                        <Clock className="h-4 w-4" />
                                        Overdue
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lending Operations</CardTitle>
                        <CardDescription>
                            Quick access to daily lending tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="text-center p-4 bg-blue-50 rounded-lg dark:bg-blue-950/20">
                                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Process Returns</h3>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">Handle book returns and calculate fines</p>
                                <Button size="sm" variant="outline" asChild>
                                    <Link href="/loans?status=active">Process</Link>
                                </Button>
                            </div>
                            <div className="text-center p-4 bg-orange-50 rounded-lg dark:bg-orange-950/20">
                                <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                                <h3 className="font-semibold text-orange-900 dark:text-orange-100">Overdue Items</h3>
                                <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">Follow up on overdue books</p>
                                <Button size="sm" variant="outline" asChild>
                                    <Link href="/loans?overdue=true">View</Link>
                                </Button>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-green-950/20">
                                <Book className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                <h3 className="font-semibold text-green-900 dark:text-green-100">Quick Loan</h3>
                                <p className="text-sm text-green-700 dark:text-green-300 mb-3">Start new lending transaction</p>
                                <Button size="sm" variant="outline" asChild>
                                    <Link href="/loans/create">Start</Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
