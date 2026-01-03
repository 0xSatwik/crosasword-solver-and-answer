import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CalendarIcon, ArrowLeftIcon, Sparkles, Clock, Zap } from 'lucide-react';
import { fetchMiniByDate, formatMiniDate } from '../../../lib/nytMiniApi';

// Force dynamic rendering to handle specific route params
export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        date: string;
    };
}

// Helper to parse various date formats and return a canonical structure
function parseDateParam(param: string): { year: number; month: number; day: number; isValid: boolean } {
    try {
        // Case 1: Month-Day-Year (e.g., january-01-2026 or january-1-2026)
        const monthNames = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ];

        // Split by hyphen
        const parts = param.toLowerCase().split('-');

        if (parts.length === 3) {
            const potentialMonth = parts[0];
            const potentialDay = parseInt(parts[1], 10);
            const potentialYear = parseInt(parts[2], 10);

            const monthIndex = monthNames.indexOf(potentialMonth);
            if (monthIndex !== -1 && !isNaN(potentialDay) && !isNaN(potentialYear)) {
                return {
                    year: potentialYear,
                    month: monthIndex + 1,
                    day: potentialDay,
                    isValid: true
                };
            }
        }

        // Case 2: YYYY-MM-DD format
        const yyyyMmDdRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
        const yyyyMmDdMatch = param.match(yyyyMmDdRegex);

        if (yyyyMmDdMatch) {
            return {
                year: parseInt(yyyyMmDdMatch[1], 10),
                month: parseInt(yyyyMmDdMatch[2], 10),
                day: parseInt(yyyyMmDdMatch[3], 10),
                isValid: true
            };
        }

        return { year: 0, month: 0, day: 0, isValid: false };
    } catch {
        return { year: 0, month: 0, day: 0, isValid: false };
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const parsed = parseDateParam(params.date);
    if (parsed.isValid) {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const dateStr = `${monthNames[parsed.month - 1]} ${parsed.day}, ${parsed.year}`;
        return {
            title: `NYT Mini Crossword Answer for ${dateStr}`,
            description: `Get the NYT Mini crossword puzzle answers for ${dateStr} - all clues and solutions.`,
        };
    }
    return {
        title: 'NYT Mini Crossword Answer',
        description: 'Solution for the New York Times Mini crossword puzzle.',
    };
}

export default async function MiniCrosswordAnswerPage({ params }: PageProps) {
    const { date } = params;
    const parsed = parseDateParam(date);

    if (!parsed.isValid) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex flex-col items-center justify-center p-4">
                <Sparkles className="w-16 h-16 mb-4 text-orange-400" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Date Format</h1>
                <p className="text-gray-600 mb-6">Please use the format: month-dd-yyyy (e.g., january-01-2026)</p>
                <Link href="/daily/nyt-mini-crossword-answers" className="text-orange-600 hover:text-orange-800 underline">
                    Go to Mini Archive
                </Link>
            </div>
        );
    }

    const { year, month, day } = parsed;

    // Construct canonical slug: [full-month-lowercase]-[dd]-[yyyy]
    const monthNamesLower = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const monthName = monthNamesLower[month - 1];
    const paddedDay = day.toString().padStart(2, '0');
    const canonicalSlug = `${monthName}-${paddedDay}-${year}`;

    // If current param doesn't match canonical, redirect
    if (date !== canonicalSlug) {
        redirect(`/nyt-mini-crossword-answer-for-${canonicalSlug}`);
    }

    // Fetch Data
    const apiDate = `${year}-${month.toString().padStart(2, '0')}-${paddedDay}`;
    const result = await fetchMiniByDate(apiDate);

    if (!result || !result.success) {
        const { formatted: displayDate } = formatMiniDate(apiDate);
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex flex-col items-center justify-center p-4">
                <Sparkles className="w-16 h-16 mb-4 text-orange-400" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Puzzle Not Found</h1>
                <p className="text-gray-600 mb-6">We couldn't find a mini puzzle for {displayDate}.</p>
                <Link
                    href="/daily/nyt-mini-crossword-answers"
                    className="inline-flex items-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
                >
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back to Mini Archive
                </Link>
            </div>
        );
    }

    const { formatted: displayDate, dayOfWeek } = formatMiniDate(result.date);

    // Convert data to arrays for easier rendering
    const acrossClues = Object.entries(result.data.across).map(([num, clue]) => ({
        number: num,
        clue: (clue as { clue: string; answer: string }).clue,
        answer: (clue as { clue: string; answer: string }).answer
    })).sort((a, b) => parseInt(a.number) - parseInt(b.number));

    const downClues = Object.entries(result.data.down).map(([num, clue]) => ({
        number: num,
        clue: (clue as { clue: string; answer: string }).clue,
        answer: (clue as { clue: string; answer: string }).answer
    })).sort((a, b) => parseInt(a.number) - parseInt(b.number));

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white py-12">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl">
                    {/* Back link */}
                    <div className="mb-6">
                        <Link
                            href="/daily/nyt-mini-crossword-answers"
                            className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors"
                        >
                            <ArrowLeftIcon className="mr-1 h-4 w-4" />
                            Back to Mini Archive
                        </Link>
                    </div>

                    {/* Hero Header */}
                    <div className="relative mb-10 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 md:p-12 text-white shadow-2xl overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/20 text-white/90 text-sm font-medium backdrop-blur-sm">
                                <Sparkles className="w-4 h-4" />
                                NYT Mini Crossword
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                Mini Puzzle Solution
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-white/90">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5" />
                                    <span className="font-medium">{displayDate}</span>
                                </div>
                                {dayOfWeek && (
                                    <div className="flex items-center gap-2">
                                        <span>•</span>
                                        <span>{dayOfWeek}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    <span>~5 min</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    <span>5×5</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clues Grid */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-10">
                        {/* Across Clues */}
                        <div className="rounded-2xl bg-white shadow-xl border border-orange-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm">→</span>
                                    Across
                                </h2>
                            </div>
                            <div className="p-4 space-y-3">
                                {acrossClues.map((clue, idx) => (
                                    <div
                                        key={`across-${idx}`}
                                        className="group rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 p-4 hover:from-orange-100 hover:to-amber-100 transition-colors border border-orange-100"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
                                                {clue.number}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-800 mb-2">{clue.clue}</p>
                                                <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-mono font-bold text-sm shadow-md">
                                                    {clue.answer}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Down Clues */}
                        <div className="rounded-2xl bg-white shadow-xl border border-amber-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm">↓</span>
                                    Down
                                </h2>
                            </div>
                            <div className="p-4 space-y-3">
                                {downClues.map((clue, idx) => (
                                    <div
                                        key={`down-${idx}`}
                                        className="group rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 p-4 hover:from-amber-100 hover:to-yellow-100 transition-colors border border-amber-100"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
                                                {clue.number}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-800 mb-2">{clue.clue}</p>
                                                <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-mono font-bold text-sm shadow-md">
                                                    {clue.answer}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="card-glass rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                            <CalendarIcon className="w-4 h-4" />
                            Browse Archive
                        </Link>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>Data from NYT Mini Archive</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
