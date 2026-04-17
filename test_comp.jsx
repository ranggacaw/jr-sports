function AddUserToRosterForm({ eventId, availableUsers }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (!data.user_id) return;
        post(route('admin.events.registrations.store', eventId), {
            preserveScroll: true,
            onSuccess: () => setData('user_id', ''),
        });
    };

    return (
        <form onSubmit={submit} className="mb-6 rounded-3xl border border-surface-container-high bg-surface p-6 shadow-sm flex items-end gap-4">
            <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Roster Management</p>
                <h3 className="mt-1 text-lg font-black text-on-surface mb-3">Add Player to Event</h3>
                <SearchablePlayerSelect
                    value={data.user_id}
                    onChange={(id) => setData('user_id', id)}
                    registrations={availableUsers}
                    placeholder="Search users to add..."
                />
                {errors.user_id && <p className="mt-2 text-sm font-semibold text-error">{errors.user_id}</p>}
            </div>
            <button
                type="submit"
                disabled={processing || !data.user_id}
                className="rounded-xl bg-tertiary px-6 py-3 text-sm font-bold text-on-primary disabled:cursor-not-allowed disabled:opacity-60 h-[42px] flex items-center"
            >
                {processing ? 'Adding...' : 'Add Player'}
            </button>
        </form>
    );
}
