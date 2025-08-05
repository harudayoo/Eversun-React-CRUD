import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/data-table';
import { type BreadcrumbItem } from '@/types';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  year_level: number;
  registered_date: string;
  created_at: string;
  updated_at: string;
}

interface StudentsIndexProps {
  students: {
    data: Student[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    meta: { from: number; to: number; total: number };
  };
  filters: {
    search?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Students', href: '/students' },
];

export default function StudentsIndex({ students, filters }: StudentsIndexProps) {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    router.get('/students', {
      search: value,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value: unknown, item: Record<string, unknown>) => {
        const student = item as unknown as Student;
        return `${student.first_name} ${student.last_name}`;
      },
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'contact_number',
      label: 'Contact Number',
    },
    {
      key: 'year_level',
      label: 'Year Level',
      render: (value: unknown) => `Year ${value}`,
    },
    {
      key: 'registered_date',
      label: 'Registration Date',
      render: (value: unknown) => new Date(value as string).toLocaleDateString(),
    },
  ];

  const transformedStudents = {
    data: students.data.map(student => ({ ...student } as Record<string, unknown>)),
    links: students.links,
    meta: students.meta,
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Students - Book Lending System" />
      <DataTable
        title="Students"
        data={transformedStudents}
        columns={columns}
        searchValue={search}
        onSearchChange={handleSearchChange}
        createRoute="/students/create"
        editRoute={(id: number) => `/students/${id}/edit`}
        viewRoute={(id: number) => `/students/${id}`}
        deleteRoute={(id: number) => `/students/${id}`}
      />
    </AppLayout>
  );
}
