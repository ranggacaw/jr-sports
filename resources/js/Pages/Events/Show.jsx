import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import TournamentBracket from '@/Components/TournamentBracket';

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

const formatTournamentState = (value) =>
    ({
        group_stage: 'Group Stage',
        bracket_stage: 'Bracket Stage',
        completed: 'Completed',
    })[value] || 'Pending';

const renderMemberNames = (members = []) => {
    if (members.length <= 1) {
        return null;
    }

    return <p className="mt-1 text-xs text-[color:var(--on-surface-variant)]">{members.join(' / ')}</p>;
};

export default function Show({ event }) {
    const { errors } = usePage().props;
    const venueUrl = getVenueMapUrl(event.venue);
    const hasTournament = Boolean(event.tournament);
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

                    {hasTournament && (
                        <section className="space-y-8">
                            <div className="rounded-[1.5rem] bg-[color:var(--surface-container-lowest)] p-6 shadow-[0_40px_40px_-5px_rgba(25,28,32,0.06)]">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                     <div>
                                         <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-headline">Tournament Standings &amp; Brackets</h2>
                                         <p className="mt-2 text-sm text-[color:var(--on-surface-variant)]">
                                             Read-only tracking for the {event.tournament.format_label.toLowerCase()} draw with {event.tournament.entrant_count} active entrants.
                                         </p>
                                     </div>
                                     <span className="inline-flex self-start rounded-full bg-[color:var(--primary)]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[color:var(--primary)]">
                                         {formatTournamentState(event.tournament.state)}
                                     </span>
                                 </div>
                             </div>

                            {event.tournament.reserves.length > 0 && (
                                <div>
                                    <h3 className="mb-4 text-xl font-black tracking-tight">Reserve Players</h3>
                                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                        {event.tournament.reserves.map((reserve) => (
                                            <div key={reserve.registration_id} className="rounded-[1.25rem] bg-[color:var(--surface-container-lowest)] p-4 shadow-[0_40px_40px_-5px_rgba(25,28,32,0.06)]">
                                                <p className="font-bold text-[color:var(--on-surface)]">{reserve.name}</p>
                                                <p className="mt-1 text-xs text-[color:var(--on-surface-variant)]">Reserve only</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                             <div>
                                 <h3 className="mb-4 text-xl font-black tracking-tight">Group Standings</h3>
                                 <div className="grid gap-4 xl:grid-cols-2">
                                     {event.tournament.groups.map((group) => (
                                        <div key={group.name} className="rounded-[1.25rem] bg-[color:var(--surface-container-lowest)] p-5 shadow-[0_40px_40px_-5px_rgba(25,28,32,0.06)]">
                                            <div className="mb-4 flex items-center justify-between">
                                                <h4 className="text-lg font-black text-[color:var(--primary)]">Group {group.name}</h4>
                                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[color:var(--on-surface-variant)]">
                                                    Points / Diff
                                                </span>
                                            </div>
                                            <div className="space-y-3">
                                                {group.entries.map((entry) => (
                                                    <div key={entry.registration_id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-[color:var(--surface-container-low)] px-4 py-3">
                                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--primary)] text-sm font-black text-white">
                                                            {entry.rank || '-'}
                                                         </span>
                                                         <div>
                                                             <p className="font-bold text-[color:var(--on-surface)]">{entry.player_name}</p>
                                                            {renderMemberNames(entry.member_names)}
                                                             <p className="text-xs uppercase tracking-widest text-[color:var(--on-surface-variant)]">
                                                                 {entry.wins}W {entry.losses}L
                                                             </p>
                                                             {entry.qualification_rank && (
                                                                 <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-[color:var(--tertiary)]">
                                                                    Qual #{entry.qualification_rank} · {entry.bracket_label}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-black text-[color:var(--primary)]">{entry.points} pts</p>
                                                            <p className="text-xs text-[color:var(--on-surface-variant)]">{entry.point_differential >= 0 ? '+' : ''}{entry.point_differential}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {event.tournament.qualification.length > 0 && (
                                <div>
                                    <h3 className="mb-4 text-xl font-black tracking-tight">Qualification Outcome</h3>
                                    <div className="grid gap-4 xl:grid-cols-[minmax(0,18rem)_1fr]">
                                        {event.tournament.my_qualification && (
                                            <div className="rounded-[1.25rem] bg-[color:var(--surface-container-lowest)] p-5 shadow-[0_40px_40px_-5px_rgba(25,28,32,0.06)]">
                                                <p className="text-xs font-black uppercase tracking-[0.25em] text-[color:var(--on-surface-variant)]">
                                                    Your Placement
                                                </p>
                                                <p className="mt-3 text-4xl font-black text-[color:var(--primary)]">
                                                    #{event.tournament.my_qualification.qualification_rank}
                                                </p>
                                                <p className="mt-2 text-sm font-bold text-[color:var(--on-surface)]">
                                                    {event.tournament.my_qualification.bracket_label}
                                                </p>
                                                <p className="mt-1 text-sm text-[color:var(--on-surface-variant)]">
                                                    {event.tournament.my_qualification.points} pts · {event.tournament.my_qualification.point_differential >= 0 ? '+' : ''}{event.tournament.my_qualification.point_differential} diff
                                                </p>
                                            </div>
                                        )}

                                        <div className="rounded-[1.25rem] bg-[color:var(--surface-container-lowest)] p-5 shadow-[0_40px_40px_-5px_rgba(25,28,32,0.06)]">
                                            <div className="mb-4 flex items-center justify-between gap-3">
                                                <h4 className="text-lg font-black text-[color:var(--primary)]">Overall Ranking</h4>
                                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[color:var(--on-surface-variant)]">
                                                    Points / Diff
                                                </span>
                                            </div>
                                            <div className="space-y-3">
                                                {event.tournament.qualification.map((entry) => (
                                                    <div key={entry.registration_id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-[color:var(--surface-container-low)] px-4 py-3">
                                                         <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--tertiary)] text-sm font-black text-white">
                                                             {entry.qualification_rank}
                                                         </span>
                                                         <div>
                                                             <p className="font-bold text-[color:var(--on-surface)]">{entry.player_name}</p>
                                                            {renderMemberNames(entry.member_names)}
                                                             <p className="text-xs uppercase tracking-widest text-[color:var(--on-surface-variant)]">
                                                                 Group {entry.group_name} · Rank {entry.group_rank}
                                                             </p>
                                                         </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-black text-[color:var(--primary)]">{entry.bracket_label}</p>
                                                            <p className="text-xs text-[color:var(--on-surface-variant)]">{entry.points} pts · {entry.point_differential >= 0 ? '+' : ''}{entry.point_differential}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {event.tournament.my_matches.length > 0 && (
                                <div>
                                    <h3 className="mb-4 text-xl font-black tracking-tight">Your Tournament Matches</h3>
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        {event.tournament.my_matches.map((match) => (
                                            <div key={match.id} className="rounded-[1.25rem] bg-[color:var(--surface-container-lowest)] p-5 shadow-[0_40px_40px_-5px_rgba(25,28,32,0.06)]">
                                                <div className="flex items-center justify-between gap-3">
                                                     <div>
                                                         <p className="text-xs font-black uppercase tracking-[0.25em] text-[color:var(--on-surface-variant)]">
                                                             {match.group_name ? `Group ${match.group_name}` : match.round_name}
                                                         </p>
                                                         <p className="mt-2 font-bold text-[color:var(--on-surface)]">
                                                             {match.player_one_name} vs {match.player_two_name}
                                                         </p>
                                                        {renderMemberNames(match.player_one_members)}
                                                        {renderMemberNames(match.player_two_members)}
                                                     </div>
                                                     <span className="rounded-full bg-[color:var(--tertiary)]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-[color:var(--tertiary)]">
                                                         {match.status}
                                                     </span>
                                                 </div>
                                                <div className="mt-4 rounded-2xl bg-[color:var(--surface-container-low)] px-4 py-3 text-sm font-semibold text-[color:var(--on-surface)]">
                                                    {match.player_one_score !== null && match.player_two_score !== null
                                                        ? `${match.player_one_score} - ${match.player_two_score}`
                                                        : 'Awaiting result'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="mb-4 text-xl font-black tracking-tight">Bracket Overview</h3>
                                <TournamentBracket tournament={event.tournament} />
                            </div>
                        </section>
                    )}
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
