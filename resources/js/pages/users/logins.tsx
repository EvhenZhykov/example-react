import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

type LoginLog = {
    id: number;
    ip_address?: string;
    user_agent?: string;
    created_at?: string;
    user?: { email?: string } | null;
};

type PaginationMeta = {
    current_page: number;
    last_page: number;
    prev_page_url?: string | null;
    next_page_url?: string | null;
};

type LogPageProps = {
    logs?: {
        data: LoginLog[];
        meta?: PaginationMeta;
    };
};

export default function UsersLogins() {
    const { props } = usePage<LogPageProps>();

    const logs = props.logs ?? { data: [], meta: undefined };
    const meta = logs.meta;

    return (
        <>
            <Head title="User Login Logs" />

            <div className="p-4">
                <h1 className="text-xl font-semibold mb-4">
                    User login logs
                </h1>

                <div className="overflow-hidden rounded-md border">
                    <table className="w-full table-fixed">
                        <thead>
                        <tr className="text-left">
                            <th className="p-3">ID</th>
                            <th className="p-3">User</th>
                            <th className="p-3">IP</th>
                            <th className="p-3">User Agent</th>
                            <th className="p-3">At</th>
                        </tr>
                        </thead>

                        <tbody>
                        {logs.data.length ? (
                            logs.data.map((l) => (
                                <tr key={l.id} className="border-t">
                                    <td className="p-3 align-top">
                                        {l.id}
                                    </td>

                                    <td className="p-3 align-top">
                                        {l.user?.email ?? '—'}
                                    </td>

                                    <td className="p-3 align-top">
                                        {l.ip_address}
                                    </td>

                                    <td className="p-3 align-top max-w-xl truncate">
                                        {l.user_agent}
                                    </td>

                                    <td className="p-3 align-top">
                                        {l.created_at}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="p-3" colSpan={5}>
                                    No logs
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div>
                        {meta && (
                            <span>
                                Page {meta.current_page} of {meta.last_page}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {meta?.prev_page_url && (
                            <Link href={meta.prev_page_url}>
                                <Button variant="outline">
                                    Previous
                                </Button>
                            </Link>
                        )}

                        {meta?.next_page_url && (
                            <Link href={meta.next_page_url}>
                                <Button variant="outline">
                                    Next
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
