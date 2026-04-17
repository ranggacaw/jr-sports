import { useState, useRef, useEffect } from 'react';

export default function SearchablePlayerSelect({ 
    value, 
    onChange, 
    registrations, 
    placeholder = "Select player..." 
}) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const filtered = query === '' 
        ? (registrations || [])
        : (registrations || []).filter((r) => 
            (r.name || '').toLowerCase().includes(query.toLowerCase()) || 
            (r.email || '').toLowerCase().includes(query.toLowerCase())
        );

    const selectedPlayer = (registrations || []).find(r => r.id === value);

    const handleSelect = (id) => {
        onChange(id);
        setIsOpen(false);
        setQuery('');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                setQuery('');
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={containerRef}>
            <div 
                className="block w-full rounded-xl border border-outline-variant/40 bg-white px-3 py-2 text-sm font-semibold text-on-surface shadow-sm cursor-text"
                onClick={() => setIsOpen(true)}
            >
                {isOpen ? (
                    <input 
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent outline-none p-0 border-none ring-0 placeholder:text-on-surface-variant font-medium focus:ring-0 focus:border-transparent"
                        placeholder="Search player..."
                    />
                ) : (
                    <div className={`truncate ${!selectedPlayer ? 'text-on-surface-variant font-normal' : ''}`}>
                        {selectedPlayer ? `${selectedPlayer.name} (${selectedPlayer.email})` : placeholder}
                    </div>
                )}
            </div>
            
            {isOpen && (
                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-xl bg-white text-sm shadow-lg ring-1 ring-black/5 py-1">
                    {filtered.length === 0 ? (
                        <li className="px-3 py-2 text-on-surface-variant">No players found</li>
                    ) : (
                        filtered.map(r => (
                            <li 
                                key={r.id}
                                onMouseDown={(e) => { e.preventDefault(); handleSelect(r.id); }}
                                className={`cursor-pointer px-3 py-2 hover:bg-primary/10 ${r.id === value ? 'bg-primary/5 font-bold text-primary' : 'text-on-surface'}`}
                            >
                                <div className="truncate">{r.name}</div>
                                <div className="truncate text-xs text-on-surface-variant opacity-70">{r.email}</div>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}
