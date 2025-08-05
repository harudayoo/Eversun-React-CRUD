import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    contact_number: string;
    hire_date: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        contact_number: '',
        hire_date: new Date().toISOString().split('T')[0], // Default to today
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                            id="first_name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="given-name"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            disabled={processing}
                            placeholder="First name"
                        />
                        <InputError message={errors.first_name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                            id="last_name"
                            type="text"
                            required
                            tabIndex={2}
                            autoComplete="family-name"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            disabled={processing}
                            placeholder="Last name"
                        />
                        <InputError message={errors.last_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={3}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="contact_number">Contact Number</Label>
                        <Input
                            id="contact_number"
                            type="text"
                            required
                            tabIndex={4}
                            autoComplete="tel"
                            value={data.contact_number}
                            onChange={(e) => setData('contact_number', e.target.value)}
                            disabled={processing}
                            placeholder="Contact number"
                        />
                        <InputError message={errors.contact_number} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="hire_date">Hire Date</Label>
                        <Input
                            id="hire_date"
                            type="date"
                            required
                            tabIndex={5}
                            value={data.hire_date}
                            onChange={(e) => setData('hire_date', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.hire_date} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={6}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={7}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={8} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={9}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
