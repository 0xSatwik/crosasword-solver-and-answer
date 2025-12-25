import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { href: '/daily', label: 'Daily Solutions' },
        { href: '/solver', label: 'Solver Tool' },
        { href: '/nyt-crosswords', label: 'Play Crossword' },
        { href: '/guides', label: 'Guides & Tips' },
    ];

    const publications = [
        { href: '/daily/nyt-daily/latest', label: 'NYT Crossword' },
        { href: '/nyt-crosswords/random', label: 'Random NYT Puzzle' },
        { href: '/daily/usa-today/latest', label: 'USA Today' },
        { href: '/daily/la-times/latest', label: 'LA Times' },
    ];

    const legalLinks = [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
        { href: '/contact', label: 'Contact Us' },
    ];

    return (
        <footer className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-gray-300">
            {/* Decorative gradient line at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="container relative mx-auto px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Brand Section */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="inline-block group">
                            <div className="flex items-center gap-3 mb-4">
                                {/* Logo icon */}
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                                    <svg
                                        className="w-7 h-7 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold">
                                    <span className="text-blue-400">Crossword</span>
                                    <span className="text-amber-400">Central</span>
                                </span>
                            </div>
                        </Link>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Your one-stop destination for daily crossword solutions, powerful solving tools, and expert guides.
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-3">
                            {['twitter', 'facebook', 'instagram'].map((social) => (
                                <a
                                    key={social}
                                    href={`#${social}`}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-glow"
                                    aria-label={social}
                                >
                                    <span className="text-sm font-bold uppercase">{social[0]}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Publications */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                            Publications
                        </h3>
                        <ul className="space-y-3">
                            {publications.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal & Contact */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-gradient-to-r from-pink-500 to-amber-500 rounded-full" />
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            {legalLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Contact info */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <a
                                href="mailto:contact@crosswordcentral.com"
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">contact@crosswordcentral.com</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm text-center sm:text-left">
                            © {currentYear} Crossword Central. All rights reserved.
                        </p>
                        <p className="text-gray-600 text-xs">
                            Made with <span className="text-red-400">♥</span> for crossword enthusiasts
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
