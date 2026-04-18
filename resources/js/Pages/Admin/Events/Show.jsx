import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TournamentBracket from '@/Components/TournamentBracket';
import SearchablePlayerSelect from '@/Components/SearchablePlayerSelect';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';



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

const buildTeams = (count, existingTeams = []) =>
    Array.from({ length: count }, (_, index) => existingTeams[index] || {
        name: '',
        member_registration_ids: ['', ''],
    });

const renderMembers = (members = []) => {
    if (members.length <= 1) {
        return null;
    }

    return <p className="mt-1 text-xs font-medium text-on-surface-variant">{members.join(' / ')}</p>;
};

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
                    {renderMembers(match.player_one_members)}
                    {renderMembers(match.player_two_members)}
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    {match.code}
                </span>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                {[
                    ['g1_p1_score', 'g1_p2_score', 'Game 1', true],
                    ['g2_p1_score', 'g2_p2_score', 'Game 2', true],
                    ['g3_p1_score', 'g3_p2_score', 'Game 3', false],
                ].map(([leftField, rightField, label, required]) => (
                    <div key={label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <input
                            type="number"
                            min="0"
                            placeholder={label}
                            value={data[leftField]}
                            onChange={(event) => setData(leftField, event.target.value)}
                            className="block w-full rounded-xl border border-outline-variant/40 bg-white px-3 py-2 text-sm font-semibold text-on-surface shadow-sm"
                            required={required}
                        />
                        <span className="text-xs font-black text-on-surface-variant">{label}</span>
                        <input
                            type="number"
                            min="0"
                            placeholder={label}
                            value={data[rightField]}
                            onChange={(event) => setData(rightField, event.target.value)}
                            className="block w-full rounded-xl border border-outline-variant/40 bg-white px-3 py-2 text-sm font-semibold text-on-surface shadow-sm text-right"
                            required={required}
                        />
                    </div>
                ))}

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

function TournamentSetupForm({ event }) {
    const [searchQuery, setSearchQuery] = useState('');
    const { data, setData, post, processing, errors } = useForm({
        format: 'singles',
        entrant_count: 4,
        active_registration_ids: [],
        reserve_registration_ids: [],
        teams: buildTeams(4),
    });

    useEffect(() => {
        const entrantCount = Number(data.entrant_count) || 4;

        if (data.teams.length !== entrantCount) {
            setData('teams', buildTeams(entrantCount, data.teams));
        }
    }, [data.entrant_count, data.teams.length, setData]);

    const registrationRole = (registrationId) => {
        if (data.active_registration_ids.includes(registrationId)) {
            return 'active';
        }

        if (data.reserve_registration_ids.includes(registrationId)) {
            return 'reserve';
        }

        return 'unused';
    };

    const updateSinglesAssignment = (registrationId, role) => {
        const activeIds = data.active_registration_ids.filter((id) => id !== registrationId);
        const reserveIds = data.reserve_registration_ids.filter((id) => id !== registrationId);

        if (role === 'active') {
            activeIds.push(registrationId);
        }

        if (role === 'reserve') {
            reserveIds.push(registrationId);
        }

        setData('active_registration_ids', activeIds);
        setData('reserve_registration_ids', reserveIds);
    };

    const updateTeam = (index, field, value) => {
        const nextTeams = [...data.teams];
        nextTeams[index] = {
            ...nextTeams[index],
            [field]: value,
        };
        setData('teams', nextTeams);
    };

    const updateTeamMember = (teamIndex, memberIndex, value) => {
        const nextTeams = [...data.teams];
        const nextMembers = [...nextTeams[teamIndex].member_registration_ids];
        nextMembers[memberIndex] = value;
        nextTeams[teamIndex] = {
            ...nextTeams[teamIndex],
            member_registration_ids: nextMembers,
        };

        setData('teams', nextTeams);
    };

    const toggleReserve = (registrationId) => {
        setData(
            'reserve_registration_ids',
            data.reserve_registration_ids.includes(registrationId)
                ? data.reserve_registration_ids.filter((id) => id !== registrationId)
                : [...data.reserve_registration_ids, registrationId],
        );
    };

    const submit = (eventObject) => {
        eventObject.preventDefault();
        post(route('admin.events.tournament.start', event.id), {
            preserveScroll: true,
        });
    };

    const filteredRegistrations = (searchQuery === '') 
        ? (event.registrations || [])
        : (event.registrations || []).filter((r) => 
            (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
            (r.email || '').toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <form onSubmit={submit} className="space-y-6 rounded-3xl border border-surface-container-high bg-surface p-6 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Tournament Setup</p>
                    <h3 className="mt-1 text-2xl font-black text-on-surface">Configure the active draw before starting</h3>
                    <p className="mt-2 text-sm text-on-surface-variant">
                        Registered roster available: {event.registrations.length} players.
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? 'Starting...' : 'Start Tournament'}
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Format</span>
                    <select
                        value={data.format}
                        onChange={(event) => setData('format', event.target.value)}
                        className="block w-full rounded-xl border border-outline-variant/40 bg-white px-3 py-3 text-sm font-semibold text-on-surface shadow-sm"
                    >
                        <option value="singles">Singles</option>
                        <option value="doubles">Doubles</option>
                    </select>
                    {errors.format && <p className="text-sm font-semibold text-error">{errors.format}</p>}
                </label>

                <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Active Entrant Count</span>
                    <input
                        type="number"
                        min="2"
                        step="1"
                        value={data.entrant_count}
                        onChange={(event) => setData('entrant_count', Number(event.target.value))}
                        className="block w-full rounded-xl border border-outline-variant/40 bg-white px-3 py-3 text-sm font-semibold text-on-surface shadow-sm"
                    />
                    {errors.entrant_count && <p className="text-sm font-semibold text-error">{errors.entrant_count}</p>}
                    {data.entrant_count % 2 !== 0 && (
                        <p className="text-sm font-semibold text-amber-600">Consider using an even number of players for optimal grouping.</p>
                    )}
                </label>
            </div>

            {data.format === 'singles' ? (
                <div className="space-y-4">
                    <div className="rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface-variant">
                        Select exactly {data.entrant_count} active players. Optional extras can be marked as reserves.
                    </div>

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search players..."
                        className="block w-full md:max-w-md rounded-xl border border-outline-variant/40 bg-white px-3 py-2 text-sm font-semibold text-on-surface shadow-sm"
                    />

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {filteredRegistrations.map((registration) => (
                            <div key={registration.id} className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-4">
                                <p className="font-bold text-on-surface">{registration.name}</p>
                                <p className="mt-1 text-xs text-on-surface-variant">{registration.email}</p>
                                <select
                                    value={registrationRole(registration.id)}
                                    onChange={(eventObject) => updateSinglesAssignment(registration.id, eventObject.target.value)}
                                    className="mt-3 block w-full rounded-xl border border-outline-variant/40 bg-white px-3 py-2 text-sm font-semibold text-on-surface shadow-sm"
                                >
                                    <option value="unused">Unused</option>
                                    <option value="active">Active entrant</option>
                                    <option value="reserve">Reserve</option>
                                </select>
                            </div>
                        ))}
                    </div>

                    {(errors.active_registration_ids || errors.reserve_registration_ids) && (
                        <div className="space-y-1">
                            {errors.active_registration_ids && <p className="text-sm font-semibold text-error">{errors.active_registration_ids}</p>}
                            {errors.reserve_registration_ids && <p className="text-sm font-semibold text-error">{errors.reserve_registration_ids}</p>}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface-variant">
                        Create {data.entrant_count} active teams. Each team must have a name and exactly two registered players.
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        {data.teams.map((team, index) => (
                            <div key={index} className="space-y-3 rounded-2xl border border-surface-container-high bg-surface-container-lowest p-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Team {index + 1}</h4>
                                    {errors[`teams.${index}.name`] && (
                                        <span className="text-xs font-semibold text-error">{errors[`teams.${index}.name`]}</span>
                                    )}
                                </div>

                                <input
                                    type="text"
                                    value={team.name}
                                    onChange={(eventObject) => updateTeam(index, 'name', eventObject.target.value)}
                                    placeholder="Team name"
                                    className="block w-full rounded-xl border border-outline-variant/40 bg-white px-3 py-2 text-sm font-semibold text-on-surface shadow-sm"
                                />

                                <div className="grid gap-3 md:grid-cols-2">
                                    {[0, 1].map((memberIndex) => (
                                        <label key={memberIndex} className="space-y-2">
                                            <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                                                Player {memberIndex + 1}
                                            </span>
                                            <SearchablePlayerSelect
                                                value={team.member_registration_ids[memberIndex] || ''}
                                                onChange={(id) => updateTeamMember(index, memberIndex, id === '' ? '' : Number(id))}
                                                registrations={event.registrations}
                                                placeholder="Select player"
                                            />
                                        </label>
                                    ))}
                                </div>

                                {errors[`teams.${index}.member_registration_ids`] && (
                                    <p className="text-sm font-semibold text-error">{errors[`teams.${index}.member_registration_ids`]}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant">Reserve Players</h4>
                                <p className="mt-1 text-sm text-on-surface-variant">Optional reserves stay visible but do not enter the scheduled draw.</p>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search players..."
                                className="block w-full md:w-64 rounded-xl border border-outline-variant/40 bg-white px-3 py-2 text-sm font-semibold text-on-surface shadow-sm"
                            />
                        </div>
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {filteredRegistrations.map((registration) => (
                                <label key={registration.id} className="flex items-start gap-3 rounded-2xl border border-surface-container-high bg-surface-container-lowest p-4">
                                    <input
                                        type="checkbox"
                                        checked={data.reserve_registration_ids.includes(registration.id)}
                                        onChange={() => toggleReserve(registration.id)}
                                        className="mt-1 rounded border-outline-variant"
                                    />
                                    <span>
                                        <span className="block font-bold text-on-surface">{registration.name}</span>
                                        <span className="text-xs text-on-surface-variant">{registration.email}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                        {(errors.teams || errors.reserve_registration_ids) && (
                            <div className="space-y-1">
                                {errors.teams && <p className="text-sm font-semibold text-error">{errors.teams}</p>}
                                {errors.reserve_registration_ids && <p className="text-sm font-semibold text-error">{errors.reserve_registration_ids}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </form>
    );
}

export default function Show({ event, availableUsers }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Manage ${event.name}`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <Link href={route('admin.events.index')} className="text-sm font-bold text-primary hover:underline">&larr; Back to Events</Link>
                        <h1 className="mt-2 text-3xl font-black text-on-surface">{event.name}</h1>
                        <p className="mt-1 text-sm font-medium text-on-surface-variant">
                            {formatDateTime(event.starts_at)} • {event.venue.name}
                        </p>
                    </div>
                </div>

                {!event.tournament ? (
                    <>
                        <AddUserToRosterForm eventId={event.id} availableUsers={availableUsers} currentRegistrations={event.registrations} />
                        <TournamentSetupForm event={event} />
                    </>
                ) : (
                    <div className="space-y-8 rounded-3xl border border-surface-container-highest bg-surface p-6 shadow-sm sm:p-8">
                        <div className="grid gap-4 lg:grid-cols-3">
                            <div className="rounded-2xl bg-surface-container-lowest p-5">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Tournament State</p>
                                <p className="mt-2 text-2xl font-black text-on-surface">{formatTournamentState(event.tournament.state)}</p>
                                <p className="mt-2 text-sm text-on-surface-variant">
                                    {event.tournament.state === 'completed'
                                        ? `Champion: ${event.tournament.champion_name}`
                                        : `${event.tournament.pending_matches.length} pending match${event.tournament.pending_matches.length === 1 ? '' : 'es'} ready for scoring.`}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-surface-container-lowest p-5">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Format</p>
                                <p className="mt-2 text-2xl font-black text-on-surface">{event.tournament.format_label}</p>
                                <p className="mt-2 text-sm text-on-surface-variant">{event.tournament.entrant_count} active entrants in the bracket flow.</p>
                            </div>
                            <div className="rounded-2xl bg-surface-container-lowest p-5">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Reserve Roster</p>
                                <p className="mt-2 text-2xl font-black text-on-surface">{event.tournament.reserves.length}</p>
                                <p className="mt-2 text-sm text-on-surface-variant">Visible to admins and players but excluded from matches.</p>
                            </div>
                        </div>

                        {event.tournament.reserves.length > 0 && (
                            <section className="space-y-4">
                                <h3 className="text-xl font-black text-on-surface">Reserve Players</h3>
                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {event.tournament.reserves.map((reserve) => (
                                        <div key={reserve.registration_id} className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-4">
                                            <p className="font-bold text-on-surface">{reserve.name}</p>
                                            <p className="mt-1 text-xs text-on-surface-variant">{reserve.email}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="space-y-4">
                            <h3 className="text-xl font-black text-on-surface">Pending Match Scoring</h3>
                            {event.tournament.pending_matches.length > 0 ? (
                                <div className="grid gap-4 xl:grid-cols-2">
                                    {event.tournament.pending_matches.map((match) => (
                                        <MatchScoreForm key={match.id} match={match} />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-surface-container-lowest px-5 py-6 text-sm font-medium text-on-surface-variant">
                                    No pending matches are ready for admin scoring right now.
                                </div>
                            )}
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xl font-black text-on-surface">Group Standings</h3>
                            <div className="grid gap-4 xl:grid-cols-2">
                                {event.tournament.groups.map((group) => (
                                    <div key={group.name} className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-5 shadow-sm">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h4 className="text-lg font-black text-primary">Group {group.name}</h4>
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant">Points / Diff</span>
                                        </div>
                                        <div className="space-y-3">
                                            {group.entries.map((entry) => (
                                                <div key={entry.registration_id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-surface px-4 py-3">
                                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-black text-on-primary">
                                                        {entry.rank || '-'}
                                                    </span>
                                                    <div>
                                                        <p className="font-bold text-on-surface">{entry.player_name}</p>
                                                        {renderMembers(entry.member_names)}
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
                        </section>

                        {event.tournament.qualification.length > 0 && (
                            <section className="space-y-4">
                                <h3 className="text-xl font-black text-on-surface">Qualification Outcome</h3>
                                <div className="grid gap-3 lg:grid-cols-2">
                                    {event.tournament.qualification.map((entry) => (
                                        <div key={entry.registration_id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-surface-container-high bg-surface-container-lowest px-4 py-3">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tertiary text-sm font-black text-on-primary">
                                                {entry.qualification_rank}
                                            </span>
                                            <div>
                                                <p className="font-bold text-on-surface">{entry.player_name}</p>
                                                {renderMembers(entry.member_names)}
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
                            </section>
                        )}

                        <section className="space-y-4">
                            <h3 className="text-xl font-black text-on-surface">Bracket Overview</h3>
                            <TournamentBracket tournament={event.tournament} />
                        </section>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
function AddUserToRosterForm({ eventId, availableUsers, currentRegistrations }) {
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const selectAllRef = useRef(null);
    const { post, processing, errors, reset, transform } = useForm({
        user_ids: [],
    });

    const normalizedSearch = search.trim().toLowerCase();

    const filtered = normalizedSearch === ''
        ? availableUsers
        : availableUsers.filter((u) =>
            (u.name || '').toLowerCase().includes(normalizedSearch) ||
            (u.email || '').toLowerCase().includes(normalizedSearch),
        );

    const availableUserIds = availableUsers.map((user) => user.id);
    const filteredIds = filtered.map((user) => user.id);
    const selectedFilteredCount = filteredIds.filter((id) => selectedIds.includes(id)).length;
    const allFilteredSelected = filteredIds.length > 0 && selectedFilteredCount === filteredIds.length;
    const someFilteredSelected = selectedFilteredCount > 0 && !allFilteredSelected;

    useEffect(() => {
        setSelectedIds((prev) => {
            const next = prev.filter((id) => availableUserIds.includes(id));

            return next.length === prev.length ? prev : next;
        });
    }, [availableUsers]);

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = someFilteredSelected;
        }
    }, [someFilteredSelected]);

    const toggle = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const toggleAll = () => {
        setSelectedIds((prev) => {
            const allSelected = filteredIds.every((id) => prev.includes(id));
            if (allSelected) {
                return prev.filter((id) => !filteredIds.includes(id));
            } else {
                return [...new Set([...prev, ...filteredIds])];
            }
        });
    };

    const submit = (e) => {
        e.preventDefault();
        if (selectedIds.length === 0) return;

        transform(() => ({ user_ids: selectedIds }));
        post(route('admin.events.registrations.store', eventId), {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds([]);
                reset();
            },
        });
    };

    return (
        <div className="relative z-20 mb-6 space-y-6 rounded-3xl border border-surface-container-high bg-surface p-6 shadow-sm">
            <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Roster Management</p>
                <h3 className="mt-1 text-lg font-black text-on-surface">Add Players to Event</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                    Check one or more users below, then click <strong>Add Selected</strong>.
                </p>
            </div>

            {availableUsers.length === 0 ? (
                <p className="text-sm text-on-surface-variant italic">All registered users are already on this event's roster.</p>
            ) : (
                <form onSubmit={submit} className="space-y-4">
                    {/* Search + Select All row */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search users..."
                            className="flex-1 block rounded-xl border border-outline-variant/40 bg-white px-3 py-2 text-sm font-semibold text-on-surface shadow-sm"
                        />
                        {filtered.length > 0 && (
                            <label className="flex items-center gap-2 cursor-pointer select-none shrink-0">
                                <input
                                    ref={selectAllRef}
                                    type="checkbox"
                                    checked={allFilteredSelected}
                                    onChange={toggleAll}
                                    className="h-4 w-4 rounded border-outline-variant accent-primary"
                                />
                                <span className="text-sm font-semibold text-on-surface-variant">
                                    {allFilteredSelected ? 'Deselect all' : 'Select all'}
                                    {search.trim() !== '' ? ' (filtered)' : ''}
                                </span>
                            </label>
                        )}
                        {selectedIds.length > 0 && (
                            <span className="text-sm font-semibold text-on-surface-variant sm:ml-auto">
                                {selectedFilteredCount} of {filtered.length} shown selected
                            </span>
                        )}
                    </div>

                    {/* Checkbox list */}
                    <div className="max-h-60 overflow-y-auto rounded-2xl border border-surface-container-high bg-surface-container-lowest p-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.length === 0 ? (
                            <p className="col-span-full text-sm text-on-surface-variant py-2 text-center">No users match your search.</p>
                        ) : (
                            filtered.map((user) => (
                                <label
                                    key={user.id}
                                    className={`flex items-start gap-3 cursor-pointer rounded-xl border p-3 transition-colors ${
                                        selectedIds.includes(user.id)
                                            ? 'border-primary/40 bg-primary/5'
                                            : 'border-surface-container-high bg-surface hover:bg-surface-container-lowest'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(user.id)}
                                        onChange={() => toggle(user.id)}
                                        className="mt-0.5 h-4 w-4 rounded border-outline-variant accent-primary shrink-0"
                                    />
                                    <span>
                                        <span className="block text-sm font-bold text-on-surface">{user.name}</span>
                                        <span className="block text-xs text-on-surface-variant truncate">{user.email}</span>
                                    </span>
                                </label>
                            ))
                        )}
                    </div>

                    {errors.user_ids && <p className="text-sm font-semibold text-error">{errors.user_ids}</p>}

                    {/* Submit */}
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={processing || selectedIds.length === 0}
                            className="rounded-xl bg-tertiary px-6 py-3 text-sm font-bold text-on-primary disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-2"
                        >
                            {processing ? 'Adding...' : (
                                <>
                                    Add Selected
                                    {selectedIds.length > 0 && (
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-black">
                                            {selectedIds.length}
                                        </span>
                                    )}
                                </>
                            )}
                        </button>
                        {selectedIds.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setSelectedIds([])}
                                className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
                            >
                                Clear selection
                            </button>
                        )}
                    </div>
                </form>
            )}

            <div className="pt-4 border-t border-surface-container-highest">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant mb-3">
                    Current Roster ({currentRegistrations.length})
                </h4>
                {currentRegistrations.length === 0 ? (
                    <p className="text-sm text-on-surface-variant">No players have been added to this event yet.</p>
                ) : (
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 max-h-64 overflow-y-auto pr-2 rounded-xl p-2 bg-surface-container-lowest border border-surface-container">
                        {currentRegistrations.map((reg) => (
                            <div key={reg.id} className="rounded-lg bg-surface p-3 border border-surface-container-high shadow-sm">
                                <p className="text-sm font-bold text-on-surface">{reg.name}</p>
                                <p className="text-xs text-on-surface-variant truncate">{reg.email}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
