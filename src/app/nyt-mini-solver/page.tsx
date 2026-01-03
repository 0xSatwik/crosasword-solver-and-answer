'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowLeftIcon, Sparkles, Calendar, ArrowRight, X, Lightbulb } from 'lucide-react';
import { searchMiniClues, MiniClueMatch, formatMiniDate } from '../../lib/nytMiniApi';

export default function NytMiniSolverPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<MiniClueMatch[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) {
            setError('Please enter a clue to search');
            return;
        }

        setError('');
        setLoading(true);
        setHasSearched(true);

        try {
            const response = await searchMiniClues(query);
            if (response?.success && response.matches) {
                setResults(response.matches);
                if (response.matches.length === 0) {
                    setError('No matching clues found. Try different keywords.');
                }
            } else {
                setResults([]);
                setError('No matching clues found. Try different keywords.');
            }
        } catch (err) {
            setError('Failed to search. Please try again.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Format date for link
    const getDateLink = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        const monthNames = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ];
        const month = monthNames[date.getMonth()];
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `/nyt-mini-crossword-answer-for-${month}-${day}-${year}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white py-12">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl">
                    {/* Back link */}
                    <div className="mb-6">
                        <Link
                            href="/nyt-mini-answer-today"
                            className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors"
                        >
                            <ArrowLeftIcon className="mr-1 h-4 w-4" />
                            Back to Today's Mini
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            Clue Solver
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            NYT Mini <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Crossword Solver</span>
                        </h1>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            Search our archive of NYT Mini crossword clues to find answers. Enter any clue text and we'll find matching puzzles.
                        </p>
                    </div>

                    {/* Search Card */}
                    <div className="card-glass rounded-3xl p-6 md:p-8 shadow-2xl border border-orange-100 mb-8">
                        {/* Search Input */}
                        <div className="mb-6">
                            <label htmlFor="clue" className="mb-2 block text-sm font-semibold text-gray-700">
                                Enter Your Clue
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="clue"
                                    className="w-full px-5 py-4 pr-12 text-lg rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                                    placeholder="e.g., 'Capital city' or 'morning drink'"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                {query && (
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        onClick={() => setQuery('')}
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Search className="h-5 w-5" />
                                    SEARCH CLUES
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Results */}
                    {hasSearched && !loading && results.length > 0 && (
                        <div className="rounded-2xl bg-white shadow-xl border border-orange-100 overflow-hidden mb-8">
                            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Found {results.length} Match{results.length > 1 ? 'es' : ''}
                                </h2>
                            </div>
                            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                                {results.map((match, idx) => {
                                    const { formatted } = formatMiniDate(match.date);
                                    return (
                                        <Link
                                            key={idx}
                                            href={getDateLink(match.date)}
                                            className="block group rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 p-5 hover:from-orange-100 hover:to-amber-100 transition-all border border-orange-100 hover:shadow-md"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold">
                                                            {match.number}{match.direction === 'Across' ? 'A' : 'D'}
                                                        </span>
                                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatted}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-800 mb-3">{match.clue}</p>
                                                    <div className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-mono font-bold shadow-md">
                                                        {match.answer}
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-orange-500 group-hover:translate-x-1 transition-transform">
                                                    <ArrowRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Tips Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { icon: Lightbulb, title: 'Use Keywords', desc: 'Enter key words from the clue' },
                            { icon: Search, title: 'Be Specific', desc: 'More words give better results' },
                            { icon: Sparkles, title: 'Try Synonyms', desc: 'Different words may yield more matches' },
                        ].map((tip, index) => (
                            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-100 shadow-sm">
                                <tip.icon className="w-6 h-6 text-orange-500 mb-2" />
                                <h4 className="font-semibold text-gray-800 mb-1">{tip.title}</h4>
                                <p className="text-sm text-gray-600">{tip.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quick Links */}
                    <div className="mt-8 card-glass rounded-2xl p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/nyt-mini-answer-today"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
                            >
                                <Sparkles className="w-4 h-4" />
                                Today's Mini
                            </Link>
                            <Link
                                href="/daily/nyt-mini-crossword-answers"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-orange-300 text-orange-600 font-medium hover:bg-orange-50 transition-all"
                            >
                                <Calendar className="w-4 h-4" />
                                Browse Archive
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
