import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            asideEyebrow="Global Reach • 500+ Clubs"
            asideTitle={
                <>
                    Precision <br />
                    <span className="text-[color:var(--secondary-fixed)]">Momentum.</span>
                </>
            }
            asideDescription="Join the elite ecosystem for high-end sports management. Track performance, manage events, and accelerate your competitive edge."
            eyebrow="ProMomentum"
            title="Create Account"
            description="Start your journey with professional precision."
        >
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-1.5">
                    <label htmlFor="name" className="ml-1 block text-sm font-semibold text-[color:var(--on-surface-variant)] font-['Manrope']">
                        Full Name
                    </label>
                    <div className="relative">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={data.name}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            className="w-full bg-[color:rgba(225,226,236,0.3)] border-0 border-b-2 border-[color:var(--outline-variant)] focus:border-[color:var(--primary)] focus:ring-0 px-4 py-3.5 transition-all outline-none text-[color:var(--on-surface)]"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="email" className="ml-1 block text-sm font-semibold text-[color:var(--on-surface-variant)] font-['Manrope']">
                        Work Email
                    </label>
                    <div className="relative">
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder="name@company.com"
                            autoComplete="username"
                            className="w-full bg-[color:rgba(225,226,236,0.3)] border-0 border-b-2 border-[color:var(--outline-variant)] focus:border-[color:var(--primary)] focus:ring-0 px-4 py-3.5 transition-all outline-none text-[color:var(--on-surface)]"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="password" className="ml-1 block text-sm font-semibold text-[color:var(--on-surface-variant)] font-['Manrope']">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            className="w-full bg-[color:rgba(225,226,236,0.3)] border-0 border-b-2 border-[color:var(--outline-variant)] focus:border-[color:var(--primary)] focus:ring-0 px-4 py-3.5 transition-all outline-none text-[color:var(--on-surface)]"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="password_confirmation" className="ml-1 block text-sm font-semibold text-[color:var(--on-surface-variant)] font-['Manrope']">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            className="w-full bg-[color:rgba(225,226,236,0.3)] border-0 border-b-2 border-[color:var(--outline-variant)] focus:border-[color:var(--primary)] focus:ring-0 px-4 py-3.5 transition-all outline-none text-[color:var(--on-surface)]"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-[color:var(--primary)] text-[color:var(--on-primary)] font-['Lexend'] font-semibold py-4 rounded-full shadow-lg shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    Create Account
                </button>
            </form>

            <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[color:var(--outline-variant)] opacity-30"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-['Manrope'] font-semibold">
                    <span className="bg-[color:var(--surface-container-lowest)] px-4 text-[color:var(--on-surface-variant)]">
                        Or continue with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <button type="button" className="flex items-center justify-center gap-3 w-full bg-[color:var(--surface-container-lowest)] border border-[color:var(--outline-variant)]/50 text-[color:var(--on-surface)] font-['Manrope'] font-semibold py-3.5 rounded-full hover:bg-[color:var(--surface-container)] transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                    Sign up with Google
                </button>
            </div>

            <div className="mt-10 text-center">
                <p className="text-[color:var(--on-surface-variant)] text-sm">
                    Already have an account?{' '}
                    <Link href={route('login')} className="text-[color:var(--primary)] font-bold hover:underline decoration-2 underline-offset-4 transition-all ml-1">
                        Log in instead
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
