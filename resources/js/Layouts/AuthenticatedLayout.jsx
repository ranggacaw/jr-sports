import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen pb-12 text-[color:var(--on-surface)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[360px] bg-[radial-gradient(circle_at_top_left,rgba(218,226,255,0.95),transparent_34%),radial-gradient(circle_at_top_right,rgba(107,254,156,0.16),transparent_22%)]" />

            <div className="page-wrap pt-4 sm:pt-6">
                <nav className="app-glass rounded-[28px] px-4 py-3 sm:px-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-3">
                                <ApplicationLogo className="h-11 w-11 text-[color:var(--primary)]" />
                                <div>
                                    <div className="font-['Lexend'] text-lg font-bold tracking-tight text-[color:var(--primary)]">
                                        JR Sports
                                    </div>
                                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)]">
                                        Event hub
                                    </div>
                                </div>
                            </Link>

                            <div className="hidden items-center gap-2 sm:flex">
                                <NavLink
                                    href={route('events.index')}
                                    active={route().current('events.index')}
                                >
                                    Events
                                </NavLink>
                                {user && (
                                    <NavLink
                                        href={route('dashboard')}
                                        active={route().current('dashboard')}
                                    >
                                        Dashboard
                                    </NavLink>
                                )}
                                {user && user.is_admin && (
                                    <NavLink
                                        href={route('admin.events.index')}
                                        active={route().current('admin.events.*')}
                                    >
                                        Admin
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:gap-3">
                            {user ? (
                                <>
                            <div className="hidden rounded-full bg-white/55 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--on-surface-variant)] lg:inline-flex">
                                {user.is_admin ? 'Admin access' : 'Registered user'}
                            </div>

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[color:var(--on-surface)] transition hover:bg-white focus:outline-none"
                                    >
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--primary)] font-['Lexend'] text-sm font-bold text-white">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="text-left">
                                            <span className="block">{user.name}</span>
                                            <span className="block text-xs font-medium text-[color:var(--on-surface-variant)]">
                                                {user.email}
                                            </span>
                                        </span>
                                        <svg
                                            className="h-4 w-4 text-[color:var(--on-surface-variant)]"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Profile settings
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        Log out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')} className="button-secondary px-4 py-2 text-sm">
                                        Log in
                                    </Link>
                                    <Link href={route('register')} className="button-primary px-4 py-2 text-sm">
                                        Create account
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-full bg-white/70 p-3 text-[color:var(--primary)] transition hover:bg-white focus:outline-none"
                            >
                                <svg
                                    className="h-5 w-5"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </nav>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="surface-panel mt-4 space-y-3 px-4 py-4">
                        <ResponsiveNavLink
                            href={route('events.index')}
                            active={route().current('events.index')}
                        >
                            Events
                        </ResponsiveNavLink>
                        {user && (
                            <ResponsiveNavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                            >
                                Dashboard
                            </ResponsiveNavLink>
                        )}
                        {user && user.is_admin && (
                            <ResponsiveNavLink
                                href={route('admin.events.index')}
                                active={route().current('admin.events.*')}
                            >
                                Admin
                            </ResponsiveNavLink>
                        )}

                        {user ? (
                            <>
                                <div className="surface-subtle mt-4 space-y-1">
                            <div className="text-sm font-semibold text-[color:var(--on-surface)]">
                                {user.name}
                            </div>
                            <div className="text-sm text-[color:var(--on-surface-variant)]">
                                {user.email}
                            </div>
                        </div>

                        <ResponsiveNavLink href={route('profile.edit')}>
                            Profile settings
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            method="post"
                            href={route('logout')}
                            as="button"
                        >
                            Log out
                                </ResponsiveNavLink>
                            </>
                        ) : (
                            <div className="mt-4 border-t border-[color:var(--surface-dim)] pt-4">
                                <ResponsiveNavLink href={route('login')}>
                                    Log in
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('register')}>
                                    Create account
                                </ResponsiveNavLink>
                            </div>
                        )}
                    </div>
                </div>

                {flash.success && (
                    <div className="feedback-success mt-4">{flash.success}</div>
                )}

                {header && <header className="mt-8">{header}</header>}

                <main className="mt-8">{children}</main>
            </div>
        </div>
    );
}
