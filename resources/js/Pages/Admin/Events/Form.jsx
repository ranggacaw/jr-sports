import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const defaultValues = {
    name: '',
    recurrence: 'One-time',
    starts_at: '',
    ends_at: '',
    venue: {
        name: '',
        address: '',
        city: '',
        google_maps_url: '',
    },
};

export default function Form({ event }) {
    const isEditing = Boolean(event);

    const { data, setData, post, put, processing, errors } = useForm(
        event ?? defaultValues,
    );

    const setVenueField = (field, value) => {
        setData('venue', {
            ...data.venue,
            [field]: value,
        });
    };

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route('admin.events.update', event.id));
            return;
        }

        post(route('admin.events.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? 'Edit Event' : 'Create Event'} />

            {/* Main Canvas */}
            <div className="pt-8 pb-16 px-6 max-w-lg md:max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 relative overflow-hidden rounded-xl h-48 flex flex-col justify-end p-6 bg-[color:var(--primary)] text-[color:var(--on-primary)] md:hidden">
                    <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <img 
                        alt="Running track" 
                        className="absolute inset-0 w-full h-full object-cover z-[-1]" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmhcW91Q8ZTvwSAXwU9kEd-nEoWCsoFNv0FtqOQ4gFaPeIF2B6qAgC_pmsYrJv65wg_6_ijc_dD07CwsOKIBY8YmsMEjkqgttraLpweGS1v7nsw_jXlr80h6-JdFdYQBmQHr6pK8NF87MP_7h6E43BxQxG4QxC33Yi9RrxQaHd3QMUBJZY5Jp_HB5SHXzY9H62EwYeU1LSE4NyFjYSBLoz90QNp2gluU2mmVG8jkEmnCKDZ1z0vYiN_MKrN6SJA2nTR3HQqw57yIrO" 
                    />
                    <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-[#6bfe9c] mb-1 font-label">
                        Event Setup
                    </span>
                    <h2 className="relative z-10 text-3xl font-extrabold font-headline tracking-tighter leading-none text-white">
                        {isEditing ? 'Refine Event' : 'Configure Event'}
                    </h2>
                </div>

                <div className="mb-12 relative hidden md:block">
                    <div className="absolute -top-6 -left-4 text-[color:var(--primary)] opacity-5 font-black text-8xl uppercase pointer-events-none select-none">
                        {isEditing ? 'Refine' : 'Create'}
                    </div>
                    <h1 className="text-4xl md:text-[56px] font-headline font-black text-[color:var(--primary-container)] tracking-tighter relative z-10">
                        {isEditing ? 'Refine Event' : 'Configure Event'}
                    </h1>
                    <p className="text-[color:var(--on-surface-variant)] font-medium mt-2 max-w-xl">
                        Define the kinetic parameters for the upcoming high-performance event in the ProMomentum ecosystem.
                    </p>
                </div>

                <form onSubmit={submit} className="grid grid-cols-12 gap-6 md:gap-8 items-start">
                    {/* Left Column: Primary Details & Timing */}
                    <div className="col-span-12 lg:col-span-7 space-y-6">
                        
                        {/* Event Identity Card */}
                        <div className="bg-[color:var(--surface-container-lowest)] p-6 md:p-8 rounded-lg border border-[color:var(--outline-variant)]/10 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 md:mb-8">
                                <div className="w-1 h-6 bg-[color:var(--tertiary)] rounded-full"></div>
                                <h2 className="font-headline font-bold text-xl text-[color:var(--primary)]">Event Identity</h2>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[color:var(--on-surface-variant)] mb-2 md:ml-0 ml-1">
                                        Sport Name
                                    </label>
                                    <div className="relative group">
                                        <input 
                                            type="text" 
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full bg-[color:var(--surface-container-highest)] border-none rounded md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary-container)] transition-all p-4 text-[color:var(--on-surface)] placeholder:text-[color:var(--outline)]/50 font-medium" 
                                            placeholder="e.g. Professional League Finals" 
                                        />
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--outline)]/50 group-focus-within:text-[color:var(--primary)] text-lg">sports_tennis</span>
                                    </div>
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[color:var(--on-surface-variant)] mb-2 md:ml-0 ml-1">
                                        Frequency
                                    </label>
                                    <select 
                                        value={data.recurrence}
                                        onChange={(e) => setData('recurrence', e.target.value)}
                                        className="w-full bg-[color:var(--surface-container-highest)] border-none rounded md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary-container)] transition-all p-4 text-[color:var(--on-surface)] font-medium appearance-none"
                                    >
                                        <option value="One-time">One-time Event</option>
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly Series</option>
                                        <option value="Monthly">Monthly Tournament</option>
                                    </select>
                                    <InputError message={errors.recurrence} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Precision Timing Card */}
                        <div className="bg-[color:var(--surface-container-lowest)] p-6 md:p-8 rounded-lg border border-[color:var(--outline-variant)]/10 shadow-sm relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-6 md:mb-8">
                                <div className="w-1 h-6 bg-[color:var(--primary)] rounded-full"></div>
                                <h2 className="font-headline font-bold text-xl text-[color:var(--primary)]">Precision Timing</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:gap-6 relative z-10">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[color:var(--on-surface-variant)] mb-2 md:ml-0 ml-1">
                                        Start Time
                                    </label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--outline)] text-lg">schedule</span>
                                        <input 
                                            type="datetime-local" 
                                            value={data.starts_at}
                                            onChange={(e) => setData('starts_at', e.target.value)}
                                            className="w-full bg-[color:var(--surface-container-highest)] border-none rounded md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary-container)] transition-all p-4 pl-12 text-[color:var(--on-surface)] font-medium" 
                                        />
                                    </div>
                                    <InputError message={errors.starts_at} className="mt-2" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[color:var(--on-surface-variant)] mb-2 md:ml-0 ml-1">
                                        End Time
                                    </label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--outline)] text-lg">timer_off</span>
                                        <input 
                                            type="datetime-local" 
                                            value={data.ends_at ?? ''}
                                            onChange={(e) => setData('ends_at', e.target.value)}
                                            className="w-full bg-[color:var(--surface-container-highest)] border-none rounded md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary-container)] transition-all p-4 pl-12 text-[color:var(--on-surface)] font-medium" 
                                        />
                                    </div>
                                    <InputError message={errors.ends_at} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {event?.registration_closed_at && (
                            <div className="p-4 bg-[color:var(--error-container)] text-[color:var(--on-error-container)] rounded-lg border border-[color:var(--error)]/20 font-bold">
                                Registration is already closed for this event.
                            </div>
                        )}
                    </div>

                    {/* Right Column: Venue Logistics */}
                    <div className="col-span-12 lg:col-span-5 space-y-6">
                        {/* Location Management Card */}
                        <div className="bg-[color:var(--surface-container-highest)] md:bg-white md:bg-opacity-50 md:backdrop-blur-sm p-6 md:p-8 rounded-lg border border-[color:var(--outline-variant)]/10 shadow-sm relative">
                            <div className="flex items-center gap-3 mb-6 md:mb-8">
                                <div className="w-1 h-6 bg-[color:var(--tertiary-container)] rounded-full"></div>
                                <h2 className="font-headline font-bold text-xl text-[color:var(--primary)]">Venue Logistics</h2>
                            </div>
                            
                            <div className="space-y-4 md:space-y-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[color:var(--on-surface-variant)] mb-2 md:ml-0 ml-1">
                                        Venue Name
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={data.venue.name}
                                            onChange={(e) => setVenueField('name', e.target.value)}
                                            className="w-full bg-[color:var(--surface-container-lowest)] md:bg-white border-none rounded md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary-container)] transition-all p-4 pr-12 text-[color:var(--on-surface)] font-medium placeholder:text-[color:var(--outline)]/50" 
                                            placeholder="Olympia National Stadium" 
                                        />
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--outline)]/50 text-lg">location_on</span>
                                    </div>
                                    <InputError message={errors['venue.name']} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-[color:var(--on-surface-variant)] mb-2 md:ml-0 ml-1">
                                            City
                                        </label>
                                        <input 
                                            type="text" 
                                            value={data.venue.city}
                                            onChange={(e) => setVenueField('city', e.target.value)}
                                            className="w-full bg-[color:var(--surface-container-lowest)] md:bg-white border-none rounded md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary-container)] transition-all p-4 text-[color:var(--on-surface)] font-medium placeholder:text-[color:var(--outline)]/50" 
                                            placeholder="City" 
                                        />
                                        <InputError message={errors['venue.city']} className="mt-2" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-[color:var(--on-surface-variant)] mb-2 md:ml-0 ml-1">
                                            Address
                                        </label>
                                        <input 
                                            type="text" 
                                            value={data.venue.address}
                                            onChange={(e) => setVenueField('address', e.target.value)}
                                            className="w-full bg-[color:var(--surface-container-lowest)] md:bg-white border-none rounded md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary-container)] transition-all p-4 text-[color:var(--on-surface)] font-medium placeholder:text-[color:var(--outline)]/50" 
                                            placeholder="Address" 
                                        />
                                        <InputError message={errors['venue.address']} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[color:var(--on-surface-variant)] mb-2 md:ml-0 ml-1">
                                        Google Maps URL
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="url" 
                                            value={data.venue.google_maps_url ?? ''}
                                            onChange={(e) => setVenueField('google_maps_url', e.target.value)}
                                            className="w-full bg-[color:var(--surface-container-lowest)] md:bg-white border-none rounded md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary-container)] transition-all p-4 pr-12 text-[color:var(--on-surface)] font-medium text-sm placeholder:text-[color:var(--outline)]/50" 
                                            placeholder="https://maps.google.com/..." 
                                        />
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--outline)]/50 text-lg">map</span>
                                    </div>
                                    <InputError message={errors['venue.google_maps_url']} className="mt-2" />
                                </div>

                                {/* Map Preview */}
                                <div className="mt-4 relative w-full h-32 md:h-48 rounded-xl overflow-hidden group border border-[color:var(--outline-variant)]/10">
                                    <img 
                                        alt="Map Preview" 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU5kGyg57l6DDr8NItKeeNqCfuLZi57yDQ-f_pNx8Uu2GDNz6sfyiDovWEXBfv9yX7JPadSOBplfJ02X8w0a2yKYfawYjNfMoNIhqXeGR5gEMWwLXSscXiFYk8EIq6iXkGnAyId3kqjNrJvn7Mn_pXj6RPl9aY4lQtqGS_B2d7tMVqitXZMwqdNCywsJGqOti2OII8Pl4wX1TDYDf417FNQd2avavuaHtvF3c27d0aNPjK3s3DIzeU8aMDhxDJpziYpzKKw14Vh-eN" 
                                    />
                                    <div className="absolute inset-0 bg-[color:var(--primary)]/10 pointer-events-none md:hidden"></div>
                                    <div className="absolute inset-0 flex items-center justify-center md:items-end md:justify-start md:p-4">
                                        <div className="bg-[color:var(--primary)] text-[color:var(--on-primary)] md:bg-white md:text-[color:var(--primary)] px-4 py-2 rounded-full text-xs font-bold font-label flex items-center gap-2 shadow-lg">
                                            <span className="material-symbols-outlined text-[color:var(--on-primary)] md:text-[color:var(--primary)] text-sm">location_searching</span>
                                            <span className="tracking-tighter">PREVIEW LOCATION</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Hub */}
                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full py-5 md:py-6 rounded-xl md:rounded bg-[color:var(--primary)] text-[color:var(--on-primary)] md:bg-gradient-to-br md:from-[#002f57] md:to-[#01457d] md:text-white font-headline font-bold text-lg shadow-xl shadow-[color:var(--primary-container)]/20 flex items-center justify-center gap-4 group transition-transform active:scale-[0.95] md:active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined md:hidden !font-[100]" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                                {isEditing ? 'Save Event Configuration' : 'Confirm Event Configuration'}
                                {processing ? (
                                    <span className="material-symbols-outlined animate-spin hidden md:block">refresh</span>
                                ) : (
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform hidden md:block">rocket_launch</span>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-[color:var(--outline)] uppercase tracking-[0.2em] mt-6 font-medium hidden md:block">Final validation required upon submission</p>
                        </div>
                        
                        <div className="text-center md:text-right mt-6 md:mt-2">
                            <Link href={route('admin.events.index')} className="text-sm font-bold text-[color:var(--outline)] hover:text-[color:var(--primary)] transition-colors">
                                Cancel & return to dashboard
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
