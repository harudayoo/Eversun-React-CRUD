import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FormCard } from '@/components/form-card';
import { type BreadcrumbItem } from '@/types';

interface Transaction {
  id: number;
  students_id: number;
  attendants_id: number;
  transaction_date: string;
  transaction_type: 'borrow' | 'return';
  notes?: string;
  status?: string;
  [key: string]: string | number | boolean | undefined;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
}

interface Attendant {
  id: number;
  first_name: string;
  last_name: string;
}

interface TransactionsEditProps {
  transaction: Transaction;
  students: Student[];
  attendants: Attendant[];
}

export default function TransactionsEdit({ transaction, students, attendants }: TransactionsEditProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Transactions', href: '/transactions' },
    { title: `Transaction #${transaction.id}`, href: `/transactions/${transaction.id}` },
    { title: 'Edit', href: `/transactions/${transaction.id}/edit` },
  ];

  const fields = [
    {
      name: 'students_id',
      label: 'Student',
      type: 'select' as const,
      required: true,
      options: students.map(student => ({
        value: student.id,
        label: `${student.first_name} ${student.last_name}`
      })),
    },
    {
      name: 'users_id',
      label: 'Attendant',
      type: 'select' as const,
      required: true,
      options: attendants.map(attendant => ({
        value: attendant.id,
        label: `${attendant.first_name} ${attendant.last_name}`
      })),
    },
    {
      name: 'transaction_type',
      label: 'Transaction Type',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'borrow', label: 'Borrow' },
        { value: 'return', label: 'Return' },
      ],
    },
    {
      name: 'transaction_date',
      label: 'Transaction Date',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea' as const,
      required: false,
      placeholder: 'Optional notes about this transaction',
    },
  ];

  const formData = Object.fromEntries(
    Object.entries(transaction).filter(([, value]) => value !== undefined)
  ) as Record<string, string | number | boolean>;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Transaction #${transaction.id} - Book Lending System`} />
      <div className="space-y-6">
        <FormCard
          title={`Edit Transaction #${transaction.id}`}
          fields={fields}
          data={formData}
          submitRoute={`/transactions/${transaction.id}`}
          backRoute="/transactions"
          method="put"
          submitLabel="Update Transaction"
        />
      </div>
    </AppLayout>
  );
}
