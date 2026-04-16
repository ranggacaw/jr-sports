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
                predicate: (event) => !event.registration_is_open,
            },
            ...recurrenceFilters,
        ];
    }, [events]);

    const activeFilter = filters.find((filter) => filter.id === selectedFilter) || filters[0];
    const filteredEvents = events.filter((event) => activeFilter.predicate(event));

    useEffect(() => {
        if (!filters.some((filter) => filter.id === selectedFilter)) {
            setSelectedFilter('all');
        }
    }, [filters, selectedFilter]);

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
                            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 px-2">
                                <div>
                                    <h2 className="text-3xl font-headline font-black tracking-tight text-on-surface">Active Events</h2>
                                    <p className="text-on-surface-variant mt-1 font-medium">{activeFilter.label} · {filteredEvents.length} event{filteredEvents.length === 1 ? '' : 's'} shown</p>
                                </div>
                                <Link href={route('events.index')} className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                                    View Public <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                </Link>
                            </div>
                            
                            <div className="space-y-4">
                                {filteredEvents.length === 0 ? (
                                    <div className="bg-surface-container-lowest p-12 rounded-[2rem] text-center border border-surface-container shadow-sm">
                                        <div className="w-16 h-16 rounded-full bg-surface-container text-on-surface-variant mx-auto flex items-center justify-center mb-4">
                                            <span className="material-symbols-outlined text-3xl">inbox</span>
                                        </div>
                                        <p className="text-lg font-bold text-on-surface">No events match this filter</p>
                                        <p className="text-on-surface-variant text-sm mt-2">Switch filters or create a new event to expand the current schedule.</p>
                                    </div>
                                ) : (
                                    filteredEvents.map((event, index) => {
                                        const eventImage = STUB_IMAGES[index % STUB_IMAGES.length];
                                        const borderColor = ['border-l-primary', 'border-l-tertiary', 'border-l-secondary'][index % 3];
                                        const progressColor = ['bg-primary', 'bg-tertiary', 'bg-secondary'][index % 3];
                                        const fillPercentage = maxParticipants > 0
                                            ? Math.round((event.participants_count / maxParticipants) * 100)
                                            : 0;

                                        return (
                                            <div key={event.id} className={`bg-surface-container-lowest p-5 sm:p-6 rounded-[2rem] transition-all hover:-translate-y-0.5 border-l-[3px] ${borderColor} shadow-[0_8px_20px_-6px_rgba(0,0,0,0.05)] border border-surface-container-highest/20 overflow-hidden`}>
                                                <div className="flex flex-col lg:flex-row lg:items-center gap-5 sm:gap-6">
                                                    
                                                    <div className="flex flex-row items-center gap-4 sm:gap-6 flex-1 min-w-0">
                                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.25rem] overflow-hidden shrink-0 shadow-sm border border-outline-variant/20 bg-surface-container-highest">
                                                            <img 
                                                                className="w-full h-full object-cover" 
                                                                alt={event.name} 
                                                                src={eventImage} 
                                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop"; }} 
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0 py-1">
                                                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                                                                <h4 className="text-lg sm:text-xl font-headline font-bold text-on-surface leading-tight truncate">{event.name}</h4>
                                                                {!event.registration_is_open && (
                                                                    <span className="bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">Closed</span>
                                                                )}
                                                            </div>
                                                            <p className="text-on-surface-variant text-sm tracking-wide truncate">{event.recurrence || 'General Division'} • {event.venue.city}</p>
                                                            <p className="text-on-surface text-xs font-semibold mt-1.5 flex items-center gap-1.5 opacity-80">
                                                                <span className="material-symbols-outlined text-[14px]">schedule</span> {formatDateTime(event.starts_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col xl:flex-row items-start xl:items-center gap-5 sm:gap-6 shrink-0 w-full lg:w-auto mt-2 lg:mt-0">
                                                        <div className="flex flex-row items-center justify-between xl:justify-start gap-4 sm:gap-6 w-full xl:w-auto ml-0 xl:ml-4">
                                                            <div className="flex flex-col gap-2 w-full sm:w-32 xl:w-28 shrink-0">
                                                                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Relative turnout</span>
                                                                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                                                                    <div className={`h-full ${progressColor} rounded-full`} style={{ width: `${fillPercentage}%` }}></div>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm font-medium text-on-surface whitespace-nowrap text-right xl:text-left min-w-[60px]">
                                                                {event.participants_count} joined
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex flex-row flex-wrap items-center gap-2 w-full xl:w-auto">
                                                            <Link href={route('admin.events.show', event.id)} className="flex-1 xl:flex-none justify-center px-4 py-2.5 bg-[#002B59] hover:bg-[#001f40] text-white font-bold rounded-xl transition-colors text-sm shadow-sm inline-flex items-center whitespace-nowrap">
                                                                Show Details
                                                            </Link>
                                                            <Link href={route('admin.events.edit', event.id)} className="flex-1 xl:flex-none justify-center px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold rounded-xl transition-colors text-sm inline-flex items-center whitespace-nowrap">
                                                                Edit
                                                            </Link>
                                                            {event.registration_is_open && (
                                                                <Link href={route('admin.events.close-registration', event.id)} method="patch" as="button" className="flex-1 xl:flex-none justify-center px-4 py-2.5 bg-white border border-outline-variant/60 text-on-surface-variant font-semibold rounded-xl hover:bg-surface-container hover:text-on-surface transition-colors text-sm whitespace-nowrap shadow-sm inline-flex items-center">
                                                                    Close Reg
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
                        </section>
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
