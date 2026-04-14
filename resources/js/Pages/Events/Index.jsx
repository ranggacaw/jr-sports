import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const formatDateTime = (dateString) =>
    new Intl.DateTimeFormat('en-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(dateString));

export default function Index({ events }) {
    const { auth, flash, errors } = usePage().props;
    const user = auth.user;
    const [viewMode, setViewMode] = useState('grid');
    const openEventsCount = events.filter((event) => event.registration_is_open).length;
    const participantCount = events.reduce(
        (total, event) => total + event.participants_count,
        0,
    );

    const renderEventCard = (event, index) => {
        const styleIndex = viewMode === 'list' ? 2 : index % 4;

        // Bento Card 1: Large primary image card (md:col-span-8)
        if (styleIndex === 0) {
            return (
                <div key={event.id} className="md:col-span-8 group relative overflow-hidden rounded-xl bg-surface-container-lowest transition-all hover:bg-surface-container-high border-none">
                    <div className="relative h-[24rem] overflow-hidden bg-primary">
                        <div className="w-full h-full bg-surface-container-high transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-6 right-6">
                            <span className={event.registration_is_open ? "bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full font-headline font-bold text-xs tracking-widest uppercase" : "bg-error-container text-on-error-container px-4 py-1.5 rounded-full font-headline font-bold text-xs tracking-widest uppercase"}>
                                {event.registration_is_open ? 'OPEN' : 'CLOSED'}
                            </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                            <h2 className="text-4xl font-headline font-black mb-2">{event.name}</h2>
                            <div className="flex flex-wrap gap-6 items-center text-sm font-medium opacity-90">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> {formatDateTime(event.starts_at)}</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span> {event.venue.name}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 flex justify-between items-center bg-surface-container-lowest">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-fixed flex items-center justify-center text-xs font-bold text-primary">{event.participants_count}</div>
                        </div>
                        <div className="flex gap-3">
                            {user ? (
                                event.is_registered ? (
                                    <span className="px-8 py-3 rounded-full font-bold bg-surface-container text-on-surface">Registered</span>
                                ) : event.registration_is_open ? (
                                    <Link href={route('events.registrations.store', event.id)} method="post" as="button" className="bg-secondary-fixed text-on-secondary-container px-8 py-3 rounded-full font-bold hover:brightness-95 transition-all shadow-md shadow-secondary-fixed/30">Join Event</Link>
                                ) : (
                                    <span className="px-8 py-3 rounded-full font-bold bg-error-container text-on-error-container">Closed</span>
                                )
                            ) : (
                                <Link href={route('login')} className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold">Log in</Link>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Bento Card 2: Vertical card (md:col-span-4)
        if (styleIndex === 1) {
            return (
                <div key={event.id} className="md:col-span-4 bg-surface-container-lowest rounded-xl p-1 overflow-hidden transition-all hover:bg-surface-container-high h-full flex flex-col">
                    <div className="relative h-64 rounded-t-lg bg-surface-container-high overflow-hidden bg-primary/20">
                        <div className="absolute top-4 right-4">
                            <span className={event.registration_is_open ? "bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full font-headline font-bold text-xs tracking-widest uppercase" : "bg-error-container text-on-error-container px-4 py-1.5 rounded-full font-headline font-bold text-xs tracking-widest uppercase"}>
                                {event.registration_is_open ? 'OPEN' : 'CLOSED'}
                            </span>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-headline font-bold text-on-surface mb-2">{event.name}</h3>
                        <p className="text-sm text-on-surface-variant mb-6">{event.recurrence || 'Event details and logistics.'}</p>
                        <div className="space-y-3 mb-8 text-on-surface-variant flex-1">
                            <div className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-primary text-lg">event</span>
                                <span>{formatDateTime(event.starts_at)}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                <span>{event.venue.name}</span>
                            </div>
                        </div>
                        {user ? (
                            event.is_registered ? (
                                <button disabled className="w-full py-3 rounded-full border-2 border-surface-container text-on-surface font-bold mt-auto">Registered</button>
                            ) : event.registration_is_open ? (
                                <Link href={route('events.registrations.store', event.id)} method="post" as="button" className="w-full py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors text-center inline-block mt-auto">Join Event</Link>
                            ) : (
                                <button disabled className="w-full py-3 rounded-full border-2 border-error-container text-error font-bold mt-auto">Closed</button>
                            )
                        ) : (
                            <Link href={route('login')} className="w-full py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors text-center inline-block mt-auto">Log in</Link>
                        )}
                    </div>
                </div>
            );
        }

        // Bento Card 3: Horizontal card (md:col-span-6)
        if (styleIndex === 2) {
            return (
                <div key={event.id} className="md:col-span-6 bg-surface-container-lowest rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center transition-all hover:bg-surface-container-high">
                    <div className="w-full md:w-1/4 xl:w-1/3 aspect-square rounded-lg bg-surface-container-high overflow-hidden shrink-0 bg-primary/20"></div>
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-start lg:mb-4 gap-2">
                            <h3 className="text-xl md:text-2xl font-headline font-bold text-on-surface">{event.name}</h3>
                            <span className={event.registration_is_open ? "bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-bold text-[10px] uppercase shrink-0" : "bg-error-container text-on-error-container px-3 py-1 rounded-full font-bold text-[10px] uppercase shrink-0"}>
                                {event.registration_is_open ? 'OPEN' : 'CLOSED'}
                            </span>
                        </div>
                        <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">{event.venue.name} • {event.venue.city}</p>
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-xs font-medium text-primary break-words">
                                {formatDateTime(event.starts_at)}
                            </div>
                            {user ? (
                                event.is_registered ? (
                                    <span className="text-sm font-bold text-on-surface">Registered</span>
                                ) : event.registration_is_open ? (
                                    <Link href={route('events.registrations.store', event.id)} method="post" as="button" className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-md shadow-primary/10 text-center inline-block">Join Event</Link>
                                ) : (
                                    <span className="text-sm font-bold text-error">Closed</span>
                                )
                            ) : (
                                <Link href={route('login')} className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold border border-primary inline-block text-center whitespace-nowrap">Log in</Link>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Bento Card 4: Solid primary background (md:col-span-6)
        return (
            <div key={event.id} className="md:col-span-6 bg-primary text-white rounded-xl p-8 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                            <span className="material-symbols-outlined text-secondary-fixed text-3xl">sports_score</span>
                        </div>
                        <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest text-white">
                            {event.registration_is_open ? 'OPEN' : 'CLOSED'}
                        </span>
                    </div>
                    <h3 className="text-3xl font-headline font-black mb-2">{event.name}</h3>
                    <p className="text-primary-fixed text-sm mb-8 max-w-xs opacity-90">{formatDateTime(event.starts_at)} @ {event.venue.name}</p>
                    
                    <div className="flex flex-wrap items-center gap-8 mt-auto">
                        <div>
                            <p className="text-[10px] uppercase tracking-tighter opacity-60">Status</p>
                            <p className="font-bold">{event.registration_is_open ? 'Active' : 'Closed'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-tighter opacity-60">Participants</p>
                            <p className="font-bold">{event.participants_count} Participants</p>
                        </div>
                        <div className="ml-auto w-full md:w-auto mt-4 md:mt-0 flex text-sm font-bold">
                            {user ? (
                                event.is_registered ? (
                                    <span>Registered</span>
                                ) : event.registration_is_open ? (
                                    <Link href={route('events.registrations.store', event.id)} method="post" as="button" className="text-secondary-fixed hover:underline inline-flex items-center gap-1">Join Event <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
                                ) : null
                            ) : (
                                <Link href={route('login')} className="text-secondary-fixed hover:underline inline-flex items-center gap-1">Log in <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Browse Events" />
            <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
                <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-8 md:gap-6 mt-8">
                    <div className="max-w-2xl">
                        <span className="text-secondary font-bold text-sm tracking-[0.2em] uppercase block mb-2">Corporate League</span>
                        <h1 className="text-5xl md:text-6xl font-headline font-black text-on-surface tracking-tight leading-none mb-4">
                            Precision <span className="text-primary italic">Momentum.</span>
                        </h1>
                        <p className="text-on-surface-variant text-lg">
                            Manage your elite athletic commitments and corporate competitions with institutional precision.
                        </p>
                    </div>
                    
                    <div className="flex bg-surface-container-low rounded-full p-1 mb-2 border border-surface-container-highest">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 flex items-center justify-center rounded-full transition-all duration-300 ${
                                viewMode === 'grid' 
                                    ? 'bg-white shadow-sm text-primary font-bold' 
                                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                            }`}
                            aria-label="Grid View"
                        >
                            <span className="material-symbols-outlined text-[20px]">grid_view</span>
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 flex items-center justify-center rounded-full transition-all duration-300 ${
                                viewMode === 'list' 
                                    ? 'bg-white shadow-sm text-primary font-bold' 
                                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                            }`}
                            aria-label="List View"
                        >
                            <span className="material-symbols-outlined text-[20px]">view_list</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {flash?.success && (
                        <div className="p-4 bg-secondary-container text-on-secondary-container rounded-lg font-medium">{flash.success}</div>
                    )}

                    {errors?.registration && (
                        <div className="p-4 bg-error-container text-on-error-container rounded-lg font-medium">{errors.registration}</div>
                    )}

                    {events.length === 0 ? (
                        <div className="bg-surface-container-lowest p-12 rounded-xl text-center border-none transition-all hover:bg-surface-container-high my-8">
                            <h3 className="text-2xl font-headline font-bold text-primary">No upcoming events are published yet.</h3>
                            <p className="mt-4 text-on-surface-variant max-w-xl mx-auto">Once an event is created, it will appear here with schedule, venue, and registration status.</p>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch" : "flex flex-col gap-4"}>
                            {events.map((event, index) => renderEventCard(event, index))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

