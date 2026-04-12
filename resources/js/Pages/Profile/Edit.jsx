import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                    <div className="pl-2 sm:pl-6 lg:pl-10">
                        <p className="editorial-kicker">Account settings</p>
                        <h2 className="mt-4 text-4xl font-extrabold leading-tight text-[color:var(--on-surface)] sm:text-5xl">
                            Profile and security.
                        </h2>
                        <p className="mt-4 max-w-2xl text-base leading-8 text-[color:var(--on-surface-variant)]">
                            Update your identity details, change your password, and manage destructive account actions from one place.
                        </p>
                    </div>

                    <div className="surface-panel">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                            Profile status
                        </p>
                        <h3 className="mt-3 text-2xl font-bold text-[color:var(--primary)]">
                            Keep account details current
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-[color:var(--on-surface-variant)]">
                            Accurate identity and recovery details help keep admin access and event registrations reliable.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="space-y-6 pb-6">
                <div className="surface-panel">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="surface-panel">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="surface-panel">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
