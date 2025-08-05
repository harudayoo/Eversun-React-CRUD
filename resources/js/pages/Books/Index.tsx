import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';

interface Book {
  id: number;
  book_title: string;
  author: string;
  publisher: string;
  published_year: number;
  genre: string;
  status: 'available' | 'borrowed' | 'maintenance';
  date_added: string;
  created_at: string;
  updated_at: string;
}

interface BooksIndexProps {
  books: {
    data: Book[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    meta: { from: number; to: number; total: number };
  };
  filters: {
    search?: string;
    status?: string;
    genre?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Books', href: '/books' },
];

export default function BooksIndex({ books, filters }: BooksIndexProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || 'all');
  const [genre, setGenre] = useState(filters.genre || 'all');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    router.get('/books', {
      search: value,
      status,
      genre,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    router.get('/books', {
      search,
      status: value === 'all' ? '' : value,
      genre,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleGenreChange = (value: string) => {
    setGenre(value);
    router.get('/books', {
      search,
      status,
      genre: value === 'all' ? '' : value,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      available: 'default',
      borrowed: 'secondary',
      maintenance: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const columns = [
    {
      key: 'book_title',
      label: 'Title',
    },
    {
      key: 'author',
      label: 'Author',
    },
    {
      key: 'publisher',
      label: 'Publisher',
    },
    {
      key: 'published_year',
      label: 'Year',
    },
    {
      key: 'genre',
      label: 'Genre',
      render: (value: unknown) => (
        <Badge variant="outline">{value as string}</Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => getStatusBadge(value as string),
    },
    {
      key: 'date_added',
      label: 'Date Added',
      render: (value: unknown) => new Date(value as string).toLocaleDateString(),
    },
  ];

  const statusFilter = (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="available">Available</SelectItem>
        <SelectItem value="borrowed">Borrowed</SelectItem>
        <SelectItem value="maintenance">Maintenance</SelectItem>
      </SelectContent>
    </Select>
  );

  const genreFilter = (
    <Select value={genre} onValueChange={handleGenreChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Genre" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Genres</SelectItem>
        <SelectItem value="Fiction">Fiction</SelectItem>
        <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
        <SelectItem value="Science">Science</SelectItem>
        <SelectItem value="History">History</SelectItem>
        <SelectItem value="Biography">Biography</SelectItem>
        <SelectItem value="Technology">Technology</SelectItem>
        <SelectItem value="Literature">Literature</SelectItem>
      </SelectContent>
    </Select>
  );

  // Transform the books data to match DataTable expectations
  const transformedBooks = {
    data: books.data.map(book => ({ ...book } as Record<string, unknown>)),
    links: books.links,
    meta: books.meta,
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Books - Book Lending System" />
      <div className="space-y-6">
        <DataTable
          title="Books"
          data={transformedBooks}
          columns={columns}
          searchValue={search}
          onSearchChange={handleSearchChange}
          createRoute="/books/create"
          viewRoute={(id) => `/books/${id}`}
          editRoute={(id) => `/books/${id}/edit`}
          deleteRoute={(id) => `/books/${id}`}
          filters={
            <div className="flex gap-2">
              {statusFilter}
              {genreFilter}
            </div>
          }
        />
      </div>
    </AppLayout>
  );
}
