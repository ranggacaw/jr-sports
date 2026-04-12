import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none ${
                active
                    ? 'bg-[color:rgba(0,64,161,0.08)] text-[color:var(--primary)]'
                    : 'text-[color:var(--on-surface-variant)] hover:bg-white/60 hover:text-[color:var(--primary)]'
            } ${className}`}
        >
            {children}
        </Link>
    );
}
