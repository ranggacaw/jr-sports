import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="JR Sports" />

            <AuthenticatedLayout>
                <div className="header-content">
                    

                    <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                        <div className="pl-2 sm:pl-6 lg:pl-10">
                            <p className="editorial-kicker">Velocity Editorial</p>
                            <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-[1.02] text-[color:var(--on-surface)] sm:text-5xl lg:text-6xl">
                                Internal sports events with clearer rhythm, stronger hierarchy, and faster action.
                            </h1>
                            <p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--on-surface-variant)] sm:text-lg">
                                JR Sports gives employees and admins a cleaner way to discover sessions, manage sign-ups, and keep participation visible across the company.
                            </p>
                        </div>

                        <div className="surface-panel grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                                    Public board
                                </p>
                                <p className="mt-3 text-sm leading-7 text-[color:var(--on-surface-variant)]">
                                    Browse events and registration status.
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                                    Member view
                                </p>
                                <p className="mt-3 text-sm leading-7 text-[color:var(--on-surface-variant)]">
                                    Track joined sessions from one dashboard.
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                                    Built with
                                </p>
                                <p className="mt-3 text-sm leading-7 text-[color:var(--on-surface-variant)]">
                                    Laravel {laravelVersion} and PHP {phpVersion}.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 grid gap-5 xl:grid-cols-3">
                    <section className="surface-panel xl:col-span-2">
                        <p className="editorial-kicker">Experience</p>
                        <h2 className="mt-3 text-3xl font-bold text-[color:var(--primary)]">
                            One product, two clear lanes.
                        </h2>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="surface-subtle">
                                <h3 className="text-xl font-bold text-[color:var(--on-surface)]">
                                    Employees
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-[color:var(--on-surface-variant)]">
                                    Review schedules, inspect venue details, and join open events without noise.
                                </p>
                            </div>
                            <div className="surface-subtle">
                                <h3 className="text-xl font-bold text-[color:var(--on-surface)]">
                                    Admins
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-[color:var(--on-surface-variant)]">
                                    Configure sessions, watch registrations build, and close sign-up windows when needed.
                                </p>
                            </div>
                        </div>
                    </section>

                    <aside className="metric-card-accent flex flex-col justify-between gap-6">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-100/70">
                                Live product
                            </p>
                            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
                                Built for motion, not clutter.
                            </h2>
                        </div>
                        <Link href={route('events.index')} className="button-accent self-start">
                            Open event board
                        </Link>
                    </aside>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
