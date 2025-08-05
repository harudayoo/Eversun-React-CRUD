import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FormCard } from '@/components/form-card';
import { type BreadcrumbItem } from '@/types';

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

interface TransactionsCreateProps {
  students: Student[];
  attendants: Attendant[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Transactions', href: '/transactions' },
  { title: 'Create', href: '/transactions/create' },
];

export default function TransactionsCreate({ students, attendants }: TransactionsCreateProps) {
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
      name: 'attendants_id',
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Transaction - Book Lending System" />
      <div className="space-y-6">
        <FormCard
          title="Create New Transaction"
          fields={fields}
          submitRoute="/transactions"
          backRoute="/transactions"
          method="post"
          submitLabel="Create Transaction"
        />
      </div>
    </AppLayout>
  );
}
