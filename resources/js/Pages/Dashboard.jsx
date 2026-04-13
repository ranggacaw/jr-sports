import { usePage } from '@inertiajs/react';
import AdminDashboard from './AdminDashboard';
import EmployeeDashboard from './EmployeeDashboard';

export default function Dashboard({ registeredEvents }) {
    const { auth } = usePage().props;

    if (auth.user.is_admin) {
        return <AdminDashboard registeredEvents={registeredEvents} />;
    }

    return <EmployeeDashboard registeredEvents={registeredEvents} />;
}

