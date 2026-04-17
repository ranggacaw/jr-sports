import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const defaultValues = {
    name: '',
    email: '',
    division: '',
    is_admin: false,
    password: '',
    password_confirmation: '',
};

export default function Form({ user }) {
    const isEditing = Boolean(user);
    const { data, setData, post, put, processing, errors } = useForm(
        isEditing
            ? {
                  ...user,
                  division: user.division ?? '',
              }
            : defaultValues,
    );

    const submit = (event) => {
        event.preventDefault();

        if (isEditing) {
            put(route('admin.users.update', user.id));

            return;
        }

        post(route('admin.users.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? 'Edit User' : 'Create User'} />

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <section className="surface-panel p-6 sm:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="editorial-kicker">Admin Area</p>
                            <h1 className="mt-2 text-3xl font-black tracking-tight text-[color:var(--primary)]">
                                {isEditing ? 'Edit User' : 'Create User'}
                            </h1>
                            <p className="mt-3 text-sm leading-7 text-[color:var(--on-surface-variant)]">
                                Manage the user profile fields used by the sports-event admin team.
                            </p>
                        </div>

                        <Link href={route('admin.users.index')} className="text-sm font-semibold text-[color:var(--primary)]">
                            Back to users
                        </Link>
                    </div>

                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(event) => setData('name', event.target.value)}
                                required
                                isFocused
                                autoComplete="name"
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(event) => setData('email', event.target.value)}
                                required
                                autoComplete="username"
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div>
                            <InputLabel htmlFor="division" value="Division" />
                            <TextInput
                                id="division"
                                className="mt-1 block w-full"
                                value={data.division}
                                onChange={(event) => setData('division', event.target.value)}
                                autoComplete="organization-title"
                            />
                            <InputError className="mt-2" message={errors.division} />
                        </div>

                        <label className="flex items-start gap-3 rounded-3xl bg-[color:var(--surface-container-low)] px-4 py-4">
                            <input
                                type="checkbox"
                                checked={data.is_admin}
                                onChange={(event) => setData('is_admin', event.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-[color:var(--outline)] text-[color:var(--primary)] focus:ring-[color:var(--primary)]"
                            />
                            <span>
                                <span className="block font-semibold text-[color:var(--on-surface)]">
                                    Grant admin access
                                </span>
                                <span className="block text-sm text-[color:var(--on-surface-variant)]">
                                    Admins can manage events, tournaments, and user master data.
                                </span>
                            </span>
                        </label>
                        <InputError className="mt-2" message={errors.is_admin} />

                        {!isEditing && (
                            <>
                                <div>
                                    <InputLabel htmlFor="password" value="Initial Password" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.password}
                                        onChange={(event) => setData('password', event.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                    <InputError className="mt-2" message={errors.password} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.password_confirmation}
                                        onChange={(event) => setData('password_confirmation', event.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                    <InputError className="mt-2" message={errors.password_confirmation} />
                                </div>
                            </>
                        )}

                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing}>
                                {isEditing ? 'Save User' : 'Create User'}
                            </PrimaryButton>
                            <Link href={route('admin.users.index')} className="text-sm font-semibold text-[color:var(--on-surface-variant)]">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
