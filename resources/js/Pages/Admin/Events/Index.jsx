import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const formatDateTime = (dateString) =>
    new Intl.DateTimeFormat('en-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(dateString));

const slugify = (value) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

const getEventIcon = (value) => {
    const normalizedValue = value.toLowerCase();

    if (normalizedValue.includes('soccer') || normalizedValue.includes('football')) {
        return 'sports_soccer';
    }

    if (normalizedValue.includes('basket')) {
        return 'sports_basketball';
    }

    if (normalizedValue.includes('tennis') || normalizedValue.includes('badminton')) {
        return 'sports_tennis';
    }

    if (normalizedValue.includes('run') || normalizedValue.includes('track')) {
        return 'directions_run';
    }

    return 'stadia_controller';
};

const getFilterFromUrl = () => {
    if (typeof window === 'undefined') {
        return 'all';
    }

    return new URLSearchParams(window.location.search).get('filter') || 'all';
};

// Placedholder image arrays based on sport types
const STUB_IMAGES = [
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2074&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1536243298747-ea8f15b4c19a?q=80&w=2070&auto=format&fit=crop", 
];

export default function Index({ events }) {
    const { flash } = usePage().props;
    const [selectedFilter, setSelectedFilter] = useState(getFilterFromUrl);
    const openEvents = events.filter((event) => event.registration_is_open).length;
    const closedEvents = events.length - openEvents;
    const totalParticipants = events.reduce(
        (total, event) => total + event.participants_count,
        0,
    );
    const uniqueCities = new Set(events.map((event) => event.venue.city).filter(Boolean)).size;
    const openRate = events.length > 0 ? Math.round((openEvents / events.length) * 100) : 0;
    const maxParticipants = Math.max(...events.map((event) => event.participants_count), 0);

    const filters = useMemo(() => {
        const recurrenceFilters = [...new Set(events.map((event) => event.recurrence).filter(Boolean))]
            .map((recurrence) => ({
                id: `recurrence:${slugify(recurrence)}`,
                label: recurrence,
                icon: getEventIcon(recurrence),
                predicate: (event) => event.recurrence === recurrence,
            }));

        return [
            {
                id: 'all',
                label: 'All Events',
                icon: 'calendar_today',
                predicate: () => true,
            },
            {
                id: 'open',
                label: 'Open Registration',
                icon: 'event_available',
                predicate: (event) => event.registration_is_open,
            },
            {
                id: 'closed',
                label: 'Closed Registration',
                icon: 'event_busy',
                predicate: (event) => !event.registration_is_open && !event.champion_name,
            },
            {
                id: 'finished',
                label: 'Finished Events',
                icon: 'emoji_events',
                predicate: (event) => !!event.champion_name,
            },
            ...recurrenceFilters,
        ];
    }, [events]);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 6;

    const activeFilter = filters.find((filter) => filter.id === selectedFilter) || filters[0];
    const filteredEvents = events.filter((event) => activeFilter.predicate(event));
    const searchedEvents = filteredEvents.filter((event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
    const totalPages = Math.max(1, Math.ceil(searchedEvents.length / PAGE_SIZE));
    const paginatedEvents = searchedEvents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    useEffect(() => {
        if (!filters.some((filter) => filter.id === selectedFilter)) {
            setSelectedFilter('all');
        }
    }, [filters, selectedFilter]);

    // Reset to page 1 whenever filter or search changes
    useEffect(() => { setCurrentPage(1); }, [selectedFilter, searchQuery]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const url = new URL(window.location.href);

        if (selectedFilter === 'all') {
            url.searchParams.delete('filter');
        } else {
            url.searchParams.set('filter', selectedFilter);
        }

        window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    }, [selectedFilter]);

    const calcMomentumScore = () => {
        if (events.length === 0) return 0;

        return openRate;
    };

    const momentumScore = calcMomentumScore();

    return (
        <AuthenticatedLayout>
            <Head title="Admin Events" />

            <div className="max-w-[96rem] mx-auto flex flex-col lg:flex-row gap-8 px-4 sm:px-6 lg:px-8 py-8 items-start">
                
                {/* Admin SideNavBar */}
                <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-2 relative lg:sticky lg:top-8 z-10">
                    <div className="mb-4 hidden lg:block px-2">
                        <h2 className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant">Filters</h2>
                        <p className="text-xs text-on-surface-variant/70 mt-1">Refine Events</p>
                    </div>
                    
                    <Link href={route('admin.events.create')} className="w-full bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center gap-2 py-3.5 rounded-xl shadow-lg shadow-primary/20 mb-6 font-bold hover:scale-[0.98] transition-all">
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        <span>Create Event</span>
                    </Link>

                    <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scroll-smooth snap-x">
                        {filters.map((filter) => {
                            const isActive = filter.id === selectedFilter;

                            return (
                                <button
                                    key={filter.id}
                                    type="button"
                                    onClick={() => setSelectedFilter(filter.id)}
                                    className={`snap-start flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm shrink-0 lg:shrink whitespace-nowrap ${
                                        isActive
                                            ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                                            : 'text-on-surface-variant hover:bg-surface-container'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">{filter.icon}</span>
                                    {filter.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 w-full min-w-0 pb-16">
                    <div className="space-y-12">
                        {flash?.success && (
                            <div className="p-4 bg-secondary-fixed text-on-secondary-fixed rounded-2xl font-semibold shadow-sm flex items-center gap-3 border border-secondary-fixed-dim/30">
                                <span className="material-symbols-outlined shrink-0 text-primary">check_circle</span>
                                {flash.success}
                            </div>
                        )}
                        
                        {/* Hero Bento Header */}
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-container p-8 sm:p-10 rounded-[2rem] text-on-primary relative overflow-hidden flex flex-col justify-between min-h-[320px] shadow-xl shadow-primary/10">
                                <div className="relative z-10">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80 backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full">Live Registration Health</span>
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black mt-6 leading-[1.1] tracking-tighter drop-shadow-md">
                                        OPEN EVENT <br/><span className="text-primary-fixed italic font-light">RATE</span>
                                    </h1>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between relative z-10 mt-8 gap-4">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-7xl sm:text-8xl font-headline font-black tracking-tighter drop-shadow-lg">{momentumScore}</span>
                                        <span className="text-3xl font-bold opacity-60">%</span>
                                    </div>
                                    <div className="sm:text-right">
                                        <p className="text-lg font-bold text-primary-fixed">{openEvents} event{openEvents === 1 ? '' : 's'} currently open</p>
                                        <p className="text-sm text-primary-fixed-dim opacity-90 mt-1">Based on {events.length} scheduled event{events.length === 1 ? '' : 's'}</p>
                                    </div>
                                </div>
                                {/* Decorative Abstract Background */}
                                <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="absolute right-0 top-0 w-full h-full opacity-20 pointer-events-none mix-blend-overlay">
                                    <img className="w-full h-full object-cover" alt="stadium lights" src="https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=2076&auto=format&fit=crop" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                                <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-[0_20px_25px_-5px_rgba(25,28,32,0.03)] flex flex-col justify-between border-l-4 border-l-tertiary">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
                                            <span className="material-symbols-outlined text-3xl">groups</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-secondary-fixed-dim bg-secondary-fixed/20 px-2.5 py-1 rounded-full">Open {openEvents}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-headline font-black text-on-surface tracking-tight leading-none mb-1">{totalParticipants}</h3>
                                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Registrations</p>
                                    </div>
                                </div>
                                <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-[0_20px_25px_-5px_rgba(25,28,32,0.03)] flex flex-col justify-between border-l-4 border-l-primary">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                            <span className="material-symbols-outlined text-3xl">event_available</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">{closedEvents} closed</span>
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-headline font-black text-on-surface tracking-tight leading-none mb-1">{uniqueCities}</h3>
                                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Active Cities</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Active Events List */}
                        <section className="space-y-6">
                            <div className="flex flex-col gap-4 px-2">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                                    <div>
                                        <h2 className="text-3xl font-headline font-black tracking-tight text-on-surface">Active Events</h2>
                                        <p className="text-on-surface-variant mt-1 font-medium">
                                            {activeFilter.label} · {searchedEvents.length} event{searchedEvents.length === 1 ? '' : 's'}{searchQuery && ` for "${searchQuery}"`}
                                        </p>
                                    </div>
                                    <Link href={route('events.index')} className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all shrink-0">
                                        View Public <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                    </Link>
                                </div>

                                {/* Search bar */}
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">search</span>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search events by name…"
                                        className="w-full pl-12 pr-10 py-3 bg-white border border-surface-container-highest/30 rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant/60 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">close</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 xl:gap-6" key={currentPage}>
                                {searchedEvents.length === 0 ? (
                                    <div className="col-span-1 lg:col-span-2 bg-surface-container-lowest p-12 rounded-[2rem] text-center border border-surface-container shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                                        <div className="w-20 h-20 rounded-full bg-surface-container text-on-surface-variant mx-auto flex items-center justify-center mb-5 shadow-inner">
                                            <span className="material-symbols-outlined text-4xl">inbox</span>
                                        </div>
                                        <p className="text-xl font-headline font-black text-on-surface">No events match this filter</p>
                                        <p className="text-on-surface-variant text-base mt-2 max-w-md">Switch filters or create a new event to expand the current schedule.</p>
                                    </div>
                                ) : (
                                    paginatedEvents.map((event, index) => {
                                        const eventImage = STUB_IMAGES[index % STUB_IMAGES.length];
                                        const borderColor = ['border-l-primary', 'border-l-tertiary', 'border-l-secondary'][index % 3];
                                        const progressColor = ['bg-primary', 'bg-tertiary', 'bg-secondary'][index % 3];
                                        const fillPercentage = maxParticipants > 0
                                            ? Math.round((event.participants_count / maxParticipants) * 100)
                                            : 0;

                                        return (
                                            <div key={event.id} className={`bg-white p-5 sm:p-6 rounded-[2rem] transition-all hover:scale-[1.01] hover:-translate-y-1 border-t-4 sm:border-t-0 sm:border-l-[5px] ${borderColor} shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] border border-surface-container-highest/10 overflow-hidden flex flex-col justify-between h-full group`}>
                                                <div className="flex flex-col h-full">
                                                    
                                                    <div className="flex flex-row items-start gap-4 sm:gap-5 mb-5">
                                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.25rem] overflow-hidden shrink-0 shadow-sm border border-outline-variant/10 bg-surface-container-highest relative">
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none"></div>
                                                            <img 
                                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                                                                alt={event.name} 
                                                                src={eventImage} 
                                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop"; }} 
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                                <h4 className="text-lg sm:text-xl font-headline font-black text-on-surface leading-tight truncate">{event.name}</h4>
                                                                {!event.registration_is_open && (
                                                                    <span className="bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 shadow-sm">Closed</span>
                                                                )}
                                                                {event.champion_name && (
                                                                    <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wider shrink-0 shadow-sm">
                                                                        <span className="material-symbols-outlined text-[12px]">emoji_events</span>
                                                                        {event.champion_name}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-on-surface-variant text-sm font-semibold tracking-wide truncate">{event.recurrence || 'General Division'} • {event.venue.city}</p>
                                                            <p className="text-on-surface-variant text-xs font-medium mt-2 flex items-center gap-1.5 bg-surface-container-lowest w-fit px-2 py-1 rounded-lg shadow-sm border border-surface-container-highest/20">
                                                                <span className="material-symbols-outlined text-[14px] text-primary">calendar_month</span> {formatDateTime(event.starts_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-auto flex flex-col gap-5 border-t border-surface-container/60 pt-5">
                                                        <div className="flex flex-row items-center justify-between gap-4 bg-surface-container-lowest/50 p-3 rounded-xl border border-surface-container">
                                                            <div className="flex flex-col gap-2 w-full max-w-[140px] sm:max-w-[180px]">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">Turnout</span>
                                                                    <span className="text-[10px] font-black text-primary">{fillPercentage}%</span>
                                                                </div>
                                                                <div className="w-full h-1.5 bg-surface-container-highest/30 rounded-full overflow-hidden">
                                                                    <div className={`h-full ${progressColor} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${fillPercentage}%` }}></div>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm font-black text-on-surface whitespace-nowrap text-right">
                                                                {event.tournament ? (
                                                                    <div className="flex flex-col items-end leading-tight">
                                                                        <span>{event.tournament.entrant_count}</span>
                                                                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Active</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex flex-col items-end leading-tight">
                                                                        <span>{event.participants_count}</span>
                                                                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Joined</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-2 xl:flex xl:flex-row flex-wrap items-center gap-2">
                                                            <Link href={route('admin.events.show', event.id)} className="col-span-1 xl:flex-[1.2] justify-center px-3 py-2.5 bg-gradient-to-b from-[#002B59] to-[#001f40] hover:from-[#003b7a] hover:to-[#002B59] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex items-center gap-1.5 whitespace-nowrap active:scale-95">
                                                                <span className="material-symbols-outlined text-[18px]">visibility</span> Details
                                                            </Link>
                                                            <Link href={route('admin.events.edit', event.id)} className="col-span-1 xl:flex-[0.8] justify-center px-3 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold rounded-xl transition-all shadow-sm hover:shadow-md text-sm flex items-center gap-1.5 whitespace-nowrap active:scale-95 text-center">
                                                                <span className="material-symbols-outlined text-[18px] opacity-70">edit</span> Edit
                                                            </Link>
                                                            {event.registration_is_open && (
                                                                <Link href={route('admin.events.close-registration', event.id)} method="patch" as="button" className="col-span-2 xl:flex-1 justify-center px-3 py-2.5 bg-white border border-outline-variant/40 text-on-surface-variant/80 hover:text-error hover:border-error/50 hover:bg-error/5 font-bold rounded-xl transition-all shadow-sm hover:shadow-md text-sm flex items-center gap-1.5 whitespace-nowrap w-full active:scale-95">
                                                                    <span className="material-symbols-outlined text-[18px]">lock</span> Close Reg
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between gap-4 px-2 pt-2">
                                    <p className="text-sm text-on-surface-variant font-medium hidden sm:block">
                                        Page <span className="font-black text-on-surface">{currentPage}</span> of <span className="font-black text-on-surface">{totalPages}</span>
                                        <span className="ml-2 opacity-60">· {searchedEvents.length} total</span>
                                    </p>

                                    <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
                                        {/* Prev */}
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-surface-container-highest/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                        </button>

                                        {/* Page numbers */}
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                            const isActive = page === currentPage;
                                            const isNear = Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages;
                                            if (!isNear) {
                                                const isEllipsis = page === 2 || page === totalPages - 1;
                                                return isEllipsis ? (
                                                    <span key={page} className="w-9 h-9 flex items-center justify-center text-on-surface-variant text-sm font-bold opacity-40">…</span>
                                                ) : null;
                                            }
                                            return (
                                                <button
                                                    key={page}
                                                    type="button"
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black transition-all shadow-sm ${
                                                        isActive
                                                            ? 'bg-gradient-to-b from-[#002B59] to-[#001f40] text-white shadow-md'
                                                            : 'bg-white border border-surface-container-highest/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}

                                        {/* Next */}
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-surface-container-highest/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
