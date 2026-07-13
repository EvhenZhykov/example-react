import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import PasswordInput from '@/components/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import users from '@/routes/users';

import type { CurrentUser } from '@/types/shared';

type CreatePageProps = {
    auth?: { user?: CurrentUser };
};

type FormData = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    is_admin: boolean;
};

export default function UsersCreate() {
    const { props } = usePage<CreatePageProps>();

    const currentUser = props.auth?.user ?? null;

    const firstRef = useRef<HTMLInputElement | null>(null);

    const { data, setData, post, processing, errors } = useForm<FormData>({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        is_admin: false,
    });

    useEffect(() => {
        firstRef.current?.focus();
    }, []);

    const isAdminVisible = useMemo(() => {
        return Boolean(currentUser?.is_admin);
    }, [currentUser]);

    const submit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            post(users.index().url);
        },
        [post]
    );

    const handleCancel = useCallback(() => {
        router.visit(users.index().url);
    }, []);

    const title = useMemo(() => 'Create User', []);

    return (
        <>
            <Head title={title} />

            <div className="p-4">
                <h1 className="text-xl font-semibold mb-4">{title}</h1>

                <form onSubmit={submit} className="grid gap-4 max-w-md">
                    <div className="grid gap-2">
                        <Label htmlFor="first_name">First name</Label>
                        <Input
                            id="first_name"
                            ref={firstRef}
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                        />
                        <InputError message={errors.first_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="last_name">Last name</Label>
                        <Input
                            id="last_name"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                        />
                        <InputError message={errors.last_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <PasswordInput
                            id="password"
                            value={data.password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setData('password', e.target.value)
                            }
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirm password
                        </Label>
                        <PasswordInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setData('password_confirmation', e.target.value)
                            }
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {isAdminVisible && (
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_admin"
                                checked={data.is_admin}
                                onCheckedChange={(v) =>
                                    setData('is_admin', Boolean(v))
                                }
                            />
                            <Label htmlFor="is_admin">Is admin</Label>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save'}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
