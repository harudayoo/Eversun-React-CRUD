import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, ArrowLeft, User, Calendar, FileText, Clock } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Transaction {
  id: number;
  students_id: number;
  attendants_id: number;
  transaction_date: string;
  transaction_type: 'borrow' | 'return';
  notes?: string;
  created_at: string;
  updated_at: string;
  student: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  attendant: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface TransactionsShowProps {
  transaction: Transaction;
}

export default function TransactionsShow({ transaction }: TransactionsShowProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Transactions', href: '/transactions' },
    { title: `Transaction #${transaction.id}`, href: `/transactions/${transaction.id}` },
  ];

  const getTypeBadge = (type: string) => {
    const variants = {
      borrow: 'default',
      return: 'secondary',
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants] || 'default'}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Transaction #${transaction.id} - Book Lending System`} />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/transactions">
              <ArrowLeft className="h-4 w-4" />
              Back to Transactions
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Transaction #{transaction.id}</h1>
            <p className="text-muted-foreground">Transaction Details</p>
          </div>
          <Button asChild>
            <Link href={`/transactions/${transaction.id}/edit`}>
              <Edit className="h-4 w-4" />
              Edit Transaction
            </Link>
          </Button>
        </div>

        {/* Transaction Details */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Transaction Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Type:</span>
                {getTypeBadge(transaction.transaction_type)}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Date:</span>
                <span>{new Date(transaction.transaction_date).toLocaleDateString()}</span>
              </div>
              {transaction.notes && (
                <div>
                  <span className="text-sm text-muted-foreground">Notes:</span>
                  <p className="mt-1">{transaction.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* People Involved */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                People Involved
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">Student:</span>
                <div className="mt-1">
                  <Link
                    href={`/students/${transaction.student.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {transaction.student.first_name} {transaction.student.last_name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{transaction.student.email}</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Attendant:</span>
                <div className="mt-1">
                  <Link
                    href={`/attendants/${transaction.attendant.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {transaction.attendant.first_name} {transaction.attendant.last_name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{transaction.attendant.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Record Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Created:</span>
              <span>{new Date(transaction.created_at).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated:</span>
              <span>{new Date(transaction.updated_at).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
