import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, ArrowLeft, User, Mail, Phone, Calendar, Clock } from 'lucide-react';
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

interface AttendantsShowProps {
  attendant: Attendant;
}

export default function AttendantsShow({ attendant }: AttendantsShowProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Attendants', href: '/attendants' },
    { title: `${attendant.first_name} ${attendant.last_name}`, href: `/attendants/${attendant.id}` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${attendant.first_name} ${attendant.last_name} - Book Lending System`} />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/attendants">
              <ArrowLeft className="h-4 w-4" />
              Back to Attendants
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{attendant.first_name} {attendant.last_name}</h1>
            <p className="text-muted-foreground">Library Attendant Details</p>
          </div>
          <Button asChild>
            <Link href={`/attendants/${attendant.id}/edit`}>
              <Edit className="h-4 w-4" />
              Edit Attendant
            </Link>
          </Button>
        </div>

        {/* Attendant Details */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="font-medium">{attendant.first_name} {attendant.last_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email:</span>
                <span>{attendant.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Contact:</span>
                <span>{attendant.contact_number}</span>
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Employment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Hire Date:</span>
                <span>{new Date(attendant.hire_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant="default">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Record Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Created:</span>
              <span>{new Date(attendant.created_at).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated:</span>
              <span>{new Date(attendant.updated_at).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
