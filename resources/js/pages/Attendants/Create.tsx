import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FormCard } from '@/components/form-card';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Attendants', href: '/attendants' },
  { title: 'Create', href: '/attendants/create' },
];

export default function AttendantsCreate() {
  const fields = [
    {
      name: 'first_name',
      label: 'First Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter first name',
    },
    {
      name: 'last_name',
      label: 'Last Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter last name',
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email' as const,
      required: true,
      placeholder: 'Enter email address',
    },
    {
      name: 'contact_number',
      label: 'Contact Number',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter contact number',
    },
    {
      name: 'hire_date',
      label: 'Hire Date',
      type: 'date' as const,
      required: true,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Attendant - Book Lending System" />
      <div className="space-y-6">
        <FormCard
          title="Add New Library Attendant"
          fields={fields}
          submitRoute="/attendants"
          backRoute="/attendants"
          method="post"
          submitLabel="Add Attendant"
        />
      </div>
    </AppLayout>
  );
}
