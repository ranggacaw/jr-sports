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
        <AuthenticatedLayout
            header={
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                    <div className="pl-2 sm:pl-6 lg:pl-10">
                        <p className="editorial-kicker">Admin workflow</p>
                        <h2 className="mt-4 text-4xl font-extrabold leading-tight text-[color:var(--on-surface)] sm:text-5xl">
                            {isEditing ? 'Refine event details.' : 'Configure a new event.'}
                        </h2>
                        <p className="mt-4 max-w-2xl text-base leading-8 text-[color:var(--on-surface-variant)]">
                            Set the schedule, recurrence, venue details, and location links without breaking the registration flow.
                        </p>
                    </div>

                    <div className="surface-panel">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                            Navigation
                        </p>
                        <h3 className="mt-3 text-2xl font-bold text-[color:var(--primary)]">
                            Return to the event board
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-[color:var(--on-surface-variant)]">
                            Jump back to the full admin listing if you need to review registrations or switch to another event.
                        </p>
                        <div className="mt-5">
                            <Link
                                href={route('admin.events.index')}
                                className="button-secondary"
                            >
                                Back to events
                            </Link>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={isEditing ? 'Edit Event' : 'Create Event'} />

            <div className="mx-auto max-w-5xl pb-6">
                <form onSubmit={submit} className="surface-panel space-y-8 ghost-stroke">
                    {event?.registration_closed_at && (
                        <div className="feedback-error">
                            Registration is already closed for this event.
                        </div>
                    )}

                    <section className="surface-subtle space-y-6">
                        <div>
                            <p className="editorial-kicker">Primary details</p>
                            <h3 className="mt-2 text-2xl font-bold text-[color:var(--primary)]">
                                Event identity
                            </h3>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <InputLabel htmlFor="name" value="Event name" />
                                <TextInput
                                    id="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="recurrence" value="Recurrence" />
                                <select
                                    id="recurrence"
                                    value={data.recurrence}
                                    onChange={(e) => setData('recurrence', e.target.value)}
                                    className="field-input mt-1 block w-full"
                                >
                                    <option value="One-time">One-time</option>
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                </select>
                                <InputError message={errors.recurrence} className="mt-2" />
                            </div>
                        </div>
                    </section>

                    <section className="surface-subtle space-y-6">
                        <div>
                            <p className="editorial-kicker">Time and logistics</p>
                            <h3 className="mt-2 text-2xl font-bold text-[color:var(--primary)]">
                                Schedule window
                            </h3>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="starts_at" value="Start date and time" />
                                <TextInput
                                    id="starts_at"
                                    type="datetime-local"
                                    value={data.starts_at}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('starts_at', e.target.value)}
                                />
                                <InputError message={errors.starts_at} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="ends_at" value="End date and time" />
                                <TextInput
                                    id="ends_at"
                                    type="datetime-local"
                                    value={data.ends_at ?? ''}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('ends_at', e.target.value)}
                                />
                                <InputError message={errors.ends_at} className="mt-2" />
                            </div>
                        </div>
                    </section>

                    <section className="surface-subtle space-y-6">
                        <div>
                            <p className="editorial-kicker">Venue details</p>
                            <h3 className="mt-2 text-2xl font-bold text-[color:var(--primary)]">
                                Location setup
                            </h3>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="venue_name" value="Venue name" />
                                <TextInput
                                    id="venue_name"
                                    value={data.venue.name}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setVenueField('name', e.target.value)
                                    }
                                />
                                <InputError message={errors['venue.name']} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="venue_city" value="City" />
                                <TextInput
                                    id="venue_city"
                                    value={data.venue.city}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setVenueField('city', e.target.value)
                                    }
                                />
                                <InputError message={errors['venue.city']} className="mt-2" />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel htmlFor="venue_address" value="Address" />
                                <TextInput
                                    id="venue_address"
                                    value={data.venue.address}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setVenueField('address', e.target.value)
                                    }
                                />
                                <InputError message={errors['venue.address']} className="mt-2" />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel htmlFor="maps" value="Google Maps link" />
                                <TextInput
                                    id="maps"
                                    type="url"
                                    value={data.venue.google_maps_url ?? ''}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setVenueField('google_maps_url', e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors['venue.google_maps_url']}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <Link href={route('admin.events.index')} className="button-secondary">
                            Cancel
                        </Link>
                        <PrimaryButton disabled={processing}>
                            {isEditing ? 'Save changes' : 'Create event'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
