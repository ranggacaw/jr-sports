import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function EmployeeDashboard({ registeredEvents }) {
    const formatTime = (dateString) =>
        new Intl.DateTimeFormat('en-ID', {
            timeStyle: 'short',
        }).format(new Date(dateString));

    const formatDate = (dateString, format = 'MMM D') => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-ID', { month: 'short', day: 'numeric' });
    };

    const mainEvent = registeredEvents[0];
    const otherEvents = registeredEvents.slice(1, 4);

    return (
        <AuthenticatedLayout>
            <Head title="Active Momentum" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <header className="mb-12 max-w-5xl">
                    <h1 className="text-5xl font-['Lexend'] font-extrabold text-[color:var(--primary)] mb-4 tracking-tight">
                        Active Momentum
                    </h1>
                    <p className="text-[color:var(--on-surface-variant)] text-lg max-w-2xl font-medium">
                        Your upcoming corporate competition schedule. Track performance, join teams, and stay ahead of the game.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Large Featured Card for Next Event */}
                    {mainEvent ? (
                        <div className="lg:col-span-2 relative group overflow-hidden rounded-xl bg-[color:var(--surface-container-lowest)] transition-all hover:bg-[color:var(--surface-container-high)] p-1">
                            <div className="h-full flex flex-col md:flex-row bg-[color:var(--surface-container-lowest)] rounded-xl overflow-hidden">
                                <div className="w-full md:w-1/2 relative h-64 md:h-full bg-[color:var(--surface-dim)]">
                                    <div className="absolute inset-0 flex items-center justify-center text-[color:var(--on-surface-variant)] opacity-50 text-4xl">
                                        <span className="material-symbols-outlined text-6xl">sports_score</span>
                                    </div>
                                </div>
                                <div className="flex-1 p-8 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="bg-[color:var(--secondary-container)] text-[color:var(--on-secondary-container)] px-4 py-1 rounded-full font-['Lexend'] text-xs font-bold uppercase tracking-wider">
                                                JOINED
                                            </span>
                                            <span className="text-[color:var(--on-surface-variant)] font-bold font-['Lexend'] text-sm uppercase">
                                                {formatDate(mainEvent.starts_at)}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-['Lexend'] font-bold text-[color:var(--primary)] mb-2">
                                            {mainEvent.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-[color:var(--on-surface-variant)] mb-6">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                <span className="text-sm font-medium">
                                                    {formatTime(mainEvent.starts_at)} 
                                                    {mainEvent.ends_at && ` - ${formatTime(mainEvent.ends_at)}`}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">location_on</span>
                                                <span className="text-sm font-medium">{mainEvent.venue.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 text-sm font-medium text-[color:var(--on-surface-variant)]">
                                        <p>You have secured a spot in this event.</p>
                                        <p className="mt-1">{mainEvent.venue.address}, {mainEvent.venue.city}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="lg:col-span-2 rounded-xl bg-[color:var(--surface-container-lowest)] p-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-[color:var(--outline-variant)]">
                            <span className="material-symbols-outlined text-6xl text-[color:var(--outline)] mb-4">event_available</span>
                            <h3 className="text-2xl font-bold text-[color:var(--on-surface)] mb-2">No Upcoming Events</h3>
                            <p className="text-[color:var(--on-surface-variant)] mb-6 max-w-md">
                                You haven't registered for any future events yet. Explore open sessions and secure your spot on the team.
                            </p>
                            <Link
                                href={route('events.index')}
                                className="bg-[color:var(--primary)] text-[color:var(--on-primary)] px-6 py-3 rounded-lg font-bold text-sm tracking-wide transition-transform active:scale-95"
                            >
                                BROWSE EVENTS
                            </Link>
                        </div>
                    )}

                    {/* Small Grid Cards */}
                    {otherEvents.map((evt) => (
                        <div key={evt.id} className="bg-[color:var(--surface-container-lowest)] rounded-xl p-6 flex flex-col justify-between hover:bg-[color:var(--surface-container-high)] transition-all">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-[color:var(--secondary-container)] text-[color:var(--on-secondary-container)] px-3 py-1 rounded-full font-['Lexend'] text-[10px] font-bold uppercase tracking-wider">
                                        JOINED
                                    </span>
                                    <span className="material-symbols-outlined text-[color:var(--primary)]">event</span>
                                </div>
                                <h4 className="text-xl font-['Lexend'] font-bold text-[color:var(--on-surface)] mb-1">
                                    {evt.name}
                                </h4>
                                <p className="text-[color:var(--on-surface-variant)] text-sm font-medium mb-4 uppercase">
                                    {formatDate(evt.starts_at)} • {formatTime(evt.starts_at)}
                                </p>
                            </div>
                            <div className="mt-8 text-sm font-semibold text-[color:var(--on-surface-variant)]">
                                {evt.venue.name}
                            </div>
                        </div>
                    ))}

                    {/* Explore More Placeholder if space allows */}
                    {otherEvents.length < 2 && (
                       <Link href={route('events.index')} className="bg-[color:var(--surface-container-lowest)] rounded-xl p-6 flex flex-col justify-center items-center hover:bg-[color:var(--surface-container-high)] transition-all group border border-[color:var(--outline-variant)]">
                          <span className="material-symbols-outlined text-4xl text-[color:var(--primary)] mb-2 group-hover:scale-110 transition-transform">search</span>
                          <h4 className="text-lg font-['Lexend'] font-bold text-[color:var(--on-surface)]">Discover More</h4>
                          <p className="text-sm text-[color:var(--on-surface-variant)] mt-1">See all open sessions</p>
                       </Link>
                    )}

                    {/* Stats Widget */}
                    <div className="bg-[color:var(--primary)] text-[color:var(--on-primary)] rounded-xl p-8 flex flex-col justify-between shadow-xl">
                        <span className="material-symbols-outlined text-4xl text-[color:var(--secondary-fixed)] mb-4">insights</span>
                        <div>
                            <h5 className="text-3xl font-['Lexend'] font-extrabold mb-1 tracking-tighter">Your Momentum</h5>
                            <p className="text-[color:var(--on-primary-container)] text-sm font-medium opacity-80">
                                Total registrations: {registeredEvents.length}
                            </p>
                        </div>
                        <div className="mt-6 flex justify-between items-end">
                            <div className="text-5xl font-['Lexend'] font-black text-[color:var(--secondary-fixed)]">
                                {registeredEvents.length > 0 ? "ON" : "OFF"}
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--on-primary-container)]">
                                    TRACK STATUS
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}