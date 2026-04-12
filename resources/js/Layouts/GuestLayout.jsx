import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({
    children,
    title = 'Welcome back to JR Sports',
    description = 'Access internal sports events, track sign-ups, and keep your team moving.',
    eyebrow = 'JR Sports Access',
    asideEyebrow = 'Precision Momentum',
    asideTitle = 'Built for company leagues, event rhythm, and clean execution.',
    asideDescription = 'A sharper internal sports hub for joining sessions, managing registrations, and keeping participation visible across the organization.',
}) {
    return (
        <div className="min-h-screen bg-[color:var(--surface)]">
            <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
                <aside className="relative hidden overflow-hidden bg-[linear-gradient(145deg,var(--primary)_0%,var(--primary-container)_72%)] px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute left-[-10%] top-[12%] h-72 w-72 rounded-full bg-[color:rgba(107,254,156,0.38)] blur-3xl" />
                        <div className="absolute bottom-[-8%] right-[-8%] h-80 w-80 rounded-full bg-[color:rgba(255,255,255,0.14)] blur-3xl" />
                    </div>

                    <div className="relative z-10 flex items-center gap-3">
                        <ApplicationLogo className="h-12 w-12 text-white" />
                        <div>
                            <div className="font-['Lexend'] text-2xl font-bold tracking-tight">
                                JR Sports
                            </div>
                            <p className="text-sm text-blue-100/80">
                                Internal event hub
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 max-w-xl space-y-7">
                        <p className="inline-flex rounded-full bg-[color:rgba(107,254,156,0.18)] px-4 py-1.5 text-sm font-bold uppercase tracking-[0.24em] text-[color:var(--secondary-fixed)]">
                            {asideEyebrow}
                        </p>
                        <h2 className="text-5xl font-extrabold leading-[1.05] tracking-[-0.05em] xl:text-6xl">
                            {asideTitle}
                        </h2>
                        <p className="max-w-lg text-lg leading-8 text-blue-100/82">
                            {asideDescription}
                        </p>
                    </div>

                    <div className="relative z-10 max-w-sm rounded-[28px] bg-[color:rgba(225,226,236,0.16)] p-6 backdrop-blur-xl">
                        <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-100/70">
                            Active system
                        </p>
                        <div className="mt-3 flex items-end justify-between gap-4">
                            <div>
                                <p className="font-['Lexend'] text-4xl font-bold tracking-tight text-[color:var(--secondary-fixed)]">
                                    Editorial
                                </p>
                                <p className="mt-2 text-sm leading-6 text-blue-100/78">
                                    Velocity blue surfaces, strong hierarchy, and cleaner registration flow.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="relative flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
                    <Link href="/" className="absolute left-6 top-6 flex items-center gap-3 sm:left-10 sm:top-8 lg:left-14 xl:left-20">
                        <ApplicationLogo className="h-11 w-11 text-[color:var(--primary)]" />
                        <div>
                            <div className="font-['Lexend'] text-lg font-bold tracking-tight text-[color:var(--primary)]">
                                JR Sports
                            </div>
                            <div className="text-sm text-[color:var(--on-surface-variant)]">
                                Internal event hub
                            </div>
                        </div>
                    </Link>

                    <div className="w-full max-w-xl pt-16 lg:pt-10">
                        <div className="mb-8 max-w-lg space-y-3">
                            <p className="editorial-kicker">{eyebrow}</p>
                            <h1 className="text-4xl font-extrabold leading-tight text-[color:var(--on-surface)] sm:text-5xl">
                                {title}
                            </h1>
                            <p className="section-copy max-w-md">{description}</p>
                        </div>

                        <div className="surface-panel ghost-stroke">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
