import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FormCard } from '@/components/form-card';
import { type BreadcrumbItem } from '@/types';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  year_level: number;
  registered_date: string;
  [key: string]: string | number;
}

interface StudentsEditProps {
  student: Student;
}

export default function StudentsEdit({ student }: StudentsEditProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Students', href: '/students' },
    { title: student.first_name + ' ' + student.last_name, href: `/students/${student.id}` },
    { title: 'Edit', href: `/students/${student.id}/edit` },
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
      <Head title={`Edit ${student.first_name} ${student.last_name} - Book Lending System`} />
      <div className="space-y-6">
        <FormCard
          title={`Edit Student: ${student.first_name} ${student.last_name}`}
          fields={fields}
          data={student}
          submitRoute={`/students/${student.id}`}
          backRoute="/students"
          method="put"
          submitLabel="Update Student"
        />
      </div>
    </AppLayout>
  );
}
