import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye, Edit, Plus } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useTransactionUpdates } from '@/hooks/use-websocket-updates';

interface Transaction {
  id: number;
  students_id: number;
  users_id: number;
  transaction_date: string;
  transaction_type: 'borrow' | 'return';
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  student: {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
  };
  attendant: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

interface TransactionsIndexProps {
  transactions: {
    data: Transaction[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    meta: { from: number; to: number; total: number };
  };
  filters: {
    search?: string;
    type?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Transactions', href: '/transactions' },
];

export default function TransactionsIndex({ transactions, filters }: TransactionsIndexProps) {
  const [search, setSearch] = useState(filters.search || '');

  // Enable real-time updates via WebSocket
  useTransactionUpdates();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    router.get('/transactions', {
      search: value,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleCompleteTransaction = (transactionId: number) => {
    if (confirm('Are you sure you want to mark this transaction as completed? This will send an email notification to the student.')) {
      router.patch(`/transactions/${transactionId}/complete`, {}, {
        preserveState: true,
        onSuccess: () => {
          console.log('Transaction completed successfully');
        },
      });
    }
  };

  const handleCancelTransaction = (transactionId: number) => {
    if (confirm('Are you sure you want to cancel this transaction? This will send an email notification to the student.')) {
      router.patch(`/transactions/${transactionId}/cancel`, {}, {
        preserveState: true,
        onSuccess: () => {
          console.log('Transaction cancelled successfully');
        },
      });
    }
  };

  const getTypeBadge = (transactionType: string) => {
    const variants = {
      borrow: 'default',
      return: 'secondary',
    } as const;

    return (
      <Badge variant={variants[transactionType as keyof typeof variants] || 'default'}>
        {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      completed: 'secondary',
      cancelled: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const renderActions = (transaction: Transaction) => {
    return (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" asChild>
          <Link href={`/transactions/${transaction.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Link>
        </Button>

        {transaction.status === 'pending' && (
          <>
            <Button
              size="sm"
              variant="default"
              onClick={() => handleCompleteTransaction(transaction.id)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleCancelTransaction(transaction.id)}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </>
        )}

        {transaction.status !== 'cancelled' && (
          <Button size="sm" variant="outline" asChild>
            <Link href={`/transactions/${transaction.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
        )}
      </div>
    );
  };

  const columns = [
    {
      key: 'transaction_date',
      label: 'Date',
      render: (value: unknown) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: 'transaction_type',
      label: 'Type',
      render: (value: unknown) => getTypeBadge(value as string),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => getStatusBadge(value as string),
    },
    {
      key: 'student',
      label: 'Student',
      render: (value: unknown, item: Record<string, unknown>) => {
        const transaction = item as unknown as Transaction;
        return (
          <div>
            <div className="font-medium">
              {transaction.student.first_name} {transaction.student.last_name}
            </div>
            {transaction.student.email && (
              <div className="text-sm text-muted-foreground">
                {transaction.student.email}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'attendant',
      label: 'Attendant',
      render: (value: unknown, item: Record<string, unknown>) => {
        const transaction = item as unknown as Transaction;
        return `${transaction.attendant.first_name} ${transaction.attendant.last_name}`;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: unknown, item: Record<string, unknown>) => {
        const transaction = item as unknown as Transaction;
        return renderActions(transaction);
      },
    },
  ];

  const transformedTransactions = {
    data: transactions.data.map(transaction => ({ ...transaction } as Record<string, unknown>)),
    links: transactions.links,
    meta: transactions.meta,
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Transactions - Book Lending System" />

      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">
              Manage book lending transactions and their status
            </p>
          </div>
          <Button asChild>
            <Link href="/transactions/create">
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Link>
          </Button>
        </div>

        <DataTable
          title="Transaction Records"
          data={transformedTransactions}
          columns={columns}
          searchValue={search}
          onSearchChange={handleSearchChange}
        />
      </div>
    </AppLayout>
  );
}
