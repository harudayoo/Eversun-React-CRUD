import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/data-table';
import { type BreadcrumbItem } from '@/types';

interface Attendant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  hire_date: string;
  created_at: string;
  updated_at: string;
}

interface AttendantsIndexProps {
  attendants: {
    data: Attendant[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    meta: { from: number; to: number; total: number };
  };
  filters: {
    search?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Attendants', href: '/attendants' },
];

export default function AttendantsIndex({ attendants, filters }: AttendantsIndexProps) {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    router.get('/attendants', {
      search: value,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const columns = [
    {
      key: 'first_name',
      label: 'First Name',
    },
    {
      key: 'last_name',
      label: 'Last Name',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'contact_number',
      label: 'Contact',
    },
    {
      key: 'hire_date',
      label: 'Hire Date',
      render: (value: unknown) => new Date(value as string).toLocaleDateString(),
    },
  ];

  // Transform the attendants data to match DataTable expectations
  const transformedAttendants = {
    data: attendants.data.map(attendant => ({ ...attendant } as Record<string, unknown>)),
    links: attendants.links,
    meta: attendants.meta,
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Attendants - Book Lending System" />
      <div className="space-y-6">
        <DataTable
          title="Library Attendants"
          data={transformedAttendants}
          columns={columns}
          searchValue={search}
          onSearchChange={handleSearchChange}
          createRoute="/attendants/create"
          viewRoute={(id) => `/attendants/${id}`}
          editRoute={(id) => `/attendants/${id}/edit`}
          deleteRoute={(id) => `/attendants/${id}`}
        />
      </div>
    </AppLayout>
  );
}
