'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, X, Plus, Minus, Calendar, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { FormattedClueHistoryItem } from '../../lib/crosswordArchiveApi';
import { MiniClueMatch, formatMiniDate } from '../../lib/nytMiniApi';
import { solveCrosswordClue, SolverAnswer } from '../../lib/crosswordSolverApi';

export default function SolverClient() {
    const [clue, setClue] = useState('');
    const [selectedLength, setSelectedLength] = useState<number | null>(null);
    const [letterBoxes, setLetterBoxes] = useState<string[]>([]);
    const [results, setResults] = useState<SolverAnswer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAll, setShowAll] = useState(false);
    const [clueHistory, setClueHistory] = useState<FormattedClueHistoryItem[]>([]);
    const [miniHistory, setMiniHistory] = useState<MiniClueMatch[]>([]);
    const [usingFallback, setUsingFallback] = useState(false);
    const [solverSource, setSolverSource] = useState<'internal' | 'crosswordnexus' | 'datamuse'>('internal');

    const clueInputRef = useRef<HTMLInputElement>(null);

    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Crossword Solver",
        "url": "https://crossword-solver.io/solver",
        "description": "A free online tool to search and solve crossword clues using various databases.",
        "applicationCategory": "GameApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    useEffect(() => {
        if (selectedLength) {
            setLetterBoxes(Array(selectedLength).fill(''));
        } else {
            setLetterBoxes([]);
        }
    }, [selectedLength]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                clueInputRef.current &&
                !clueInputRef.current.contains(e.target as Node)
            ) {
                // Reserved for future UI polish.
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLetterChange = (index: number, value: string) => {
        const newLetterBoxes = [...letterBoxes];
        newLetterBoxes[index] = value.toLowerCase();
        setLetterBoxes(newLetterBoxes);
    };

    const getPatternFromLetters = () => {
        return letterBoxes.map(letter => letter || '?').join('');
    };

    const getTopRatedResults = (items: SolverAnswer[], usesStarRatings: boolean) => {
        if (items.length === 0) return [];

        if (!usesStarRatings) {
            return [items[0]];
        }

        const maxRating = Math.max(...items.map(item => item.rating || Math.floor(item.score / 100)));
        return items.filter(item => (item.rating || Math.floor(item.score / 100)) === maxRating);
    };

    const searchCrossword = async () => {
        if (!clue.trim()) {
            setError('Please enter a clue');
            return;
        }

        setError('');
        setLoading(true);
        setResults([]);
        setClueHistory([]);
        setMiniHistory([]);
        setUsingFallback(false);
        setSolverSource('internal');

        try {
            const pattern = selectedLength && !showAll ? getPatternFromLetters() : '';
            const response = await solveCrosswordClue(clue, pattern);

            if (!response.success) {
                throw new Error(response.error || 'Unable to fetch solver results');
            }

            setResults(response.answers || []);
            setClueHistory(response.history?.daily || []);
            setMiniHistory(response.history?.mini || []);
            setUsingFallback(response.used_fallback);
            setSolverSource(response.source || 'internal');

            if (!response.answers || response.answers.length === 0) {
                setError('No matching words found. Try a different clue or letter pattern.');
            }
        } catch (searchError) {
            console.error('Error fetching solver results:', searchError);
            setError('Error fetching results: ' + (searchError instanceof Error ? searchError.message : 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const incrementLength = () => {
        if (selectedLength === null) {
            setSelectedLength(1);
        } else if (selectedLength < 15) {
            setSelectedLength(selectedLength + 1);
        }
        setShowAll(false);
    };

    const decrementLength = () => {
        if (selectedLength && selectedLength > 1) {
            setSelectedLength(selectedLength - 1);
        }
        setShowAll(false);
    };

    const lengthOptions = [2, 3, 4, 5, 6, 7, 8, 9, '10+'];

    const groupResultsByLength = () => {
        const grouped: { [key: number]: SolverAnswer[] } = {};

        results.forEach(result => {
            const length = result.word.length;
            if (!grouped[length]) {
                grouped[length] = [];
            }
            grouped[length].push(result);
        });

        return grouped;
    };

    const groupedResults = groupResultsByLength();
    const usesStarRatings = solverSource !== 'datamuse';
    const topResults = getTopRatedResults(results, usesStarRatings);

    return (
        <div className="min-h-screen py-8 md:py-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
            />
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        Crossword <span className="text-gradient">Solver</span>
                    </h1>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Enter your clue and any known letters to find the perfect answer for your crossword puzzle.
                    </p>
                </div>

                <div className="mx-auto max-w-2xl">
                    <div className="card-glass p-6 md:p-8 rounded-3xl border border-white/50 shadow-2xl">
                        <div className="mb-6">
                            <label htmlFor="clue" className="mb-2 block text-sm font-semibold text-gray-700">
                                Enter Your Clue
                            </label>
                            <div className="relative">
                                <input
                                    ref={clueInputRef}
                                    type="text"
                                    id="clue"
                                    className="input-premium pr-12 text-lg"
                                    placeholder="e.g., 'Capital of France' or 'River in Egypt'"
                                    value={clue}
                                    onChange={(e) => setClue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            searchCrossword();
                                        }
                                    }}
                                />
                                {clue && (
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        onClick={() => {
                                            setClue('');
                                        }}
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <button
                                className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${showAll ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => {
                                    setShowAll(!showAll);
                                    if (!showAll) {
                                        setSelectedLength(null);
                                        setLetterBoxes([]);
                                    }
                                }}
                            >
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${showAll ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
                                    }`}>
                                    {showAll && <span className="text-xs">✓</span>}
                                </div>
                                Show all word lengths
                            </button>
                        </div>

                        {!showAll && (
                            <div className="mb-6">
                                {selectedLength ? (
                                    <div>
                                        <label className="mb-3 block text-sm font-semibold text-gray-700">
                                            Enter Known Letters (? for unknown)
                                        </label>
                                        <div className="flex items-center gap-2 justify-center flex-wrap">
                                            <button
                                                className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                                onClick={decrementLength}
                                            >
                                                <Minus className="h-5 w-5" />
                                            </button>

                                            {letterBoxes.map((letter, index) => (
                                                <div key={index} className="text-center">
                                                    <div className="text-xs text-gray-400 mb-1 font-medium">{index + 1}</div>
                                                    <input
                                                        type="text"
                                                        maxLength={1}
                                                        className="h-12 w-12 border-2 border-gray-200 rounded-xl text-center text-lg font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all uppercase"
                                                        value={letter}
                                                        onChange={(e) => handleLetterChange(index, e.target.value)}
                                                        placeholder="?"
                                                    />
                                                </div>
                                            ))}

                                            <button
                                                className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                                onClick={incrementLength}
                                            >
                                                <Plus className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="mb-3 block text-sm font-semibold text-gray-700">
                                            Select Word Length
                                        </label>
                                        <div className="flex rounded-2xl overflow-hidden border-2 border-gray-200 bg-white">
                                            {lengthOptions.map((length, index) => (
                                                <button
                                                    key={length}
                                                    className={`py-3 flex-1 text-center font-medium transition-all ${index < lengthOptions.length - 1 ? 'border-r border-gray-200' : ''
                                                        } hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600`}
                                                    onClick={() => {
                                                        if (length === '10+') {
                                                            setSelectedLength(10);
                                                        } else {
                                                            setSelectedLength(length as number);
                                                        }
                                                    }}
                                                >
                                                    {length}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mb-6">
                            <button
                                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3"
                                onClick={searchCrossword}
                            >
                                <Search className="h-5 w-5" />
                                SOLVE THE CLUE
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>

                        {usingFallback && results.length > 0 && (
                            <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-4 text-amber-700 text-sm flex items-center gap-2">
                                <Lightbulb className="w-5 h-5" />
                                {solverSource === 'crosswordnexus'
                                    ? 'Using CrosswordNexus fallback results for this clue'
                                    : 'Using alternative word-association fallback results'}
                            </div>
                        )}

                        {error && (
                            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {loading && (
                            <div className="my-8 flex flex-col items-center justify-center gap-3">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                                <span className="text-gray-600 font-medium">Searching for answers...</span>
                            </div>
                        )}

                        {!loading && clueHistory.length > 0 && (
                            <div className="mb-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        Historical Data
                                    </h2>
                                    <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium">
                                        NYT Crossword
                                    </span>
                                </div>

                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {clueHistory.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-xl border border-blue-100 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="mb-2 sm:mb-0">
                                                <div className="text-xl font-bold text-blue-800">{item.answer}</div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {item.formatted_date}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-xs bg-gray-100 px-2 py-1 rounded-full font-medium">
                                                    {item.number != null ? `${item.number}${item.direction === 'across' ? 'A' : 'D'}` : 'Archive'}
                                                </div>
                                                <div className="text-sm font-medium text-gray-700">{item.title}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!loading && miniHistory.length > 0 && (
                            <div className="mb-6 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-orange-900 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        Historical Data
                                    </h2>
                                    <span className="text-xs text-orange-600 bg-orange-100 px-3 py-1 rounded-full font-medium">
                                        NYT Mini
                                    </span>
                                </div>

                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {miniHistory.map((item, index) => {
                                        const { formatted } = formatMiniDate(item.date);
                                        return (
                                            <div
                                                key={index}
                                                className="bg-white rounded-xl border border-orange-100 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="mb-2 sm:mb-0">
                                                    <div className="text-xl font-bold text-orange-700">{item.answer}</div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatted}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-xs bg-orange-100 px-2 py-1 rounded-full font-medium text-orange-700">
                                                        {item.number}{item.direction === 'Across' ? 'A' : 'D'}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-700">{item.clue}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {!loading && results.length > 0 && (
                            <div className="rounded-2xl border border-gray-200 bg-white p-5">
                                <h2 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                    Possible Answers
                                </h2>

                                {topResults.length > 0 && (
                                    <div className="mb-6">
                                        <div className="text-sm text-gray-500 mb-2 font-medium">
                                            {topResults.length > 1 ? 'Best Matches' : 'Best Match'}
                                        </div>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {topResults.map((result, index) => (
                                                <div key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4 text-center shadow-sm">
                                                    <span className="text-2xl font-bold text-amber-700 tracking-wide">{result.word}</span>
                                                    <div className="text-sm text-gray-500 mt-2">
                                                        {usesStarRatings ? (
                                                            <div className="flex justify-center">
                                                                {Array(result.rating || Math.max(1, Math.floor(result.score / 100)))
                                                                    .fill(0)
                                                                    .map((_, i) => (
                                                                        <span key={i} className="text-yellow-500 text-lg">★</span>
                                                                    ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">Score: {result.score}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {Object.keys(groupedResults)
                                        .map(Number)
                                        .sort((a, b) => b - a)
                                        .map(length => (
                                            <div key={length} className="border-t pt-4">
                                                <h3 className="text-md font-semibold text-gray-800 mb-3">
                                                    {length}-Letter Words ({groupedResults[length].length})
                                                </h3>
                                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                    {groupedResults[length].map((result, index) => (
                                                        <div
                                                            key={index}
                                                            className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer"
                                                        >
                                                            <span className="font-semibold text-gray-800">{result.word}</span>
                                                            {usesStarRatings && (
                                                                <div className="flex justify-center mt-1">
                                                                    {Array(result.rating || Math.max(1, Math.floor(result.score / 100)))
                                                                        .fill(0)
                                                                        .map((_, i) => (
                                                                            <span key={i} className="text-yellow-500 text-sm">★</span>
                                                                        ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { title: 'Use Wildcards', desc: 'Enter ? for unknown letters to narrow results' },
                            { title: 'Be Specific', desc: 'Include the full clue text for better accuracy' },
                            { title: 'Try Variations', desc: 'Different phrasings may yield different results' },
                        ].map((tip, index) => (
                            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
                                <h4 className="font-semibold text-gray-800 mb-1">{tip.title}</h4>
                                <p className="text-sm text-gray-600">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
