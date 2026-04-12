import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatDateTime = (dateString) =>
    new Intl.DateTimeFormat('en-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(dateString));

export default function Index({ events }) {
    const openEvents = events.filter((event) => event.registration_is_open).length;
    const totalParticipants = events.reduce(
        (total, event) => total + event.participants_count,
        0,
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                    <div className="pl-2 sm:pl-6 lg:pl-10">
                        <p className="editorial-kicker">Admin control</p>
                        <h2 className="mt-4 text-4xl font-extrabold leading-tight text-[color:var(--on-surface)] sm:text-5xl">
                            Event management board.
                        </h2>
                        <p className="mt-4 max-w-2xl text-base leading-8 text-[color:var(--on-surface-variant)]">
                            Create sessions, monitor registrations, and close sign-up windows when participation reaches the limit.
                        </p>
                    </div>

                    <div className="surface-panel">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                            Admin action
                        </p>
                        <h3 className="mt-3 text-2xl font-bold text-[color:var(--primary)]">
                            Launch a new event
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-[color:var(--on-surface-variant)]">
                            Configure timing, recurrence, venue details, and registration flow in one place.
                        </p>
                        <div className="mt-5">
                            <Link
                                href={route('admin.events.create')}
                                className="button-accent"
                            >
                                Create event
                            </Link>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Admin Events" />

            <div className="space-y-6 pb-6">
                <div className="grid gap-5 md:grid-cols-3">
                    <div className="metric-card-accent">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-100/70">
                            Total events
                        </p>
                        <p className="mt-4 font-['Lexend'] text-5xl font-bold tracking-tight">
                            {events.length}
                        </p>
                    </div>

                    <div className="metric-card">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                            Registration open
                        </p>
                        <p className="mt-4 font-['Lexend'] text-5xl font-bold tracking-tight text-[color:var(--secondary)]">
                            {openEvents}
                        </p>
                    </div>

                    <div className="metric-card">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                            Participants tracked
                        </p>
                        <p className="mt-4 font-['Lexend'] text-5xl font-bold tracking-tight text-[color:var(--primary)]">
                            {totalParticipants}
                        </p>
                    </div>
                </div>

                {events.length === 0 ? (
                    <div className="surface-panel text-center">
                        <p className="editorial-kicker">Empty board</p>
                        <h3 className="mt-3 text-2xl font-bold text-[color:var(--primary)]">
                            No events have been created yet.
                        </h3>
                    </div>
                ) : (
                    <div className="grid gap-5 xl:grid-cols-2">
                        {events.map((event) => (
                            <article key={event.id} className="surface-panel">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="editorial-kicker">{event.recurrence}</p>
                                        <h3 className="mt-3 text-2xl font-bold text-[color:var(--on-surface)]">
                                            {event.name}
                                        </h3>
                                    </div>
                                    <span className={event.registration_is_open ? 'pill-open' : 'pill-closed'}>
                                        {event.registration_is_open ? 'Open' : 'Closed'}
                                    </span>
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

                                <div className="mt-4 surface-subtle">
                                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                                        Participants
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-[color:var(--on-surface)]">
                                        {event.participants_count} registered users
                                    </p>
                                    {event.participants && event.participants.length > 0 ? (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {event.participants.map((participant) => (
                                                <span key={participant.id} className="chip">
                                                    {participant.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-3 text-sm text-[color:var(--on-surface-variant)]">
                                            No registered users yet.
                                        </p>
                                    )}
                                </div>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Link
                                        href={route('admin.events.edit', event.id)}
                                        className="button-secondary"
                                    >
                                        Edit event
                                    </Link>

                                    {event.registration_is_open && (
                                        <Link
                                            href={route('admin.events.close-registration', event.id)}
                                            method="patch"
                                            as="button"
                                            className="button-danger"
                                        >
                                            Close registration
                                        </Link>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
