import { Metadata } from 'next';
import Link from 'next/link';
import {
    CalendarIcon,
    Sparkles,
    ArrowLeftIcon,
    ArchiveIcon,
    Clock,
    Zap
} from 'lucide-react';
import { fetchMiniToday, formatMiniDate } from '../../lib/nytMiniApi';

export const metadata: Metadata = {
    title: "NYT Mini Crossword Answer Today | Daily Solutions & Hints",
    description: "Get today's New York Times Mini crossword puzzle answers. Complete solutions for all 5x5 Across and Down clues, updated daily.",
    keywords: ["NYT Mini Crossword Answer Today", "Today's Mini Crossword Solution", "NYT Mini Answers", "Daily Mini Crossword"],
};

export default async function NytMiniTodayPage() {
    const data = await fetchMiniToday();

    if (!data || !data.success) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-orange-400" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Puzzle Not Available</h1>
                    <p className="text-gray-600 mb-6">Today's mini puzzle isn't available yet. Please check back later.</p>
                    <Link
                        href="/daily"
                        className="inline-flex items-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
                    >
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Back to Daily
                    </Link>
                </div>
            </div>
        );
    }

    const { formatted: displayDate, dayOfWeek } = formatMiniDate(data.date);

    // Convert data to arrays for easier rendering
    const acrossClues = Object.entries(data.data.across).map(([num, clue]) => ({
        number: num,
        clue: (clue as { clue: string; answer: string }).clue,
        answer: (clue as { clue: string; answer: string }).answer
    })).sort((a, b) => parseInt(a.number) - parseInt(b.number));

    const downClues = Object.entries(data.data.down).map(([num, clue]) => ({
        number: num,
        clue: (clue as { clue: string; answer: string }).clue,
        answer: (clue as { clue: string; answer: string }).answer
    })).sort((a, b) => parseInt(a.number) - parseInt(b.number));

    // Schema Data
    const appUrl = "https://crossword-solver.io";
    const personName = "NYT Mini Constructor";

    // FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What is the NYT Mini Crossword answer today (${displayDate})?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The answers for the New York Times Mini crossword today, ${displayDate}, are listed below. We provide solutions for all 5x5 clues.`
                }
            },
            {
                "@type": "Question",
                "name": "When does the next NYT Mini Crossword come out?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The New York Times Mini Crossword is available daily at 10 PM EST weekdays and 6 PM EST weekends."
                }
            }
        ]
    };

    // Article/NewsArticle Schema
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `NYT Mini Crossword Answer Today (${displayDate})`,
        "datePublished": data.date,
        "dateModified": data.date,
        "author": {
            "@type": "Person",
            "name": personName
        },
        "publisher": {
            "@type": "Organization",
            "name": "Crossword Solver",
            "logo": {
                "@type": "ImageObject",
                "url": `${appUrl}/logo.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${appUrl}/nyt-mini-answer-today`
        }
    };

    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${appUrl}/`
        }, {
            "@type": "ListItem",
            "position": 2,
            "name": "Daily Answers",
            "item": `${appUrl}/daily`
        }, {
            "@type": "ListItem",
            "position": 3,
            "name": "Mini Answer Today",
            "item": `${appUrl}/nyt-mini-answer-today`
        }]
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white py-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl">
                    {/* Back link */}
                    <div className="mb-6">
                        <Link
                            href="/daily"
                            className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors"
                        >
                            <ArrowLeftIcon className="mr-1 h-4 w-4" />
                            Back to Daily Puzzles
                        </Link>
                    </div>

                    {/* Hero Header */}
                    <div className="relative mb-10 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 md:p-12 text-white shadow-2xl overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                        <div className="absolute top-1/2 right-10 w-20 h-20 bg-white/5 rounded-full"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/20 text-white/90 text-sm font-medium backdrop-blur-sm">
                                <Sparkles className="w-4 h-4" />
                                NYT Mini Crossword
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                NYT Mini Crossword Answer Today ({displayDate})
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-white/90">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5" />
                                    <span className="font-medium">{displayDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    <span>~5 min solve time</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    <span>5×5 Grid</span>
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

                    {/* SEO Paragraph */}
                    <div className="mb-10 rounded-2xl bg-white p-6 shadow-lg border border-orange-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-3">Today's NYT Mini Crossword Answers - {displayDate}</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Need help with today's <strong>New York Times Mini Crossword</strong>? You've found the right place.
                            We provide the complete solutions for the NYT Mini released on {displayDate}.
                            Whether you're looking for a specific clue or the entire solved grid, our daily updated answers will help you finish the puzzle in record time.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="card-glass rounded-2xl p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <ArchiveIcon className="w-6 h-6 text-orange-500" />
                                <span className="text-gray-700 font-medium">Looking for older puzzles?</span>
                            </div>
                            <Link
                                href="/daily/nyt-mini-crossword-answers"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
                            >
                                <ArchiveIcon className="w-4 h-4" />
                                Browse Mini Archive
                            </Link>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>Updated daily • Data from NYT Mini Archive</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
