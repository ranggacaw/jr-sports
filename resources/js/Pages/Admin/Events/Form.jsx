import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

const defaultValues = {
    name: '',
    banner_url: '',
    banner_file: null,
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
        event
            ? {
                  name: event.name ?? '',
                  banner_url: event.banner_url ?? '',
                  banner_file: null,
                  recurrence: event.recurrence ?? 'One-time',
                  starts_at: event.starts_at ?? '',
                  ends_at: event.ends_at ?? '',
                  registration_closed_at: event.registration_closed_at ?? null,
                  venue: {
                      name: event.venue?.name ?? '',
                      address: event.venue?.address ?? '',
                      city: event.venue?.city ?? '',
                      google_maps_url: event.venue?.google_maps_url ?? '',
                  },
              }
            : defaultValues,
    );

    // Banner UI state
    const [bannerMode, setBannerMode] = useState(() =>
        event?.banner_url ? 'url' : 'url',
    );
    const [filePreview, setFilePreview] = useState(null);
    const fileInputRef = useRef(null);

    const setVenueField = (field, value) => {
        setData('venue', {
            ...data.venue,
            [field]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] ?? null;
        setData('banner_file', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setFilePreview(ev.target.result);
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    const clearFile = () => {
        setData('banner_file', null);
        setFilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const submit = (e) => {
        e.preventDefault();

        // Remove banner_file if we're in URL mode (don't send the file)
        // Remove banner_url if we're in file mode (file takes precedence, handled in controller)
        const opts = { forceFormData: true };

        if (isEditing) {
            // Spoof PUT request using POST because PHP doesn't natively parse multipart/form-data on PUT
            post(route('admin.events.update', event.id) + '?_method=PUT', opts);
            return;
        }

        post(route('admin.events.store'), opts);
    };

    // Decide which preview to show
    const bannerPreview =
        bannerMode === 'file' && filePreview
            ? filePreview
            : bannerMode === 'url' && data.banner_url
              ? data.banner_url
              : null;

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? 'Edit Event' : 'Create Event'} />

            {/* Main Canvas */}
            <div className="pt-8 pb-16 px-6 max-w-lg md:max-w-7xl mx-auto">
                {/* Header Section — Mobile */}
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

                {/* Header Section — Desktop */}
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
                                    <label className="block text-[color:var(--primary)] font-bold font-headline text-sm ml-1 mb-2 md:text-xs md:font-bold md:uppercase md:tracking-widest md:text-[color:var(--on-surface-variant)] md:mb-2 md:ml-0">
                                        Sport Name
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full bg-[color:var(--surface-container-highest)] border-none rounded-lg px-4 py-4 md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary)] transition-all md:p-4 text-[color:var(--on-surface)] placeholder:text-[color:var(--outline)]/50 font-medium"
                                            placeholder="e.g. Competitive Padel"
                                        />
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--outline)]/50 group-focus-within:text-[color:var(--primary)]">sports_tennis</span>
                                    </div>
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-[color:var(--primary)] font-bold font-headline text-sm ml-1 mb-2 md:text-xs md:font-bold md:uppercase md:tracking-widest md:text-[color:var(--on-surface-variant)] md:mb-2 md:ml-0">
                                        Frequency
                                    </label>
                                    <select
                                        value={data.recurrence}
                                        onChange={(e) => setData('recurrence', e.target.value)}
                                        className="w-full bg-[color:var(--surface-container-highest)] border-none rounded-lg px-4 py-4 md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary)] transition-all md:p-4 text-[color:var(--on-surface)] font-medium appearance-none"
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

                        {/* Banner Upload Card */}
                        <div className="bg-[color:var(--surface-container-lowest)] p-6 md:p-8 rounded-lg border border-[color:var(--outline-variant)]/10 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 bg-[color:var(--primary-container)] rounded-full"></div>
                                <h2 className="font-headline font-bold text-xl text-[color:var(--primary)]">Event Banner</h2>
                            </div>

                            {/* Mode Toggle */}
                            <div className="flex gap-2 mb-5 p-1 bg-[color:var(--surface-container-highest)] rounded-lg w-fit">
                                <button
                                    type="button"
                                    onClick={() => setBannerMode('url')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
                                        bannerMode === 'url'
                                            ? 'bg-[color:var(--primary)] text-[color:var(--on-primary)] shadow-sm'
                                            : 'text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface)]'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">link</span>
                                    URL
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setBannerMode('file')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
                                        bannerMode === 'file'
                                            ? 'bg-[color:var(--primary)] text-[color:var(--on-primary)] shadow-sm'
                                            : 'text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface)]'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">upload</span>
                                    Upload
                                </button>
                            </div>

                            {/* URL Input */}
                            {bannerMode === 'url' && (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[color:var(--on-surface-variant)] mb-2">
                                        Image URL
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="url"
                                            value={data.banner_url}
                                            onChange={(e) => setData('banner_url', e.target.value)}
                                            className="w-full bg-[color:var(--surface-container-highest)] border-none rounded-lg px-4 py-4 pr-12 focus:ring-2 focus:ring-[color:var(--primary)] transition-all text-[color:var(--on-surface)] font-medium text-sm placeholder:text-[color:var(--outline)]/50"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--outline)]/50 group-focus-within:text-[color:var(--primary)] text-lg">
                                            image
                                        </span>
                                    </div>
                                    <InputError message={errors.banner_url} className="mt-2" />
                                    <p className="text-[11px] text-[color:var(--on-surface-variant)]/70 mt-2">
                                        Paste a direct link to any publicly accessible image (JPG, PNG, WebP).
                                    </p>
                                </div>
                            )}

                            {/* File Upload */}
                            {bannerMode === 'file' && (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[color:var(--on-surface-variant)] mb-2">
                                        Upload from Device
                                    </label>
                                    <div
                                        className="relative border-2 border-dashed border-[color:var(--outline-variant)]/40 rounded-xl p-6 text-center cursor-pointer hover:border-[color:var(--primary)]/50 hover:bg-[color:var(--primary)]/5 transition-all group"
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            const file = e.dataTransfer.files?.[0];
                                            if (file) {
                                                setData('banner_file', file);
                                                const reader = new FileReader();
                                                reader.onload = (ev) => setFilePreview(ev.target.result);
                                                reader.readAsDataURL(file);
                                                if (fileInputRef.current) fileInputRef.current.files = e.dataTransfer.files;
                                            }
                                        }}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        {data.banner_file ? (
                                            <div className="flex items-center gap-3 justify-center">
                                                <span className="material-symbols-outlined text-[color:var(--primary)] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                    check_circle
                                                </span>
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-[color:var(--on-surface)]">{data.banner_file.name}</p>
                                                    <p className="text-[11px] text-[color:var(--on-surface-variant)]">
                                                        {(data.banner_file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); clearFile(); }}
                                                    className="ml-auto p-1 rounded-full hover:bg-[color:var(--surface-container-high)] text-[color:var(--on-surface-variant)] transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-4xl text-[color:var(--outline)]/50 group-hover:text-[color:var(--primary)] transition-colors mb-2">
                                                    cloud_upload
                                                </span>
                                                <p className="text-sm font-semibold text-[color:var(--on-surface-variant)]">
                                                    Drop image here or <span className="text-[color:var(--primary)] font-bold underline underline-offset-2">browse</span>
                                                </p>
                                                <p className="text-[11px] text-[color:var(--on-surface-variant)]/60 mt-1">
                                                    JPG, PNG, WebP · Max 5 MB
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <InputError message={errors.banner_file} className="mt-2" />
                                </div>
                            )}

                            {/* Live Preview */}
                            {bannerPreview && (
                                <div className="mt-5 relative rounded-xl overflow-hidden h-40 bg-[color:var(--surface-container-high)] group">
                                    <img
                                        src={bannerPreview}
                                        alt="Banner preview"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-[color:var(--primary)] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                        Preview
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Precision Timing Card */}
                        <div className="bg-[color:var(--surface-container-lowest)] p-6 md:p-8 rounded-lg border border-[color:var(--outline-variant)]/10 shadow-sm relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-6 md:mb-8">
                                <div className="w-1 h-6 bg-[color:var(--primary)] rounded-full"></div>
                                <h2 className="font-headline font-bold text-xl text-[color:var(--primary)]">Precision Timing</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:gap-6 relative z-10">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-[color:var(--primary)] font-bold font-headline text-sm ml-1 mb-2 md:text-xs md:font-bold md:uppercase md:tracking-widest md:text-[color:var(--on-surface-variant)] md:mb-2 md:ml-0">
                                        Start Time
                                    </label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--outline)] text-lg md:block hidden">schedule</span>
                                        <input
                                            type="datetime-local"
                                            value={data.starts_at}
                                            onChange={(e) => setData('starts_at', e.target.value)}
                                            className="w-full bg-[color:var(--surface-container-highest)] border-none rounded-lg px-4 py-4 md:pl-12 md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary)] transition-all md:p-4 text-[color:var(--on-surface)] font-medium"
                                        />
                                    </div>
                                    <InputError message={errors.starts_at} className="mt-2" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-[color:var(--primary)] font-bold font-headline text-sm ml-1 mb-2 md:text-xs md:font-bold md:uppercase md:tracking-widest md:text-[color:var(--on-surface-variant)] md:mb-2 md:ml-0">
                                        End Time
                                    </label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--outline)] text-lg md:block hidden">timer_off</span>
                                        <input
                                            type="datetime-local"
                                            value={data.ends_at ?? ''}
                                            onChange={(e) => setData('ends_at', e.target.value)}
                                            className="w-full bg-[color:var(--surface-container-highest)] border-none rounded-lg px-4 py-4 md:pl-12 md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary)] transition-all md:p-4 text-[color:var(--on-surface)] font-medium"
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
                                    <label className="block text-[color:var(--primary)] font-bold font-headline text-sm ml-1 mb-2 md:text-xs md:font-bold md:uppercase md:tracking-widest md:text-[color:var(--on-surface-variant)] md:mb-2 md:ml-0">
                                        Venue Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={data.venue.name}
                                            onChange={(e) => setVenueField('name', e.target.value)}
                                            className="w-full bg-[color:var(--surface-container-highest)] border-none rounded-lg px-4 py-4 md:bg-white md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary)] transition-all md:p-4 text-[color:var(--on-surface)] font-medium placeholder:text-[color:var(--outline)]/50"
                                            placeholder="Olympia National Stadium"
                                        />
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--outline)]/50 text-lg md:block hidden">location_on</span>
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--outline)]/50 md:hidden block">location_on</span>
                                    </div>
                                    <InputError message={errors['venue.name']} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[color:var(--primary)] font-bold font-headline text-sm ml-1 mb-2 md:text-xs md:font-bold md:uppercase md:tracking-widest md:text-[color:var(--on-surface-variant)] md:mb-2 md:ml-0">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            value={data.venue.city}
                                            onChange={(e) => setVenueField('city', e.target.value)}
                                            className="w-full bg-[color:var(--surface-container-highest)] border-none rounded-lg px-4 py-4 md:bg-white md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary)] transition-all md:p-4 text-[color:var(--on-surface)] font-medium placeholder:text-[color:var(--outline)]/50"
                                            placeholder="City"
                                        />
                                        <InputError message={errors['venue.city']} className="mt-2" />
                                    </div>
                                    <div>
                                        <label className="block text-[color:var(--primary)] font-bold font-headline text-sm ml-1 mb-2 md:text-xs md:font-bold md:uppercase md:tracking-widest md:text-[color:var(--on-surface-variant)] md:mb-2 md:ml-0">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            value={data.venue.address}
                                            onChange={(e) => setVenueField('address', e.target.value)}
                                            className="w-full bg-[color:var(--surface-container-highest)] border-none rounded-lg px-4 py-4 md:bg-white md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary)] transition-all md:p-4 text-[color:var(--on-surface)] font-medium placeholder:text-[color:var(--outline)]/50"
                                            placeholder="Address"
                                        />
                                        <InputError message={errors['venue.address']} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[color:var(--primary)] font-bold font-headline text-sm ml-1 mb-2 md:text-xs md:font-bold md:uppercase md:tracking-widest md:text-[color:var(--on-surface-variant)] md:mb-2 md:ml-0">
                                        Google Maps URL
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            value={data.venue.google_maps_url ?? ''}
                                            onChange={(e) => setVenueField('google_maps_url', e.target.value)}
                                            className="w-full bg-[color:var(--surface-container-highest)] border-none rounded-lg px-4 py-4 md:bg-white md:rounded-lg focus:ring-2 focus:ring-[color:var(--primary)] transition-all md:p-4 text-[color:var(--on-surface)] font-medium text-sm placeholder:text-[color:var(--outline)]/50"
                                            placeholder="https://maps.google.com/..."
                                        />
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--outline)]/50 text-lg md:block hidden">map</span>
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--outline)]/50 md:hidden block">map</span>
                                    </div>
                                    <InputError message={errors['venue.google_maps_url']} className="mt-2" />
                                </div>

                                {/* Map Preview */}
                                <div className="mt-4 relative w-full h-32 md:h-48 rounded-xl overflow-hidden group border border-[color:var(--outline-variant)]/10 bg-[color:var(--surface-container-high)]">
                                    <img
                                        alt="Map Preview"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU5kGyg57l6DDr8NItKeeNqCfuLZi57yDQ-f_pNx8Uu2GDNz6sfyiDovWEXBfv9yX7JPadSOBplfJ02X8w0a2yKYfawYjNfMoNIhqXeGR5gEMWwLXSscXiFYk8EIq6iXkGnAyId3kqjNrJvn7Mn_pXj6RPl9aY4lQtqGS_B2d7tMVqitXZMwqdNCywsJGqOti2OII8Pl4wX1TDYDf417FNQd2avavuaHtvF3c27d0aNPjK3s3DIzeU8aMDhxDJpziYpzKKw14Vh-eN"
                                    />
                                    <div className="absolute inset-0 bg-[color:var(--primary)]/10 pointer-events-none md:hidden"></div>
                                    <div className="absolute inset-0 flex items-center justify-center md:items-end md:justify-start md:p-4">
                                        <div className="bg-[color:var(--primary)] text-[color:var(--on-primary)] md:bg-white md:text-[color:var(--primary)] px-4 py-2 text-xs font-bold font-label flex items-center gap-2 shadow-lg rounded-full">
                                            <span className="material-symbols-outlined text-[color:var(--on-primary)] md:text-[color:var(--primary)] text-sm">location_searching</span>
                                            <span className="tracking-tighter">PREVIEW LOCATION</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Hub */}
                        <div className="pt-4 md:pt-0">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-5 md:py-6 rounded-xl md:rounded bg-[color:var(--primary)] text-[color:var(--on-primary)] md:bg-gradient-to-br md:from-[#002f57] md:to-[#01457d] md:text-white font-headline font-bold md:text-lg text-lg shadow-xl shadow-[color:var(--primary-container)]/20 md:shadow-[color:var(--primary-container)]/20 flex items-center justify-center gap-3 md:gap-4 group transition-transform active:scale-[0.95] md:active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined md:hidden block" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
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
                                Cancel &amp; return to dashboard
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
