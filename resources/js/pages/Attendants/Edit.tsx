import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FormCard } from '@/components/form-card';
import { type BreadcrumbItem } from '@/types';

interface Attendant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  hire_date: string;
  [key: string]: string | number;
}

interface AttendantsEditProps {
  attendant: Attendant;
}

export default function AttendantsEdit({ attendant }: AttendantsEditProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Attendants', href: '/attendants' },
    { title: `${attendant.first_name} ${attendant.last_name}`, href: `/attendants/${attendant.id}` },
    { title: 'Edit', href: `/attendants/${attendant.id}/edit` },
  ];

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
      name: 'password',
      label: 'Password',
      type: 'password' as const,
      required: false,
      placeholder: 'Leave blank to keep current password',
    },
    {
      name: 'password_confirmation',
      label: 'Confirm Password',
      type: 'password' as const,
      required: false,
      placeholder: 'Confirm new password',
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

  const formData = {
    first_name: attendant.first_name,
    last_name: attendant.last_name,
    email: attendant.email,
    contact_number: attendant.contact_number,
    hire_date: attendant.hire_date,
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit ${attendant.first_name} ${attendant.last_name} - Book Lending System`} />
      <div className="space-y-6">
        <FormCard
          title={`Edit Attendant: ${attendant.first_name} ${attendant.last_name}`}
          fields={fields}
          data={formData}
          submitRoute={`/attendants/${attendant.id}`}
          backRoute="/attendants"
          method="put"
          submitLabel="Update Attendant"
        />
      </div>
    </AppLayout>
  );
}
