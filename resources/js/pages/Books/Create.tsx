import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FormCard } from '@/components/form-card';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Books', href: '/books' },
  { title: 'Create', href: '/books/create' },
];

export default function BooksCreate() {
  const fields = [
    {
      name: 'book_title',
      label: 'Book Title',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter book title',
    },
    {
      name: 'author',
      label: 'Author',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter author name',
    },
    {
      name: 'publisher',
      label: 'Publisher',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter publisher name',
    },
    {
      name: 'published_year',
      label: 'Published Year',
      type: 'number' as const,
      required: true,
      min: 1800,
      max: new Date().getFullYear(),
    },
    {
      name: 'genre',
      label: 'Genre',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'Fiction', label: 'Fiction' },
        { value: 'Non-Fiction', label: 'Non-Fiction' },
        { value: 'Science', label: 'Science' },
        { value: 'History', label: 'History' },
        { value: 'Biography', label: 'Biography' },
        { value: 'Technology', label: 'Technology' },
        { value: 'Literature', label: 'Literature' },
        { value: 'Educational', label: 'Educational' },
        { value: 'Reference', label: 'Reference' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'available', label: 'Available' },
        { value: 'borrowed', label: 'Borrowed' },
        { value: 'maintenance', label: 'Under Maintenance' },
      ],
    },
    {
      name: 'date_added',
      label: 'Date Added',
      type: 'date' as const,
      required: true,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Book - Book Lending System" />
      <div className="space-y-6">
        <FormCard
          title="Add New Book"
          fields={fields}
          submitRoute="/books"
          backRoute="/books"
          method="post"
          submitLabel="Add Book"
        />
      </div>
    </AppLayout>
  );
}
