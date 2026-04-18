import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

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

const getVenueMapUrl = (venue) =>
    venue.google_maps_url ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        [venue.name, venue.address, venue.city].filter(Boolean).join(', '),
    )}`;

const getFilterFromUrl = () => {
    if (typeof window === 'undefined') {
        return 'all';
    }

    return new URLSearchParams(window.location.search).get('filter') || 'all';
};

// High-quality placeholders for sporting events based on index
const STUB_IMAGES = [
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2074&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1536243298747-ea8f15b4c19a?q=80&w=2070&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1518605368461-1ee12375bbdc?q=80&w=2140&auto=format&fit=crop", 
];

export default function Index({ events }) {
    const { auth, flash, errors } = usePage().props;
    const user = auth.user;
    const [selectedFilter, setSelectedFilter] = useState(getFilterFromUrl);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;
    const eventsSectionRef = useRef(null);
    const statsSectionRef = useRef(null);

    const filters = useMemo(() => {
        const recurrenceFilters = [...new Set(events.map((event) => event.recurrence).filter(Boolean))]
            .map((recurrence) => ({
                id: slugify(recurrence),
                label: recurrence,
                icon: getEventIcon(recurrence),
            }));

        return [
            {
                id: 'all',
                    label: 'All Events',
                    icon: 'calendar_today',
                },
                {
                    id: 'finished',
                    label: 'Finished / Champions',
                    icon: 'emoji_events',
                },
                ...recurrenceFilters,
            ];
        }, [events]);

        const filterByRecurrence = useMemo(() => {
            if (selectedFilter === 'all') {
                return events;
            }
            if (selectedFilter === 'finished') {
                return events.filter((event) => !!event.champion_name);
            }
            return events.filter((event) => slugify(event.recurrence || '') === selectedFilter);
        }, [events, selectedFilter]);

    const filteredEvents = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return filterByRecurrence;
        return filterByRecurrence.filter((event) => event.name.toLowerCase().includes(q));
    }, [filterByRecurrence, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));

    const pagedEvents = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredEvents.slice(start, start + PAGE_SIZE);
    }, [filteredEvents, currentPage, PAGE_SIZE]);

    const activeFilterIndex = Math.max(
        filters.findIndex((filter) => filter.id === selectedFilter),
        0,
    );
    const registeredEvents = useMemo(
        () => events.filter((event) => event.is_registered),
        [events],
    );
    const joinableEvents = useMemo(
        () => events.filter((event) => event.registration_is_open && !event.is_registered),
        [events],
    );
    const totalParticipants = useMemo(
        () => events.reduce((total, event) => total + event.participants_count, 0),
        [events],
    );
    const registeredParticipants = useMemo(
        () => registeredEvents.reduce((total, event) => total + event.participants_count, 0),
        [registeredEvents],
    );
    const citiesCount = useMemo(
        () => new Set(events.map((event) => event.venue.city).filter(Boolean)).size,
        [events],
    );
    const registeredCitiesCount = useMemo(
        () => new Set(registeredEvents.map((event) => event.venue.city).filter(Boolean)).size,
        [registeredEvents],
    );
    const featuredEvent = filteredEvents[0] || events[0] || null;
    const featuredVenueUrl = featuredEvent ? getVenueMapUrl(featuredEvent.venue) : null;
    const activeFilter = filters[activeFilterIndex] || filters[0];

    useEffect(() => {
        if (!filters.some((filter) => filter.id === selectedFilter)) {
            setSelectedFilter('all');
        }
    }, [filters, selectedFilter]);

    // Reset to page 1 whenever the visible set changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedFilter, searchQuery]);

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

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const cycleFilter = (direction) => {
        const nextIndex = (activeFilterIndex + direction + filters.length) % filters.length;

        setSelectedFilter(filters[nextIndex].id);
    };

    const renderEventCard = (event, index) => {
        const bgImage = event.banner_url || STUB_IMAGES[index % STUB_IMAGES.length];
        const isRegistered = user && event.is_registered;
        const isOpen = event.registration_is_open;
        const venueUrl = getVenueMapUrl(event.venue);
        
        let statusBadgeClass = "bg-secondary-container text-on-secondary-container";
        let statusText = "OPEN";
        let cardAction = null;
        
        if (isRegistered) {
            statusBadgeClass = "bg-tertiary-container text-on-tertiary-container";
            statusText = "REGISTERED";
            cardAction = (
                <a href={venueUrl} target="_blank" rel="noreferrer" className="bg-surface-container text-on-surface px-6 py-2 rounded-full font-bold text-sm w-full sm:w-auto mt-4 sm:mt-0 text-center hover:bg-surface-container-high transition-colors">
                    View Venue
                </a>
            );
        } else if (isOpen) {
            statusBadgeClass = "bg-primary-container text-on-primary-container";
            statusText = "LIVE";
            if (user) {
                cardAction = (
                    <Link href={route('events.registrations.store', event.id)} method="post" as="button" className="bg-gradient-to-br from-primary to-primary-container text-white px-6 py-2 rounded-full font-bold text-sm active:scale-95 transition-transform w-full sm:w-auto text-center shadow-lg shadow-primary/20 mt-4 sm:mt-0 cursor-pointer">
                        Join Event
                    </Link>
                );
            } else {
                cardAction = (
                    <Link href={route('login')} className="bg-primary text-white border-2 border-primary px-6 py-2 rounded-full font-bold text-sm hover:bg-transparent hover:text-primary transition-colors w-full sm:w-auto text-center mt-4 sm:mt-0 cursor-pointer">
                        Log in
                    </Link>
                );
            }
} else if (event.champion_name) {
                statusBadgeClass = "bg-primary text-on-primary";
                statusText = "FINISHED";
                cardAction = (
                    <Link href={route('events.show', event.id)} className="bg-surface-container text-on-surface px-6 py-2 rounded-full font-bold text-sm w-full sm:w-auto mt-4 sm:mt-0 text-center hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">emoji_events</span>
                        View Results
                    </Link>
                );
            } else {
            statusBadgeClass = "bg-error-container text-on-error-container";
            statusText = "CLOSED";
            cardAction = (
                <a href={venueUrl} target="_blank" rel="noreferrer" className="border-2 border-outline-variant text-on-surface-variant px-6 py-2 rounded-full font-bold text-sm w-full sm:w-auto mt-4 sm:mt-0 text-center hover:border-primary hover:text-primary transition-colors">
                    Venue Details
                </a>
            );
        }

        return (
            <div key={event.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_40px_40px_-5px_rgba(25,28,32,0.06)] group flex flex-col border border-surface-container-highest/50 hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-48 overflow-hidden bg-primary/10">
                    <img alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={bgImage} />
                    
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                        {event.name.split(' ')[0] || 'Sport'}
                    </div>

                    {!isOpen && !isRegistered && (
                        <>
                            <div className="absolute inset-0 bg-primary/20 backdrop-grayscale-[0.5]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-white/95 px-4 py-2 rounded-lg font-black text-primary text-xs uppercase tracking-wider shadow-lg">Registration Closed</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3 gap-4">
                        <h3 className="text-xl font-bold text-on-surface leading-tight font-headline">{event.name}</h3>
                        <span className={`text-[10px] font-black px-2 py-1 rounded tracking-widest shrink-0 uppercase ${statusBadgeClass}`}>
                            {statusText}
                        </span>
                    </div>

                    {event.champion_name && (
                        <div className="bg-primary/20 text-on-surface px-3 py-2 rounded-lg font-bold text-sm mb-4 flex items-center gap-2 border border-primary/20 shadow-sm">
                            <span className="material-symbols-outlined text-[18px] text-primary">emoji_events</span>
                            Champion: {event.champion_name}
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-2 text-on-surface-variant text-sm mb-6 font-medium">
                        <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                            {formatDateTime(event.starts_at)}
                        </span>
                        <a href={venueUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                            {event.venue.name}
                        </a>
                        <div className="flex items-center flex-shrink-0">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-primary border-2 border-surface-container-lowest shadow-sm ring-1 ring-black/5 z-20">
                                    <span className="material-symbols-outlined text-[14px]">person</span>
                                </div>
                                <div className="min-w-8 h-8 px-2 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-on-surface-variant border-2 border-surface-container-lowest z-10 whitespace-nowrap">
                                    {event.tournament ? `${event.tournament.entrant_count} entrants` : `+${event.participants_count > 0 ? event.participants_count : 0}`}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-surface-container gap-4 sm:gap-6">
                        <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between w-full sm:w-auto sm:gap-3">
                            {user && (
                                <Link
                                    href={route('events.show', event.id)}
                                    className="group/link inline-flex items-center gap-1.5 text-[14px] font-bold text-primary hover:text-primary/80 transition-all duration-300 whitespace-nowrap"
                                >
                                    <span>View details</span>
                                </Link>
                            )}
                        </div>
                        <div className="w-full sm:w-auto flex-shrink-0">
                            {cardAction}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Upcoming Events" />
            
            <div className="max-w-[96rem] mx-auto flex flex-col lg:flex-row gap-8 px-4 sm:px-6 lg:px-8 py-8 items-start">
                
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-2 relative lg:sticky lg:top-8 z-10">
                    <div className="mb-4 hidden lg:block">
                        <h3 className="font-headline font-bold text-lg text-primary">Filters</h3>
                        <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold mt-1">Refine Events</p>
                    </div>
                    
                    <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scroll-smooth snap-x">
                        {filters.map((filter) => {
                            const isActive = filter.id === selectedFilter;

                            return (
                                <button
                                    key={filter.id}
                                    type="button"
                                    onClick={() => setSelectedFilter(filter.id)}
                                    className={`snap-start flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 shrink-0 lg:shrink whitespace-nowrap ${
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
                    
                    {/* Status flashes */}
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-secondary-fixed text-on-secondary-fixed rounded-2xl font-semibold shadow-sm flex items-center gap-3 border border-secondary-fixed-dim/30">
                            <span className="material-symbols-outlined shrink-0 text-primary">check_circle</span>
                            {flash.success}
                        </div>
                    )}
                    {errors?.registration && (
                        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-2xl font-semibold shadow-sm flex items-center gap-3">
                            <span className="material-symbols-outlined shrink-0 text-error">error</span>
                            {errors.registration}
                        </div>
                    )}

                    {/* Hero Section */}
                    <section className="relative min-h-[320px] md:h-[400px] rounded-3xl md:rounded-[2.5rem] overflow-hidden mb-12 bg-gradient-to-br from-primary via-primary-container to-primary flex items-center p-8 md:p-12 lg:p-16 group shadow-xl shadow-primary/5">
                        <div className="absolute inset-0 opacity-30 mix-blend-color-dodge pointer-events-none">
                            <img className="w-full h-full object-cover" alt="Dynamic kinetic background" src="https://images.unsplash.com/photo-1552667466-07770ae110d0?q=80&w=2070&auto=format&fit=crop" />
                        </div>
                        
                        <div className="relative z-10 max-w-2xl w-full">
                            <div className="inline-flex px-4 py-1.5 bg-tertiary-container/90 backdrop-blur text-on-tertiary-container rounded-full text-[10px] font-black tracking-widest uppercase mb-6 shadow-sm border border-white/10 shadow-black/10">
                                {events.length} upcoming event{events.length === 1 ? '' : 's'} live
                            </div>
                            <h1 className="text-white text-5xl md:text-7xl font-headline font-black tracking-tighter leading-[1.05] mb-6 drop-shadow-sm">
                                Precision <br/><span className="text-secondary-fixed italic font-light drop-shadow-md">Matchday</span>
                            </h1>
                            <p className="text-primary-fixed-dim text-base md:text-lg mb-8 max-w-md font-medium leading-relaxed drop-shadow-sm">
                                Browse live schedules, register for the next session, and open venue details across {citiesCount || 0} active cit{citiesCount === 1 ? 'y' : 'ies'}.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button type="button" onClick={() => scrollToSection(eventsSectionRef)} className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-surface-container-lowest transition-colors shadow-lg shadow-black/10 hover:shadow-black/20">
                                    Browse Events
                                </button>
                                {featuredVenueUrl ? (
                                    <a href={featuredVenueUrl} target="_blank" rel="noreferrer" className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">
                                        Open Venue Map
                                    </a>
                                ) : user ? (
                                    <Link href={route('dashboard')} className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">
                                        View Dashboard
                                    </Link>
                                ) : (
                                    <Link href={route('login')} className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">
                                        Log In To Join
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Asymmetric Decor Image */}
                        <div className="absolute -right-6 md:right-0 -bottom-8 h-[110%] md:h-[120%] hidden sm:block translate-y-8 group-hover:translate-y-2 transition-transform duration-700 ease-out opacity-60 md:opacity-100 pointer-events-none drop-shadow-2xl">
                            <img className="h-full object-contain filter" alt="Professional sports player" src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop&bg=transparent" style={{ maskImage: "linear-gradient(to top, transparent 10%, black 40%)", WebkitMaskImage: "linear-gradient(to top, transparent 10%, black 40%)" }} />
                        </div>
                    </section>

                    {/* Content Header */}
                    <div ref={eventsSectionRef} className="flex flex-col gap-5 mb-8 px-2 scroll-mt-8">
                        {/* Title row */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                            <div>
                                <h2 className="text-3xl font-headline font-black text-primary tracking-tight">Upcoming Events</h2>
                                <p className="text-on-surface-variant font-medium mt-1">
                                    {activeFilter?.label || 'All Upcoming'} · {filteredEvents.length} match{filteredEvents.length === 1 ? '' : 'es'} available
                                    {searchQuery.trim() && (
                                        <span className="ml-2 text-primary font-semibold">for &ldquo;{searchQuery.trim()}&rdquo;</span>
                                    )}
                                </p>
                            </div>
                            <div className="flex gap-2 hidden sm:flex self-end">
                                <button type="button" onClick={() => cycleFilter(-1)} className="p-3 border border-outline-variant/60 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                </button>
                                <button type="button" onClick={() => cycleFilter(1)} className="p-3 border border-outline-variant/60 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        </div>

                        {/* Search bar — Kinetic Precision input style */}
                        <div className="relative w-full max-w-lg">
                            <span
                                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] pointer-events-none transition-colors duration-200"
                                style={{ color: searchFocused ? 'var(--color-primary, #002f57)' : 'var(--color-on-surface-variant, #44474f)' }}
                            >
                                search
                            </span>
                            <input
                                id="event-search"
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                placeholder="Search events by name…"
                                className="w-full pl-11 pr-10 pt-3 pb-3 bg-surface-container-high rounded-xl text-on-surface placeholder:text-on-surface-variant/60 font-medium text-sm outline-none transition-all duration-300"
                                style={{
                                    boxShadow: searchFocused
                                        ? 'inset 0 -2px 0 0 #002f57'
                                        : 'inset 0 -2px 0 0 transparent',
                                }}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors"
                                    aria-label="Clear search"
                                >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Events Grid */}
                    {filteredEvents.length === 0 ? (
                        <div className="bg-surface-container-lowest p-16 rounded-3xl text-center shadow-sm border border-surface-container-high mb-16 shadow-[0_40px_40px_-5px_rgba(25,28,32,0.06)]">
                            <div className="w-20 h-20 rounded-full bg-primary-fixed/50 text-primary mx-auto flex items-center justify-center mb-6 ring-8 ring-primary-fixed/20">
                                <span className="material-symbols-outlined text-4xl">{searchQuery.trim() ? 'manage_search' : 'event_busy'}</span>
                            </div>
                            {searchQuery.trim() ? (
                                <>
                                    <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">No events found for &ldquo;{searchQuery.trim()}&rdquo;</h3>
                                    <p className="text-on-surface-variant max-w-sm mx-auto text-sm leading-relaxed mb-6">Try a different keyword or clear the search to see all events.</p>
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                        Clear Search
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">No events match this filter yet.</h3>
                                    <p className="text-on-surface-variant max-w-sm mx-auto text-sm leading-relaxed">Try another category to browse the rest of the live schedule.</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-8">
                                {pagedEvents.map((event, index) => renderEventCard(event, (currentPage - 1) * PAGE_SIZE + index))}
                            </div>

                            {/* Pagination bar */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mb-16 px-1">
                                    {/* Left info */}
                                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest hidden sm:block">
                                        Page {currentPage} of {totalPages}
                                    </p>

                                    {/* Page controls */}
                                    <div className="flex items-center gap-1 mx-auto sm:mx-0">
                                        {/* Prev */}
                                        <button
                                            type="button"
                                            onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); scrollToSection(eventsSectionRef); }}
                                            disabled={currentPage === 1}
                                            className="p-2.5 rounded-xl border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Previous page"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                        </button>

                                        {/* Page numbers */}
                                        {(() => {
                                            const pages = [];
                                            const delta = 1; // siblings each side
                                            const left  = Math.max(2, currentPage - delta);
                                            const right = Math.min(totalPages - 1, currentPage + delta);

                                            // Always first
                                            pages.push(1);

                                            // Left ellipsis
                                            if (left > 2) pages.push('...-left');

                                            // Middle range
                                            for (let i = left; i <= right; i++) pages.push(i);

                                            // Right ellipsis
                                            if (right < totalPages - 1) pages.push('...-right');

                                            // Always last
                                            if (totalPages > 1) pages.push(totalPages);

                                            return pages.map((page) => {
                                                if (typeof page === 'string') {
                                                    return (
                                                        <span key={page} className="w-10 h-10 flex items-center justify-center text-on-surface-variant text-sm select-none">
                                                            &hellip;
                                                        </span>
                                                    );
                                                }
                                                const isActive = page === currentPage;
                                                return (
                                                    <button
                                                        key={page}
                                                        type="button"
                                                        onClick={() => { setCurrentPage(page); scrollToSection(eventsSectionRef); }}
                                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${
                                                            isActive
                                                                ? 'bg-primary text-on-primary shadow-md shadow-primary/25'
                                                                : 'text-on-surface-variant hover:bg-surface-container-high'
                                                        }`}
                                                        aria-current={isActive ? 'page' : undefined}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            });
                                        })()}

                                        {/* Next */}
                                        <button
                                            type="button"
                                            onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); scrollToSection(eventsSectionRef); }}
                                            disabled={currentPage === totalPages}
                                            className="p-2.5 rounded-xl border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Next page"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                        </button>
                                    </div>

                                    {/* Right info — entries range */}
                                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest hidden sm:block">
                                        {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredEvents.length)} of {filteredEvents.length}
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Event Stats */}
                    {user && (
                        <div ref={statsSectionRef} className="mb-8 scroll-mt-8">
                            <h2 className="text-xl font-headline font-bold text-on-surface tracking-tight mb-6 px-2">Your Event Snapshot</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_20px_25px_-5px_rgba(25,28,32,0.03)] border-l-4 border-l-primary relative overflow-hidden group hover:-translate-y-1 transition-transform">
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Registered Events</span>
                                    <span className="text-4xl font-headline font-black text-primary">{registeredEvents.length}</span>
                                    <div className="mt-4 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full group-hover:bg-primary/90 transition-colors" style={{ width: `${events.length > 0 ? (registeredEvents.length / events.length) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                                
                                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_20px_25px_-5px_rgba(25,28,32,0.03)] border-l-4 border-l-tertiary relative overflow-hidden group hover:-translate-y-1 transition-transform">
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Open To Join</span>
                                    <span className="text-4xl font-headline font-black text-primary">{joinableEvents.length}</span>
                                    <div className="mt-4 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                                        <div className="h-full bg-tertiary rounded-full" style={{ width: `${events.length > 0 ? (joinableEvents.length / events.length) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                                
                                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_20px_25px_-5px_rgba(25,28,32,0.03)] border-l-4 border-l-blue-400 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Participants On Your Events</span>
                                    <span className="text-4xl font-headline font-black text-primary">{registeredParticipants}</span>
                                    <div className="mt-4 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${totalParticipants > 0 ? (registeredParticipants / totalParticipants) * 100 : 0}%` }}></div>
                                    </div>
                                </div>

                                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_20px_25px_-5px_rgba(25,28,32,0.03)] border-l-4 border-l-slate-300 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Cities Covered</span>
                                    <span className="text-4xl font-headline font-black text-primary">{registeredCitiesCount}</span>
                                    <div className="mt-4 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                                        <div className="h-full bg-tertiary-container rounded-full" style={{ width: `${citiesCount > 0 ? (registeredCitiesCount / citiesCount) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
