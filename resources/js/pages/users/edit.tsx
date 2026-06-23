import React from 'react';
import { Head, Link, Form, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import users from '@/routes/users';

export default function UsersEdit() {
  const { props } = usePage();
  const { user } = props as any;

  // Provide first_name and last_name defaults by splitting user.name if present
  const nameParts = (user?.name ?? '').split(' ');
  const defaultFirst = user?.first_name ?? (nameParts.slice(0, -1).join(' ') || nameParts[0] || '');
  const defaultLast = user?.last_name ?? (nameParts.length > 1 ? nameParts[nameParts.length - 1] : '');

  return (
    <>
      <Head title="Edit User" />
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Edit User</h1>

        <Form action={`/users/${user.id}`} method="post" className="grid gap-4 max-w-md">
          {({ processing, errors }) => (
            <>
              <input type="hidden" name="_method" value="put" />

              <div className="grid gap-2">
                <Label htmlFor="first_name">First name</Label>
                <Input id="first_name" name="first_name" defaultValue={user?.first_name ?? defaultFirst} />
                <InputError message={errors.first_name} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input id="last_name" name="last_name" defaultValue={user?.last_name ?? defaultLast} />
                <InputError message={errors.last_name} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={user?.email ?? ''} />
                <InputError message={errors.email} />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save'}
                </Button>
                <Link href={users.index().url} className="ml-2">
                  <Button variant="ghost">Cancel</Button>
                </Link>
              </div>
            </>
          )}
        </Form>
      </div>
    </>
  );
}
