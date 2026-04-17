import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    if (links.length <= 3) return null; // Only prev, 1, next means single page

    return (
        <div className="flex flex-wrap items-center justify-center gap-1 px-4 py-3 sm:px-6">
            {links.map((link, key) => (
                <Link
                    key={key}
                    href={link.url || '#'}
                    className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors
                        ${!link.url ? 'cursor-not-allowed text-[color:var(--on-surface-variant)]/50' : ''}
                        ${
                            link.active
                                ? 'bg-[color:var(--primary)] text-white'
                                : 'text-[color:var(--on-surface)] hover:bg-[color:var(--surface-container)]'
                        }
                    `}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    preserveScroll
                />
            ))}
        </div>
    );
}
