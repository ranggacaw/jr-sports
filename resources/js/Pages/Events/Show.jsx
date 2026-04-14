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

            {/* Error Message */}
            {errors?.registration && (
                <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[28px] bg-[color:var(--surface-container-lowest)] px-5 py-4 text-sm font-semibold text-red-700 shadow-[0_40px_40px_-5px_rgba(25,28,32,0.06)]">
                        {errors.registration}
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative w-full h-[360px] sm:h-[480px] lg:h-[600px] overflow-hidden">
                <img 
                    alt="Stadium Background" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuARUYFhko2mUYgsn4A6pzbg7OTXbPSYlgR3z6yeYOuoDiKvROmDG0CMy8aAVHmwKthyJhH31o1e8znSUw3iiqJaoWIdzOCWOgQWd9JmDSzZmta8f8UURhwYpuKkGcHsyGMZWDRNh0ZyjQlgc8bu5p_jIsAvOFD434nZDxqz3IojZu6YqYPPgtIc0XFG_zumkxxi5GNsDDHq-MfsKB42ucF0uSN6TDg4X5rh4gQELfkgMnhyla_ui1ujm5-TN484SUgYDP4PIPJdXt8K" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--primary)] via-[color:var(--primary)]/60 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 mb-2 lg:mb-8">
                    <div className="mx-auto max-w-7xl flex flex-col gap-4">
                        <Link
                            href={route('events.index')}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:gap-3 hover:text-white mb-2 md:mb-4"
                        >
                            <span className="material-symbols-outlined text-base xl:text-lg">arrow_back</span>
                            Back to events
                        </Link>
                        <span className="inline-block bg-[color:var(--tertiary-container)] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest self-start">
                            {event.recurrence || 'Upcoming session'}
                        </span>
                        <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-2">
                            {event.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-white/90">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-white/70">calendar_today</span>
                                <span className="font-bold sm:text-base text-sm">{formatDateTime(event.starts_at)}</span>
                            </div>
                            {event.ends_at && (
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-white/70">schedule</span>
                                    <span className="font-bold sm:text-base text-sm">Ends {formatDateTime(event.ends_at)}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-white/70">location_on</span>
                                <span className="font-bold sm:text-base text-sm">{event.venue.name}, {event.venue.city}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-12">
                
                {/* Details & Participants */}
                <div className="flex-1 flex flex-col gap-10 md:gap-12">
                    
                    {/* Bento Grid Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[color:var(--surface-container-lowest)] p-6 sm:p-8 rounded-[1rem] shadow-[0_40px_40px_-5px_rgba(25,28,32,0.06)] border-l-4 border-[color:var(--primary)]">
                            <h3 className="font-label uppercase tracking-widest text-[color:var(--on-surface-variant)] font-bold mb-4 text-xs md:text-sm">Participant Count</h3>
                            <div className="flex items-start justify-between">
                                <span className="text-3xl sm:text-4xl font-black text-[color:var(--primary)]">{event.participants_count} Joined</span>
                            </div>
                        </div>
                        <div className="bg-[color:var(--surface-container-lowest)] p-6 sm:p-8 rounded-[1rem] shadow-[0_40px_40px_-5px_rgba(25,28,32,0.06)] border-l-4 border-[color:var(--tertiary)]">
                            <h3 className="font-label uppercase tracking-widest text-[color:var(--on-surface-variant)] font-bold mb-4 text-xs md:text-sm">Registration Status</h3>
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-[color:var(--tertiary)] text-3xl sm:text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    {event.registration_is_open ? (event.is_registered ? 'how_to_reg' : 'verified_user') : 'cancel'}
                                </span>
                                <span className="text-xl sm:text-xl font-bold">{statusText}</span>
                            </div>
                        </div>
                    </div>

                    {/* Registration Actions */}
                    <div className="flex flex-wrap gap-4 sm:gap-6">
                        {event.registration_is_open && !event.is_registered && (
                            <Link 
                                href={route('events.registrations.store', event.id)}
                                method="post"
                                as="button"
                                className="button-primary px-8 sm:px-10 py-4 sm:py-5 !rounded-full font-bold text-base sm:text-lg flex items-center gap-3 hover:scale-105 transition-transform"
                            >
                                Join Event
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </Link>
                        )}
                        <a
                            href={venueUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white border-2 border-[color:var(--outline-variant)]/40 text-[color:var(--primary)] px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg flex items-center gap-3 hover:bg-[color:var(--surface-container-low)] transition-colors"
                        >
                            View on Google Maps
                            <span className="material-symbols-outlined">map</span>
                        </a>
                    </div>

                    {/* Participants Section */}
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-6 font-headline">Confirmed Participants</h2>
                        {event.participants.length === 0 ? (
                            <div className="rounded-[1rem] bg-[color:var(--surface-container-low)] px-6 py-8 text-center text-sm leading-7 text-[color:var(--on-surface-variant)]">
                                No one has joined this event yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {event.participants.map((participant) => (
                                    <div key={participant.id} className="bg-[color:var(--surface-container-lowest)] p-4 rounded-[1rem] flex items-center gap-4 transition-colors duration-300 hover:bg-[color:var(--surface-container-low)] shadow-[0_40px_40px_-5px_rgba(25,28,32,0.06)]">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary)] font-['Lexend'] text-sm font-bold text-white">
                                            {getParticipantInitials(participant.name)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-[color:var(--primary)] truncate">{participant.name}</p>
                                            <p className="text-[10px] text-[color:var(--on-surface-variant)] uppercase font-bold truncate">Player</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar / Venue Section */}
                <aside className="w-full lg:w-96 flex flex-col gap-8">
                    <div className="bg-[color:var(--surface-container-high)] p-6 sm:p-8 rounded-[1rem] shadow-[0_40px_40px_-5px_rgba(25,28,32,0.06)]">
                        <h3 className="text-2xl font-black mb-6 font-headline">Venue Access</h3>
                        <div className="rounded-lg overflow-hidden h-64 mb-6 relative group">
                            <img 
                                alt="Venue Map" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCaccWjvOFFORjWkcEOaLkCWJ52_OKb379KqJEhdwS-VTNdC3-cmD5v7lfn7F-bZqJJnNb3AUlHESof6Td340nwHMUcidaJoBgNhdWWvF2YSarH6TMJ3MNwwM2O2nYeVfViBv8srnTOISNuSaRKwUUvg6S18l_IqSGFljeO1BPWYluk2pB-5OAi2Hpl0bsWbxFeG08GBx7-4JelVSNn-3Kf1a3AMS_OTKHL0R6-VKnRNgWzGKSPkaOiLIv2cn_RZNXjlYhav2jLLyM" 
                            />
                            <div className="absolute inset-0 bg-[color:var(--primary-container)]/10 pointer-events-none"></div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                                    <span className="material-symbols-outlined text-[color:var(--primary)] text-2xl">location_on</span>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="font-bold text-[color:var(--primary)]">{event.venue.name}</h4>
                                    <p className="text-sm text-[color:var(--on-surface-variant)] mt-1">{event.venue.address}, {event.venue.city}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

            </main>
        </AuthenticatedLayout>
    );
}
