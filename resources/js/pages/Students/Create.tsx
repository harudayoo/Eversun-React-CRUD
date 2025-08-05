import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FormCard } from '@/components/form-card';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Students', href: '/students' },
  { title: 'Create', href: '/students/create' },
];

export default function StudentsCreate() {
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
      name: 'year_level',
      label: 'Year Level',
      type: 'select' as const,
      required: true,
      options: [
        { value: 1, label: 'Year 1' },
        { value: 2, label: 'Year 2' },
        { value: 3, label: 'Year 3' },
        { value: 4, label: 'Year 4' },
        { value: 5, label: 'Year 5' },
      ],
    },
    {
      name: 'registered_date',
      label: 'Registration Date',
      type: 'date' as const,
      required: true,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Student - Book Lending System" />
      <div className="space-y-6">
        <FormCard
          title="Create New Student"
          fields={fields}
          submitRoute="/students"
          backRoute="/students"
          method="post"
          submitLabel="Create Student"
        />
      </div>
    </AppLayout>
  );
}
