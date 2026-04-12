import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const formatDateTime = (dateString) =>
    new Intl.DateTimeFormat('en-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(dateString));

export default function Dashboard({ registeredEvents }) {
    const { auth } = usePage().props;
    const nextEvent = registeredEvents[0];

    return (
        <AuthenticatedLayout
            header={
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                    <div className="pl-2 sm:pl-6 lg:pl-10">
                        <p className="editorial-kicker">Personal hub</p>
                        <h2 className="mt-4 text-4xl font-extrabold leading-tight text-[color:var(--on-surface)] sm:text-5xl">
                            Your event momentum.
                        </h2>
                        <p className="mt-4 max-w-2xl text-base leading-8 text-[color:var(--on-surface-variant)]">
                            Review what you have joined, jump back into the public event board, and keep your next session visible.
                        </p>
                    </div>

                    <div className="surface-panel">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                            Next move
                        </p>
                        <h3 className="mt-3 text-2xl font-bold text-[color:var(--primary)]">
                            {nextEvent ? nextEvent.name : 'Browse the event board'}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-[color:var(--on-surface-variant)]">
                            {nextEvent
                                ? `You are already on the list for ${nextEvent.name}. Review the timing and venue details below.`
                                : 'You have not joined an event yet. Start with the public listing and register for the next open session.'}
                        </p>
                        <div className="mt-5">
                            <Link
                                href={route('events.index')}
                                className="button-accent"
                            >
                                Browse all events
                            </Link>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6 pb-6">
                <div className="grid gap-5 md:grid-cols-3">
                    <div className="metric-card-accent">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-100/70">
                            Joined events
                        </p>
                        <p className="mt-4 font-['Lexend'] text-5xl font-bold tracking-tight">
                            {registeredEvents.length}
                        </p>
                    </div>

                    <div className="metric-card">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                            Account role
                        </p>
                        <p className="mt-4 text-2xl font-bold text-[color:var(--primary)]">
                            {auth.user.is_admin ? 'Admin' : 'Registered user'}
                        </p>
                    </div>

                    <div className="metric-card">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                            Next step
                        </p>
                        <p className="mt-4 text-sm leading-7 text-[color:var(--on-surface-variant)]">
                            {registeredEvents.length > 0
                                ? 'Keep an eye on your upcoming schedule and venue details so there is no last-minute scramble.'
                                : 'Claim your first spot from the public event board and this space will start tracking your registrations.'}
                        </p>
                    </div>
                </div>

                {auth.user.is_admin && (
                    <div className="surface-panel flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="editorial-kicker">Admin note</p>
                            <h3 className="mt-2 text-2xl font-bold text-[color:var(--primary)]">
                                Management tools are active.
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-[color:var(--on-surface-variant)]">
                                Create new sessions, update logistics, and close registrations when capacity is reached.
                            </p>
                        </div>
                        <Link href={route('admin.events.index')} className="button-primary">
                            Open admin board
                        </Link>
                    </div>
                )}

                <section className="space-y-4">
                    <div className="pl-2 sm:pl-4">
                        <p className="editorial-kicker">Registered sessions</p>
                        <h3 className="mt-2 text-2xl font-bold text-[color:var(--primary)]">
                            Upcoming events you joined
                        </h3>
                    </div>

                    {registeredEvents.length === 0 ? (
                        <div className="surface-panel text-center">
                            <p className="text-sm leading-7 text-[color:var(--on-surface-variant)]">
                                No registrations yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 xl:grid-cols-2">
                            {registeredEvents.map((event) => (
                                <article key={event.id} className="surface-panel">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="editorial-kicker">{event.recurrence}</p>
                                            <h4 className="mt-3 text-2xl font-bold text-[color:var(--on-surface)]">
                                                {event.name}
                                            </h4>
                                        </div>
                                        <span className="pill-open">Joined</span>
                                    </div>

                                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                        <div className="surface-subtle">
                                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                                                Schedule
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-[color:var(--on-surface)]">
                                                {formatDateTime(event.starts_at)}
                                            </p>
                                            {event.ends_at && (
                                                <p className="mt-1 text-sm text-[color:var(--on-surface-variant)]">
                                                    Ends {formatDateTime(event.ends_at)}
                                                </p>
                                            )}
                                        </div>

                                        <div className="surface-subtle">
                                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                                                Venue
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-[color:var(--on-surface)]">
                                                {event.venue.name}
                                            </p>
                                            <p className="mt-1 text-sm text-[color:var(--on-surface-variant)]">
                                                {event.venue.address}, {event.venue.city}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
