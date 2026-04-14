import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const formatDateTime = (dateString) =>
    new Intl.DateTimeFormat('en-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(dateString));

const getVenueMapUrl = (venue) =>
    venue.google_maps_url ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        [venue.name, venue.address, venue.city].filter(Boolean).join(', '),
    )}`;

const getParticipantInitials = (name) =>
    name
        .split(' ')
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

export default function Show({ event }) {
    const { errors } = usePage().props;
    const venueUrl = getVenueMapUrl(event.venue);
    const statusText = event.is_registered
        ? 'Registered'
        : event.registration_is_open
          ? 'Registration Open'
          : 'Registration Closed';

    return (
        <AuthenticatedLayout>
            <Head title={event.name} />

            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href={route('events.index')}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--primary)] transition hover:gap-3"
                    >
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        Back to events
                    </Link>

                    <div className="flex flex-wrap gap-3">
                        <a
                            href={venueUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="button-secondary px-4 py-2 text-sm"
                        >
                            Open venue map
                        </a>
                        {event.registration_is_open && !event.is_registered && (
                            <Link
                                href={route('events.registrations.store', event.id)}
                                method="post"
                                as="button"
                                className="button-primary px-4 py-2 text-sm"
                            >
                                Join event
                            </Link>
                        )}
                    </div>
                </div>

                {errors?.registration && (
                    <div className="rounded-[28px] bg-[color:var(--surface-container-lowest)] px-5 py-4 text-sm font-semibold text-red-700 shadow-[0_40px_40px_-5px_rgba(25,28,32,0.06)]">
                        {errors.registration}
                    </div>
                )}

                <section className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#002f57,#01457d)] text-white shadow-[0_40px_40px_-5px_rgba(25,28,32,0.06)]">
                    <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-10">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/70">
                                {event.recurrence || 'Upcoming session'}
                            </p>
                            <h1 className="mt-4 max-w-3xl font-['Lexend'] text-4xl font-extrabold tracking-tight sm:text-5xl">
                                {event.name}
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                                Review the full schedule, check venue logistics, and see who is already on the participant list before matchday.
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-[28px] bg-white/10 px-5 py-4 backdrop-blur-sm">
                                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/70">
                                        Starts
                                    </p>
                                    <p className="mt-2 text-lg font-semibold">
                                        {formatDateTime(event.starts_at)}
                                    </p>
                                </div>
                                <div className="rounded-[28px] bg-white/10 px-5 py-4 backdrop-blur-sm">
                                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/70">
                                        Status
                                    </p>
                                    <p className="mt-2 text-lg font-semibold">{statusText}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[32px] bg-white/12 p-6 backdrop-blur-sm">
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/70">
                                Venue briefing
                            </p>
                            <h2 className="mt-3 text-2xl font-bold">{event.venue.name}</h2>
                            <p className="mt-3 text-sm leading-7 text-white/80">
                                {event.venue.address}, {event.venue.city}
                            </p>
                            {event.ends_at && (
                                <p className="mt-5 text-sm font-medium text-white/80">
                                    Ends {formatDateTime(event.ends_at)}
                                </p>
                            )}

                            <div className="mt-8 rounded-[24px] bg-white/10 px-5 py-4">
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/70">
                                    Participant count
                                </p>
                                <p className="mt-2 font-['Lexend'] text-4xl font-extrabold tracking-tight">
                                    {event.participants_count}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <section className="surface-panel">
                        <p className="editorial-kicker">Schedule</p>
                        <h2 className="mt-2 text-2xl font-bold text-[color:var(--primary)]">
                            Event timeline
                        </h2>

                        <div className="mt-6 grid gap-4">
                            <div className="surface-subtle">
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                                    Start time
                                </p>
                                <p className="mt-2 text-base font-semibold text-[color:var(--on-surface)]">
                                    {formatDateTime(event.starts_at)}
                                </p>
                            </div>

                            <div className="surface-subtle">
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                                    Registration status
                                </p>
                                <p className="mt-2 text-base font-semibold text-[color:var(--on-surface)]">
                                    {statusText}
                                </p>
                            </div>

                            <div className="surface-subtle">
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                                    Venue
                                </p>
                                <p className="mt-2 text-base font-semibold text-[color:var(--on-surface)]">
                                    {event.venue.name}
                                </p>
                                <p className="mt-1 text-sm leading-7 text-[color:var(--on-surface-variant)]">
                                    {event.venue.address}, {event.venue.city}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="surface-panel">
                        <p className="editorial-kicker">Participants</p>
                        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                            <h2 className="text-2xl font-bold text-[color:var(--primary)]">
                                Current participant list
                            </h2>
                            <span className="rounded-full bg-[color:var(--surface-container-high)] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                                {event.participants_count} joined
                            </span>
                        </div>

                        {event.participants.length === 0 ? (
                            <div className="mt-6 rounded-[28px] bg-[color:var(--surface-container-low)] px-6 py-8 text-center text-sm leading-7 text-[color:var(--on-surface-variant)]">
                                No one has joined this event yet.
                            </div>
                        ) : (
                            <div className="mt-6 grid gap-3">
                                {event.participants.map((participant) => (
                                    <div
                                        key={participant.id}
                                        className="flex items-center gap-4 rounded-[24px] bg-[color:var(--surface-container-low)] px-5 py-4"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--primary)] font-['Lexend'] text-sm font-bold text-white">
                                            {getParticipantInitials(participant.name)}
                                        </div>
                                        <div>
                                            <p className="text-base font-semibold text-[color:var(--on-surface)]">
                                                {participant.name}
                                            </p>
                                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                                                Confirmed participant
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
