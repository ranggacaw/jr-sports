import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { useState, useEffect } from 'react';

const roleLabel = (isAdmin) => (isAdmin ? 'Admin' : 'User');

export default function Index({ users, stats, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    useEffect(() => {
        // Skip first render if search matches the filter from server.
        if (search === (filters?.search || '')) return;

        const delaySearch = setTimeout(() => {
            router.get(
                route('admin.users.index'),
                { search },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [search, filters?.search]);

    return (
        <AuthenticatedLayout>
            <Head title="User Master Data" />

            <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <section className="surface-panel space-y-6 p-6 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="editorial-kicker">Admin Area</p>
                            <h1 className="mt-2 text-3xl font-black tracking-tight text-[color:var(--primary)] sm:text-4xl">
                                User Master Data
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--on-surface-variant)]">
                                Manage active users, company divisions, and admin access from one place.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="surface-subtle rounded-3xl p-5">
                            <p className="text-xs font-black uppercase tracking-[0.25em] text-[color:var(--on-surface-variant)]">
                                Active Users
                            </p>
                            <p className="mt-3 text-4xl font-black text-[color:var(--primary)]">
                                {stats.active}
                            </p>
                        </div>
                        <div className="surface-subtle rounded-3xl p-5">
                            <p className="text-xs font-black uppercase tracking-[0.25em] text-[color:var(--on-surface-variant)]">
                                Admin Accounts
                            </p>
                            <p className="mt-3 text-4xl font-black text-[color:var(--primary)]">
                                {stats.admins}
                            </p>
                        </div>
                        <div className="surface-subtle rounded-3xl p-5">
                            <p className="text-xs font-black uppercase tracking-[0.25em] text-[color:var(--on-surface-variant)]">
                                Divisions Filled
                            </p>
                            <p className="mt-3 text-4xl font-black text-[color:var(--primary)]">
                                {stats.divisions_filled}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="surface-panel overflow-hidden p-0">
                    <div className="flex flex-col gap-6 border-b border-[color:var(--surface-dim)] bg-[color:var(--surface-container-lowest)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                        <div className="relative w-full max-w-md">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[color:var(--on-surface-variant)]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full rounded-full border-0 bg-[color:var(--surface-container-high)] py-3 pl-12 pr-5 text-sm text-[color:var(--on-surface)] transition-all focus:bg-[color:var(--surface-container-lowest)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[color:var(--primary)] placeholder:text-[color:var(--on-surface-variant)]"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <Link href={route('admin.events.index')} className="inline-flex items-center justify-center rounded-full border border-[color:var(--outline-variant)] bg-transparent px-6 py-2.5 text-sm font-bold uppercase tracking-[0.05em] text-[color:var(--primary)] transition-colors hover:bg-[color:var(--surface-container-low)]">
                                Event Admin
                            </Link>
                            <Link href={route('admin.users.create')} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--primary-container)] px-6 py-2.5 text-sm font-bold uppercase tracking-[0.05em] text-[color:var(--on-primary)] shadow-[0_8px_16px_-6px_rgba(0,47,87,0.4)] transition-transform hover:-translate-y-0.5">
                                Create User
                            </Link>
                        </div>
                    </div>
                    {users.data.length === 0 ? (
                        <div className="px-6 py-12 text-center text-sm text-[color:var(--on-surface-variant)]">
                            No active users yet.
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-full divide-y divide-[color:var(--surface-dim)] text-sm">
                                    <thead className="bg-[color:var(--surface-container-low)] text-left">
                                        <tr>
                                            <th className="px-6 py-4 font-black uppercase tracking-[0.2em] text-[color:var(--on-surface-variant)] whitespace-nowrap">
                                                Name
                                            </th>
                                            <th className="px-6 py-4 font-black uppercase tracking-[0.2em] text-[color:var(--on-surface-variant)] whitespace-nowrap">
                                                Email
                                            </th>
                                            <th className="px-6 py-4 font-black uppercase tracking-[0.2em] text-[color:var(--on-surface-variant)] whitespace-nowrap">
                                                Division
                                            </th>
                                            <th className="px-6 py-4 font-black uppercase tracking-[0.2em] text-[color:var(--on-surface-variant)] whitespace-nowrap">
                                                Access
                                            </th>
                                            <th className="px-6 py-4 font-black uppercase tracking-[0.2em] text-[color:var(--on-surface-variant)] w-1/5 whitespace-nowrap">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[color:var(--surface-dim)] bg-white/70">
                                        {users.data.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 font-semibold text-[color:var(--on-surface)]">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 text-[color:var(--on-surface-variant)]">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 text-[color:var(--on-surface)]">
                                                    {user.division || 'Not set'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex rounded-full bg-[color:var(--primary)]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[color:var(--primary)]">
                                                        {roleLabel(user.is_admin)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-3">
                                                        <Link href={route('admin.users.edit', user.id)} className="text-sm font-semibold text-[color:var(--primary)]">
                                                            Edit
                                                        </Link>
                                                        <Link
                                                            href={route('admin.users.destroy', user.id)}
                                                            method="delete"
                                                            as="button"
                                                            className="text-sm font-semibold text-[color:var(--error)]"
                                                        >
                                                            Archive
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="border-t border-[color:var(--surface-dim)] px-6 py-4 bg-[color:var(--surface-container-low)]">
                                <Pagination links={users.links} />
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
