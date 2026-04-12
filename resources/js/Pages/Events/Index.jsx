import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const formatDateTime = (dateString) =>
    new Intl.DateTimeFormat('en-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(dateString));

export default function Index({ events }) {
    const { auth, flash, errors } = usePage().props;
    const user = auth.user;
    const openEventsCount = events.filter((event) => event.registration_is_open).length;
    const participantCount = events.reduce(
        (total, event) => total + event.participants_count,
        0,
    );
    const [featuredEvent, ...otherEvents] = events;

    const renderEventCard = (event, featured = false) => (
        <article
            key={event.id}
            className={`group ${featured ? 'surface-panel grid gap-8 overflow-hidden lg:grid-cols-[1.15fr_0.85fr]' : 'surface-panel flex flex-col gap-6'}`}
        >
            <div>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="editorial-kicker">{event.recurrence}</p>
                        <h2 className={`${featured ? 'mt-3 text-3xl sm:text-4xl' : 'mt-3 text-2xl'} font-bold text-[color:var(--on-surface)]`}>
                            {event.name}
                        </h2>
                    </div>
                    <span className={event.registration_is_open ? 'pill-open' : 'pill-closed'}>
                        {event.registration_is_open ? 'Open' : 'Closed'}
                    </span>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--on-surface-variant)] sm:text-base">
                    {featured
                        ? 'A high-visibility company event with registration, venue logistics, and participant momentum all in one place.'
                        : 'Session details, venue context, and participant visibility for quick decision-making.'}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="surface-subtle">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                            Schedule
                        </p>
                        <p className="mt-2 text-sm font-semibold text-[color:var(--on-surface)] sm:text-base">
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
                        <p className="mt-2 text-sm font-semibold text-[color:var(--on-surface)] sm:text-base">
                            {event.venue.name}
                        </p>
                        <p className="mt-1 text-sm text-[color:var(--on-surface-variant)]">
                            {event.venue.address}, {event.venue.city}
                        </p>
                        {event.venue.google_maps_url && (
                            <a
                                href={event.venue.google_maps_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-link mt-3 inline-flex"
                            >
                                Open in Google Maps
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className={`flex flex-col justify-between gap-6 rounded-[24px] bg-[color:var(--surface-container-low)] p-5 sm:p-6 ${featured ? 'h-full' : 'flex-1'}`}>
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                        Participants
                    </p>
                    <p className="mt-3 font-['Lexend'] text-4xl font-bold tracking-tight text-[color:var(--primary)]">
                        {event.participants_count}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--on-surface-variant)]">
                        registered teammates
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                        {event.participants.length > 0 ? (
                            event.participants.map((participant) => (
                                <span key={participant.id} className="chip">
                                    {participant.name}
                                </span>
                            ))
                        ) : (
                            <p className="text-sm text-[color:var(--on-surface-variant)]">
                                No participants yet.
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {user ? (
                        event.is_registered ? (
                            <span className="button-secondary">You are registered</span>
                        ) : event.registration_is_open ? (
                            <Link
                                href={route('events.registrations.store', event.id)}
                                method="post"
                                as="button"
                                className="button-accent"
                            >
                                Join event
                            </Link>
                        ) : (
                            <span className="button-danger">Registration closed</span>
                        )
                    ) : (
                        <Link href={route('login')} className="button-accent">
                            Log in to register
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );

    return (
        <>
            <Head title="Sports Events" />

            <AuthenticatedLayout>
                <div className="header-content">
                    

                    <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                        <div className="pl-2 sm:pl-6 lg:pl-10">
                            <p className="editorial-kicker">Velocity Editorial</p>
                            <h2 className="mt-4 max-w-4xl text-4xl font-extrabold leading-[1.02] text-[color:var(--on-surface)] sm:text-5xl lg:text-6xl">
                                Browse upcoming company events with sharper context and faster sign-up.
                            </h2>
                            <p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--on-surface-variant)] sm:text-lg">
                                Check schedules, venue details, registration status, and participant momentum before committing to the next session.
                            </p>
                        </div>

                        <div className="surface-panel grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                                    Published events
                                </p>
                                <p className="mt-3 font-['Lexend'] text-4xl font-bold tracking-tight text-[color:var(--primary)]">
                                    {events.length}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                                    Open registration
                                </p>
                                <p className="mt-3 font-['Lexend'] text-4xl font-bold tracking-tight text-[color:var(--secondary)]">
                                    {openEventsCount}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                                    Participants tracked
                                </p>
                                <p className="mt-3 font-['Lexend'] text-4xl font-bold tracking-tight text-[color:var(--primary)]">
                                    {participantCount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 space-y-6">
                    {flash.success && (
                        <div className="feedback-success">{flash.success}</div>
                    )}

                    {errors.registration && (
                        <div className="feedback-error">{errors.registration}</div>
                    )}

                    {events.length === 0 ? (
                        <div className="surface-panel text-center">
                            <p className="editorial-kicker">No live board</p>
                            <h3 className="mt-3 text-2xl font-bold text-[color:var(--primary)]">
                                No upcoming events are published yet.
                            </h3>
                            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[color:var(--on-surface-variant)]">
                                Once an event is created, it will appear here with schedule, venue, and registration status.
                            </p>
                        </div>
                    ) : (
                        <>
                            {featuredEvent && renderEventCard(featuredEvent, true)}

                            {otherEvents.length > 0 && (
                                <section className="space-y-4">
                                    <div className="pl-2 sm:pl-4">
                                        <p className="editorial-kicker">More sessions</p>
                                        <h3 className="mt-2 text-2xl font-bold text-[color:var(--primary)]">
                                            Event board
                                        </h3>
                                    </div>

                                    <div className="grid gap-5 xl:grid-cols-2">
                                        {otherEvents.map((event) => renderEventCard(event))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </div>
            </AuthenticatedLayout>
        </>
    );
}
