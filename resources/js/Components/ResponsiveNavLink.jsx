import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none ${
                active
                    ? 'bg-[color:rgba(0,64,161,0.08)] text-[color:var(--primary)]'
                    : 'text-[color:var(--on-surface-variant)] hover:bg-[color:var(--surface-container-low)] hover:text-[color:var(--primary)]'
            } ${className}`}
        >
            {children}
        </Link>
    );
}
