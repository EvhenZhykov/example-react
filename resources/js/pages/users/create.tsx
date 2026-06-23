import React from 'react';
import { Head, Link, Form, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import PasswordInput from '@/components/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import users from '@/routes/users';

export default function UsersCreate() {
  const { props } = usePage();
  const currentUser = (props as any).auth?.user;

  return (
    <>
      <Head title="Create User" />

      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Create User</h1>

        <Form action="/users" method="post" className="grid gap-4 max-w-md">
          {({ processing, errors }) => (
            <>
              <div className="grid gap-2">
                <Label htmlFor="first_name">First name</Label>
                <Input id="first_name" name="first_name" />
                <InputError message={errors.first_name} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input id="last_name" name="last_name" />
                <InputError message={errors.last_name} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput id="password" name="password" />
                <InputError message={errors.password} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Confirm password</Label>
                <PasswordInput id="password_confirmation" name="password_confirmation" />
                <InputError message={errors.password_confirmation} />
              </div>

              {currentUser?.is_admin ? (
                <div className="flex items-center gap-2">
                  <Checkbox id="is_admin" name="is_admin" />
                  <Label htmlFor="is_admin">Is admin</Label>
                </div>
              ) : null}

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
