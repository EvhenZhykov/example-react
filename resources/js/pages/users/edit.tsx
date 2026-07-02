import React, { useMemo } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import users from '@/routes/users';

type User = {
    id: number;
    name?: string;
    first_name?: string;
    last_name?: string;
    email: string;
    is_admin?: boolean;
};

type CurrentUser = {
    id?: number;
    is_admin?: boolean;
} | null;

type PageProps = {
    user: User;
    auth?: { user?: CurrentUser };
};

type FormData = {
    first_name: string;
    last_name: string;
    email: string;
    is_admin: boolean;
};

/**
 * Centralized name parsing logic (prevents UI complexity)
 */
function resolveNameParts(user: User) {
    const fallback = (user.name ?? '').trim().split(' ').filter(Boolean);

    const first =
        user.first_name ??
        fallback.slice(0, -1).join(' ') ??
        fallback[0] ??
        '';

    const last =
        user.last_name ??
        (fallback.length > 1 ? fallback[fallback.length - 1] : '');

    return { first, last };
}

export default function UsersEdit() {
    const { props } = usePage<PageProps>();

    const user = props.user;
    const currentUser = props.auth?.user ?? null;

    /**
     * Memoized derivation (runs only if user changes)
     */
    const initialValues = useMemo(() => {
        const { first, last } = resolveNameParts(user);

        return {
            first_name: first,
            last_name: last,
            email: user.email ?? '',
            is_admin: user.is_admin ?? false,
        };
    }, [user]);

    const { data, setData, post, processing, errors } =
        useForm<FormData>(initialValues);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(users.update(user.id).url);
    };

    return (
        <>
            <Head title="Edit User" />

            <div className="p-4">
                <h1 className="text-xl font-semibold mb-4">Edit User</h1>

                <form onSubmit={submit} className="grid gap-4 max-w-md">
                    <div className="grid gap-2">
                        <Label htmlFor="first_name">First name</Label>
                        <Input
                            id="first_name"
                            value={data.first_name}
                            onChange={(e) =>
                                setData('first_name', e.target.value)
                            }
                        />
                        <InputError message={errors.first_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="last_name">Last name</Label>
                        <Input
                            id="last_name"
                            value={data.last_name}
                            onChange={(e) =>
                                setData('last_name', e.target.value)
                            }
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

                    {currentUser?.is_admin && (
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

                        <Link href={users.index().url}>
                            <Button type="button" variant="ghost">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
