import Link from 'next/link';
import { Metadata } from 'next';
import { Calendar, Sparkles, ArrowRight, Trophy, Clock, Archive, NewspaperIcon } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Crossword Archives | NYT & Mini Puzzles',
    description: 'Browse historical crossword puzzles from New York Times and NYT Mini - archives dating back to 1977.',
};

export default function ArchivePage() {
    const archiveSources = [
        {
            title: 'NYT Crossword Archive',
            description: 'Browse over 45 years of New York Times daily crosswords from 1977 to present',
            icon: NewspaperIcon,
            gradient: 'from-blue-500 to-indigo-600',
            bgGradient: 'from-blue-50 to-indigo-50',
            href: '/daily/nyt-crossword-answers',
            badge: '45+ Years',
            badgeColor: 'bg-blue-500',
            stats: [
                { label: 'Since', value: '1977' },
                { label: 'Puzzles', value: '17K+' },
            ]
        },
        {
            title: 'NYT Mini Archive',
            description: 'Quick mini crossword puzzles - perfect for a 5-minute brain exercise',
            icon: Sparkles,
            gradient: 'from-orange-500 to-amber-500',
            bgGradient: 'from-orange-50 to-amber-50',
            href: '/daily/nyt-mini-crossword-answers',
            badge: 'Quick Play',
            badgeColor: 'bg-orange-500',
            stats: [
                { label: 'Daily', value: '5 min' },
                { label: 'Grid', value: '5×5' },
            ]
        },
    ];

    return (
        <div className="min-h-screen py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-5xl">

                    {/* Header */}
                    <div className="mb-12 text-center animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 text-sm font-medium">
                            <Archive className="w-4 h-4" />
                            Crossword Archives
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 md:text-5xl mb-4">
                            Browse <span className="text-gradient">Historical</span> Puzzles
                        </h1>
                        <p className="text-lg text-gray-600 mb-4">
                            Access decades of crossword puzzles from the New York Times
                        </p>
                    </div>

                    {/* Archive Sources Grid */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-16">
                        {archiveSources.map((source, index) => {
                            const Icon = source.icon;
                            return (
                                <Link
                                    href={source.href}
                                    key={index}
                                    className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up border border-gray-100"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Badge */}
                                    <div className={`absolute top-4 right-4 ${source.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10`}>
                                        {source.badge}
                                    </div>

                                    {/* Colored header section */}
                                    <div className={`relative p-8 bg-gradient-to-br ${source.bgGradient}`}>
                                        {/* Decorative circles */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                                        {/* Icon */}
                                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${source.gradient} flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                            <Icon className="h-10 w-10" />
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-2">{source.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{source.description}</p>
                                    </div>

                                    {/* Stats section */}
                                    <div className="grid grid-cols-2 divide-x divide-gray-100 bg-gray-50">
                                        {source.stats.map((stat, statIndex) => (
                                            <div key={statIndex} className="p-4 text-center">
                                                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                                <div className="text-sm text-gray-500">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between p-5 bg-white border-t border-gray-100">
                                        <span className="text-sm font-medium text-gray-600">Browse archive</span>
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${source.gradient} text-white group-hover:scale-110 transition-transform shadow-md`}>
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Quick Links */}
                    <div className="card-glass rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Quick <span className="text-gradient">Access</span>
                            </h2>
                            <p className="text-gray-600">
                                Jump straight to today's puzzles
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link
                                href="/nyt-crossword-answer-today"
                                className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                            >
                                <NewspaperIcon className="w-5 h-5" />
                                Today's NYT Crossword
                            </Link>
                            <Link
                                href="/nyt-mini-answer-today"
                                className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                            >
                                <Sparkles className="w-5 h-5" />
                                Today's NYT Mini
                            </Link>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm">
                            <Trophy className="w-10 h-10 mx-auto mb-3 text-amber-500" />
                            <h3 className="font-bold text-gray-900 mb-1">45+ Years</h3>
                            <p className="text-sm text-gray-600">Of NYT crossword history</p>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm">
                            <Calendar className="w-10 h-10 mx-auto mb-3 text-blue-500" />
                            <h3 className="font-bold text-gray-900 mb-1">Updated Daily</h3>
                            <p className="text-sm text-gray-600">Fresh puzzles every day</p>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm">
                            <Clock className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
                            <h3 className="font-bold text-gray-900 mb-1">5 AM IST</h3>
                            <p className="text-sm text-gray-600">Daily update time</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
