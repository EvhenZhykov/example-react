import { Head, Link, usePage } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import users from '@/routes/users';

type User = {
  id: number;
  name: string;
  email: string;
  created_at?: string;
};

export default function Users() {
  const { props } = usePage();
  const { users: userProps } = props as any; // users should be provided by the controller (paginated)

  const onDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    // Use Inertia global (available on window) to send a DELETE request to the destroy URL
    if ((window as any).Inertia && (window as any).Inertia.delete) {
      (window as any).Inertia.delete(users.destroy(id).url);

      return;
    }

    // fallback: navigate to the destroy URL with method delete
    if ((window as any).Inertia && (window as any).Inertia.visit) {
      (window as any).Inertia.visit(users.destroy(id).url, { method: 'delete' });
    }
  };

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
              {userProps?.data?.length ? (
                userProps.data.map((u: User) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-3 align-top">{u.id}</td>
                    <td className="p-3 align-top">{u.name}</td>
                    <td className="p-3 align-top">{u.email}</td>
                    <td className="p-3 align-top">{u.created_at}</td>
                    <td className="p-3 align-top">
                      <div className="flex gap-2">
                        <Link href={users.edit(u.id).url} className="inline-flex items-center gap-2">
                          <Pencil className="size-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={() => onDelete(u.id)}
                          aria-label={`Delete user ${u.email}`}
                        >
                          <Trash className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
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

        {/* Pagination controls - assumes meta with links or pagination info */}
        <div className="flex items-center justify-between">
          <div>
            {userProps?.meta ? (
              <span>
                Page {userProps.meta.current_page} of {userProps.meta.last_page}
              </span>
            ) : null}
          </div>

          <div className="flex gap-2">
            {userProps?.meta?.prev_page_url ? (
              <Link href={userProps.meta.prev_page_url} className="btn">
                Previous
              </Link>
            ) : null}
            {userProps?.meta?.next_page_url ? (
              <Link href={userProps.meta.next_page_url} className="btn">
                Next
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

// @ts-expect-error -- layout is attached dynamically by Inertia convention.
(Users as any).layout = {
  breadcrumbs: [
    {
      title: 'Users',
      href: users.index(),
    },
  ],
};
