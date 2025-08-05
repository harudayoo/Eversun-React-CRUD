import * as React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
}

interface FormCardProps {
  title: string;
  fields: FormField[];
  data?: Record<string, string | number | boolean>;
  submitRoute: string;
  backRoute: string;
  method?: 'post' | 'put' | 'patch';
  submitLabel?: string;
}

export function FormCard({
  title,
  fields,
  data = {},
  submitRoute,
  backRoute,
  method = 'post',
  submitLabel = 'Save'
}: FormCardProps) {
  const { data: formData, setData, post, put, patch, processing, errors } = useForm(data as Record<string, string | number | boolean>);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (method === 'post') {
      post(submitRoute);
    } else if (method === 'put') {
      put(submitRoute);
    } else if (method === 'patch') {
      patch(submitRoute);
    }
  };

  const handleInputChange = (name: string, value: string | number) => {
    setData(name, value);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] as string | number | undefined;

    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select
              value={value?.toString() || ''}
              onValueChange={(newValue) => handleInputChange(field.name, newValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError message={errors[field.name]} />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <textarea
              id={field.name}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={value?.toString() || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
            <InputError message={errors[field.name]} />
          </div>
        );

      default:
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              value={value?.toString() || ''}
              onChange={(e) => handleInputChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              min={field.min}
              max={field.max}
            />
            <InputError message={errors[field.name]} />
          </div>
        );
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={backRoute}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(renderField)}

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={processing}>
              <Save className="h-4 w-4 mr-2" />
              {processing ? 'Saving...' : submitLabel}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href={backRoute}>Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
