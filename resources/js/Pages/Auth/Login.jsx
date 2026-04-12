import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="font-['Manrope',sans-serif] text-[color:var(--on-background)] flex min-h-screen items-stretch overflow-hidden bg-[color:var(--surface)]">
            <Head title="Log In" />

            {/* Left Side: Visual/Bold (hidden on mobile, visible lg) */}
            <div className="relative hidden items-center justify-center bg-slate-950 lg:flex lg:w-[58.333333%]">
                <div className="absolute inset-0 z-0 opacity-80">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary-container)_100%)]"></div>
                    {/* Abstract motion shapes / glow effects */}
                    <div className="absolute -left-[10%] top-[10%] h-[30rem] w-[30rem] rounded-full bg-[color:rgba(107,254,156,0.15)] blur-[100px]" />
                    <div className="absolute -bottom-[10%] -right-[10%] h-[40rem] w-[40rem] rounded-full bg-[color:rgba(255,255,255,0.08)] blur-[100px]" />
                    {/* Subtle graphic for motion */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)' }}></div>
                </div>
                
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent to-[color:var(--surface)]"></div>
                
                {/* Branding Overlay */}
                <div className="relative z-20 max-w-2xl px-12 xl:px-20">
                    <span className="mb-6 inline-block rounded-full bg-[color:var(--secondary-container)] px-4 py-1 font-['Lexend',sans-serif] text-sm font-bold uppercase tracking-[0.2em] text-[color:var(--on-secondary-container)]">
                        Precision Momentum
                    </span>
                    <h1 className="mb-6 font-['Lexend',sans-serif] text-6xl font-extrabold leading-tight tracking-tighter text-white xl:text-7xl">
                        Redefining the <br />
                        <span className="text-[color:var(--secondary-fixed)]">Athletic Edge.</span>
                    </h1>
                    <p className="max-w-lg text-xl text-blue-100/80">
                        The global standard for professional sports management and performance tracking.
                    </p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <main className="relative flex w-full items-center justify-center p-8 bg-[color:var(--surface)] lg:w-[41.666667%] lg:p-16 xl:p-24 overflow-y-auto">
                
                {/* Floating Top Nav */}
                <div className="absolute left-8 lg:left-12 xl:left-24 top-8 lg:top-12 flex w-full max-w-[calc(100%-4rem)] items-center justify-between lg:max-w-none">
                    <div className="font-['Lexend',sans-serif] text-2xl font-bold tracking-tight text-[color:var(--primary)]">
                        JR Sports
                    </div>
                    <div className="lg:hidden text-sm font-bold text-[color:var(--primary)] hover:underline flex items-center gap-1 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /></svg>
                        Support
                    </div>
                </div>

                <div className="w-full max-w-sm space-y-8 mt-16 lg:mt-0 xl:max-w-md pb-16 lg:pb-0">
                    {/* Header */}
                    <div className="space-y-2">
                        <h2 className="font-['Lexend',sans-serif] text-4xl font-extrabold text-[color:var(--on-surface)] lg:text-5xl">Log In</h2>
                        <p className="font-medium text-[color:var(--on-surface-variant)] text-[15px] lg:text-lg">
                            Access your athletic performance dashboard.
                        </p>
                    </div>

                    {status && (
                        <div className="rounded-lg bg-green-50 p-4 text-sm font-medium text-green-800">
                            {status}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-5">
                            {/* Email */}
                            <div className="relative">
                                <label htmlFor="email" className="mb-2 block text-[13px] lg:text-sm font-semibold text-[color:var(--on-surface-variant)]">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    placeholder="name@organization.com"
                                    className="w-full rounded-lg border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-highest)] px-4 py-3.5 lg:py-4 text-[color:var(--on-surface)] transition-all placeholder:text-[color:var(--outline)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-sm lg:text-base"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <div className="mb-2 flex items-center justify-between">
                                    <label htmlFor="password" className="block text-[13px] lg:text-sm font-semibold text-[color:var(--on-surface-variant)]">
                                        Password
                                    </label>
                                    <div className="hidden lg:block">
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-[13px] font-bold text-[color:var(--primary)] hover:underline transition-all"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        placeholder="••••••••"
                                        className="w-full rounded-lg border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-highest)] px-4 py-3.5 lg:py-4 pr-12 text-[color:var(--on-surface)] transition-all placeholder:text-[color:var(--outline)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] font-mono text-base lg:text-lg tracking-[0.2em] placeholder:tracking-[0.2em]"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--outline-variant)] hover:text-[color:var(--on-surface-variant)] transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.011 3.75c4.984 0 9.199 3.226 10.688 7.697a1.5 1.5 0 0 1 0 1.106c-1.49 4.471-5.705 7.697-10.688 7.697-4.984 0-9.2-3.226-10.688-7.697a1.5 1.5 0 0 1 0-1.106ZM12.011 18c4.015 0 7.57-2.617 8.95-6.529C19.58 7.56 16.026 4.943 12.01 4.943c-4.015 0-7.57 2.617-8.95 6.529C4.441 15.383 7.996 18 12.011 18Z" clipRule="evenodd" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" /><path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" /><path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" /></svg>
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 lg:hidden">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-[color:var(--outline-variant)] text-[color:var(--primary)] shadow-sm focus:ring-[color:var(--primary)] h-4 w-4 bg-transparent"
                                />
                                <span className="ms-2 text-sm text-[color:var(--on-surface-variant)]">
                                    Remember me
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-bold text-[color:var(--primary)] hover:underline transition-all"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-full lg:rounded-lg bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary-container)_100%)] py-3.5 lg:py-4 font-['Lexend',sans-serif] text-base lg:text-lg font-bold text-white shadow-lg transition-all hover:shadow-[0_8px_16px_-4px_rgba(0,64,161,0.4)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            Sign In
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[color:var(--outline-variant)] opacity-50"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-[color:var(--surface)] px-4 text-xs font-bold uppercase tracking-widest text-[color:var(--outline)]">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Google Auth Button */}
                    <button
                        type="button"
                        className="flex w-full items-center justify-center gap-3 rounded-full lg:rounded-2xl border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-lowest)] py-3 px-4 font-semibold text-[color:var(--on-surface)] shadow-sm hover:bg-[color:var(--surface-container-low)] hover:border-transparent transition-all active:scale-[0.98]"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>

                    <p className="text-center text-[color:var(--on-surface-variant)] text-[14px] lg:text-[15px] pt-2 lg:pt-0">
                        Don't have an account?{' '}
                        <Link href={route('register')} className="font-bold text-[color:var(--primary)] hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>

                {/* Footer Links */}
                <div className="absolute bottom-6 w-full max-w-[calc(100%-4rem)] lg:max-w-md mx-auto left-0 right-0 flex flex-col items-center justify-center gap-3 text-xs lg:text-[13px] text-[color:var(--outline)] lg:flex-row lg:justify-between px-8 lg:px-0">
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-[color:var(--on-surface-variant)] transition-all">Privacy Policy</Link>
                        <Link href="#" className="hover:text-[color:var(--on-surface-variant)] transition-all">Terms of Service</Link>
                    </div>
                    <div className="text-center mt-1 lg:mt-0 xl:text-left">
                        © 2026 JR Sports. Precision Momentum.
                    </div>
                </div>

                {/* Desktop Support Link (Bottom Right) */}
                <div className="hidden lg:flex absolute bottom-8 right-8 xl:right-12 items-center gap-1.5 text-sm font-bold text-[color:var(--primary)] cursor-pointer hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /></svg>
                    Support
                </div>
            </main>
        </div>
    );
}
