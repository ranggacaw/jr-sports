import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import TournamentBracket from '@/Components/TournamentBracket';

const formatDateTime = (dateString) =>
    new Intl.DateTimeFormat('en-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(dateString));

const formatTournamentState = (value) =>
    ({
        group_stage: 'Group Stage',
        bracket_stage: 'Bracket Stage',
        completed: 'Completed',
    })[value] || 'Pending';

function MatchScoreForm({ match }) {
    const { data, setData, post, processing, reset } = useForm({
        g1_p1_score: '',
        g1_p2_score: '',
        g2_p1_score: '',
        g2_p2_score: '',
        g3_p1_score: '',
        g3_p2_score: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.matches.score', match.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={submit} className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                        {match.group_name ? `Group ${match.group_name}` : match.round_name}
                    </p>
                    <p className="mt-1 text-sm font-bold text-on-surface">      
                        {match.player_one_name} vs {match.player_two_name}      
                    </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    {match.code}
                </span>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        {match.player_one_name}
                    </div>
                    <span className="text-center text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant">
                        vs
                    </span>
                    <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">
                        {match.player_two_name}
                    </div>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <input
                        type="number"
                        min="0"
                        placeholder="G1 Points"
                        value={data.g1_p1_score}
                        onChange={(event) => setData('g1_p1_score', event.target.value)}
                        className="block w-full rounded-xl border border-outline-variant/40 bg-white px-3 py-2 text-sm font-semibold text-on-surface shadow-sm"
                        required
                    />
                    <span className="text-xs font-black text-on-surface-variant">Game 1</span>
                    <input
                        type="number"
                        min="0"
                        placeholder="G1 Points"
                        value={data.g1_p2_score}
                        onChange={(event) => setData('g1_p2_score', event.target.value)}
                        className="block w-full rounded-xl border border-outline-variant/40 bg-white px-3 py-2 text-sm font-semibold text-on-surface shadow-sm text-right"
                        required
                    />
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <input
                        type="number"
                        min="0"
                        placeholder="G2 Points"
                        value={data.g2_p1_score}
                        onChange={(event) => setData('g2_p1_score', event.target.value)}
                        className="block w-full rounded-xl border border-outline-variant/40 bg-white px-3 py-2 text-sm font-semibold text-on-surface shadow-sm"
                        required
                    />
                    <span className="text-xs font-black text-on-surface-variant">Game 2</span>
                    <input
                        type="number"
                        min="0"
                        placeholder="G2 Points"
                        value={data.g2_p2_score}
                        onChange={(event) => setData('g2_p2_score', event.target.value)}
                        className="block w-full rounded-xl border border-outline-variant/40 bg-white px-3 py-2 text-sm font-semibold text-on-surface shadow-sm text-right"
                        required
                    />
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <input
                        type="number"
                        min="0"
                        placeholder="G3 (If Needed)"
                        value={data.g3_p1_score}
                        onChange={(event) => setData('g3_p1_score', event.target.value)}
                        className="block w-full rounded-xl border border-outline-variant/40 bg-white px-3 py-2 text-sm font-semibold text-on-surface shadow-sm"
                    />
                    <span className="text-xs font-black text-on-surface-variant">Game 3</span>
                    <input
                        type="number"
                        min="0"
                        placeholder="G3 (If Needed)"
                        value={data.g3_p2_score}
                        onChange={(event) => setData('g3_p2_score', event.target.value)}
                        className="block w-full rounded-xl border border-outline-variant/40 bg-white px-3 py-2 text-sm font-semibold text-on-surface shadow-sm text-right"
                    />
                </div>

                <div className="mt-2 text-right">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-on-primary transition disabled:cursor-not-allowed disabled:opacity-60"  
                    >
                        {processing ? 'Saving...' : 'Save Result'}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default function Show({ event }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Manage ${event.name}`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <Link href={route('admin.events.index')} className="text-sm font-bold text-primary hover:underline">&larr; Back to Events</Link>
                        <h1 className="mt-2 text-3xl font-black text-on-surface">{event.name}</h1>
                        <p className="mt-1 text-sm font-medium text-on-surface-variant">
                            {formatDateTime(event.starts_at)} &bull; {event.venue.name}
                        </p>
                    </div>
                </div>

                {!event.tournament ? (
                    <div className="rounded-3xl border border-surface-container-high bg-surface px-6 py-12 text-center shadow-sm">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant">emoji_events</span>
                        <p className="mt-4 text-sm font-medium text-on-surface-variant">No active tournament for this event.</p>
                        {event.can_start_tournament ? (
                            <Link
                                href={route('admin.events.tournament.start', event.id)}
                                method="post"
                                as="button"
                                className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary shadow shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
                            >
                                Start Tournament Loop
                            </Link>
                        ) : (
                            <p className="mt-2 text-xs font-bold text-error">
                                Wait for exactly 16 participants to start the tournament. Currently: {event.participants_count}.
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-surface-container-highest bg-surface p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">
                                    Tournament Control
                                </p>
                                <h3 className="mt-1 text-2xl font-black text-on-surface">
                                    {formatTournamentState(event.tournament.state)}
                                </h3>
                                <p className="mt-2 text-sm font-medium text-on-surface-variant">
                                    {event.tournament.state === 'completed'
                                        ? `Champion: ${event.tournament.champion_name}`
                                        : `${event.tournament.pending_matches.length} pending match${event.tournament.pending_matches.length === 1 ? '' : 'es'} ready for scoring.`}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                                    Standings Snapshot
                                </p>
                                <p className="mt-1 text-sm font-semibold text-on-surface">
                                    {event.tournament.groups.length} groups tracked
                                </p>
                            </div>
                        </div>

                        {event.tournament.pending_matches.length > 0 ? (
                            <div className="grid gap-4 xl:grid-cols-2">
                                {event.tournament.pending_matches.map((match) => (
                                    <MatchScoreForm key={match.id} match={match} />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-surface-container-lowest px-5 py-6 text-sm font-medium text-on-surface-variant">
                                No pending matches are ready for admin scoring right now.
                                {event.tournament.state === 'completed' && <span className="block mt-2 font-bold text-primary">The tournament has ended!</span>}
                            </div>
                        )}

                        <div className="mt-8 space-y-8">
                            <div>
                                <h3 className="mb-4 text-xl font-black text-on-surface">Group Standings</h3>
                                <div className="grid gap-4 xl:grid-cols-2">
                                    {event.tournament.groups.map((group) => (
                                        <div key={group.name} className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-5 shadow-sm">
                                            <div className="mb-4 flex items-center justify-between">
                                                <h4 className="text-lg font-black text-primary">Group {group.name}</h4>
                                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                                                    Points / Diff
                                                </span>
                                            </div>
                                            <div className="space-y-3">
                                                {group.entries.map((entry) => (
                                                    <div key={entry.registration_id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-surface px-4 py-3">
                                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-black text-on-primary">
                                                            {entry.rank || '-'}
                                                        </span>
                                                        <div>
                                                            <p className="font-bold text-on-surface">{entry.player_name}</p>
                                                            {entry.qualification_rank && (
                                                                <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-tertiary">
                                                                    Qual #{entry.qualification_rank} · {entry.bracket_label}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-black text-primary">{entry.points} pts</p>
                                                            <p className="text-xs text-on-surface-variant">{entry.point_differential >= 0 ? '+' : ''}{entry.point_differential}</p>
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
                                    <h3 className="mb-4 text-xl font-black text-on-surface">Qualification Outcome</h3>
                                    <div className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-5 shadow-sm">
                                        <div className="mb-4 flex items-center justify-between gap-3">
                                            <h4 className="text-lg font-black text-primary">Overall Ranking</h4>
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                                                Points / Diff
                                            </span>
                                        </div>
                                        <div className="grid gap-3 lg:grid-cols-2">
                                            {event.tournament.qualification.map((entry) => (
                                                <div key={entry.registration_id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-surface px-4 py-3">
                                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tertiary text-sm font-black text-on-primary">
                                                        {entry.qualification_rank}
                                                    </span>
                                                    <div>
                                                        <p className="font-bold text-on-surface">{entry.player_name}</p>
                                                        <p className="text-xs uppercase tracking-widest text-on-surface-variant">
                                                            Group {entry.group_name} · Rank {entry.group_rank}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-black text-primary">{entry.bracket_label}</p>
                                                        <p className="text-xs text-on-surface-variant">{entry.points} pts · {entry.point_differential >= 0 ? '+' : ''}{entry.point_differential}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {event.tournament.brackets && (
                            <div className="mt-8">
                                <h3 className="text-xl font-black text-on-surface mb-4">Bracket Overview</h3>
                                <TournamentBracket tournament={event.tournament} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
