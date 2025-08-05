import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
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

  const handleSearchChange = (value: string) => {
    setSearch(value);
    router.get('/transactions', {
      search: value,
    }, {
      preserveState: true,
      replace: true,
    });
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
      key: 'student',
      label: 'Student',
      render: (value: unknown, item: Record<string, unknown>) => {
        const transaction = item as unknown as Transaction;
        return `${transaction.student.first_name} ${transaction.student.last_name}`;
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
      key: 'notes',
      label: 'Notes',
      render: (value: unknown) => (value as string) || 'No notes',
    },
  ];

  // Transform the transactions data to match DataTable expectations
  const transformedTransactions = {
    data: transactions.data.map(transaction => ({ ...transaction } as Record<string, unknown>)),
    links: transactions.links,
    meta: transactions.meta,
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Transactions - Book Lending System" />
      <DataTable
        title="Transactions"
        data={transformedTransactions}
        columns={columns}
        searchValue={search}
        onSearchChange={handleSearchChange}
        createRoute="/transactions/create"
        editRoute={(id: number) => `/transactions/${id}/edit`}
        viewRoute={(id: number) => `/transactions/${id}`}
        deleteRoute={(id: number) => `/transactions/${id}`}
      />
    </AppLayout>
  );
}
