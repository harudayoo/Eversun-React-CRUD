import * as React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Eye, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  label: string;
  render?: (value: unknown, item: Record<string, unknown>) => React.ReactNode;
  sortable?: boolean;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationMeta {
  from: number;
  to: number;
  total: number;
}

interface DataTableProps {
  title: string;
  data: {
    data: Record<string, unknown>[];
    links: PaginationLink[];
    meta: PaginationMeta;
  };
  columns: Column[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  createRoute?: string;
  editRoute?: (id: number) => string;
  viewRoute?: (id: number) => string;
  deleteRoute?: (id: number) => string;
  filters?: React.ReactNode;
  actions?: {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
}

export function DataTable({
  title,
  data,
  columns,
  searchValue = '',
  onSearchChange,
  createRoute,
  editRoute,
  viewRoute,
  deleteRoute,
  filters,
  actions = { view: true, edit: true, delete: true }
}: DataTableProps) {
  const handleDeleteClick = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      // In a real app, you would handle the delete action here
      if (deleteRoute) {
        window.location.href = deleteRoute(id);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            {onSearchChange && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 md:w-80"
                />
              </div>
            )}
            {createRoute && (
              <Button asChild>
                <Link href={createRoute}>
                  <Plus className="h-4 w-4" />
                  Add New
                </Link>
              </Button>
            )}
          </div>
        </div>
        {filters && <div className="flex flex-wrap gap-2">{filters}</div>}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className="font-semibold">
                    {column.label}
                  </TableHead>
                ))}
                {(actions.view || actions.edit || actions.delete) && (
                  <TableHead className="font-semibold">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No data found.
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((item, index) => (
                  <TableRow key={(item.id as number) || index}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render
                          ? column.render(item[column.key], item)
                          : (item[column.key] as React.ReactNode)}
                      </TableCell>
                    ))}
                    {(actions.view || actions.edit || actions.delete) && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {actions.view && viewRoute && (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={viewRoute(item.id as number)}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          {actions.edit && editRoute && (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={editRoute(item.id as number)}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          {actions.delete && deleteRoute && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(item.id as number)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data.links && data.links.length > 3 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {data.meta?.from || 0} to {data.meta?.to || 0} of{' '}
              {data.meta?.total || 0} results
            </div>
            <div className="flex items-center space-x-2">
              {data.links.map((link: PaginationLink, index: number) => (
                <Button
                  key={index}
                  variant={link.active ? 'default' : 'outline'}
                  size="sm"
                  asChild={!!link.url}
                  disabled={!link.url}
                  className={cn(
                    !link.url && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {link.url ? (
                    <Link
                      href={link.url}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
