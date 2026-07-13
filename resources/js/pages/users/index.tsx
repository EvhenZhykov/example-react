import React, { useCallback } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import users from '@/routes/users';
import type { User, Paginated } from '@/types/shared';

type PageProps = {
    users?: Paginated<User>;
};

export default function Users() {
    const { props } = usePage<PageProps>();

    const userProps = props.users ?? { data: [], meta: undefined };

    const handleDelete = useCallback((id: number, email: string) => {
        if (!confirm(`Delete user ${email}?`)) {
            return;
        }

        router.delete(users.destroy(id).url);
    }, []);

    const renderRows = () => {
        return userProps.data.map((u) => (
            <tr key={u.id} className="border-t">
                <td className="p-3 align-top">{u.id}</td>
                <td className="p-3 align-top">{u.name}</td>
                <td className="p-3 align-top">{u.email}</td>
                <td className="p-3 align-top">{u.created_at}</td>
                <td className="p-3 align-top">
                    <div className="flex gap-2">
                        <Link
                            href={users.edit(u.id).url}
                            className="inline-flex items-center gap-2"
                        >
                            <Pencil className="size-4" />
                            <span className="sr-only">Edit</span>
                        </Link>

                        <Button
                            variant="ghost"
                            onClick={() => handleDelete(u.id, u.email)}
                            aria-label={`Delete user ${u.email}`}
                        >
                            <Trash className="size-4 text-destructive" />
                        </Button>
                    </div>
                </td>
            </tr>
        ));
    };

    const meta = userProps.meta;

    return (
        <>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Users</h1>

                    <Link href={users.create().url}>
                        <Button>Create user</Button>
                    </Link>
                </div>

                <div className="overflow-hidden rounded-md border">
                    <table className="w-full table-fixed">
                        <thead>
                        <tr className="text-left">
                            <th className="p-3">ID</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Created</th>
                            <th className="p-3">Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {userProps.data.length ? (
                            renderRows()
                        ) : (
                            <tr>
                                <td className="p-3" colSpan={5}>
                                    No users
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        {meta && (
                            <span>
                                Page {meta.current_page} of {meta.last_page}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {meta?.prev_page_url ? (
                            <Link href={meta.prev_page_url}>
                                <Button variant="ghost">Previous</Button>
                            </Link>
                        ) : null}

                        {meta?.next_page_url ? (
                            <Button asChild variant="ghost">
                                <Link href={meta.next_page_url}>Next</Link>
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}

Users.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: users.index(),
        },
    ],
} as const;
