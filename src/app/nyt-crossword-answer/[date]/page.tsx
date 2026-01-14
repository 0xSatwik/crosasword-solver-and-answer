
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CalendarIcon, UserIcon, EditIcon, ArrowLeftIcon } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        date: string;
    };
}

// Helper to format date for display
function formatDisplayDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Fetch crossword data from API
async function fetchCrosswordData(date: string) {
    try {
        const response = await fetch(`https://crossword-archive-worker.mitomat.workers.dev/api/puzzle/${date}`, {
            next: { revalidate: 3600 }
        });
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Failed to fetch puzzle for ${date}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching puzzle for ${date}:`, error);
        return null;
    }
}

const monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
];

// Helper to parse various date formats
function parseDateParam(param: string): { year: number; month: number; day: number; isValid: boolean } {
    try {
        let year, month, day;

        // Case 1: DD-MM-YYYY (e.g., 02-01-2025)
        const ddMmYyyyMatch = param.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
        if (ddMmYyyyMatch) {
            day = parseInt(ddMmYyyyMatch[1], 10);
            month = parseInt(ddMmYyyyMatch[2], 10);
            year = parseInt(ddMmYyyyMatch[3], 10);
            return { year, month, day, isValid: true };
        }

        // Case 2: YYYY-MM-DD (e.g., 2025-01-02)
        const yyyyMmDdMatch = param.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (yyyyMmDdMatch) {
            year = parseInt(yyyyMmDdMatch[1], 10);
            month = parseInt(yyyyMmDdMatch[2], 10);
            day = parseInt(yyyyMmDdMatch[3], 10);
            return { year, month, day, isValid: true };
        }

        // Case 3: Month-Day-Year (e.g., january-02-2025)
        const parts = param.toLowerCase().split('-');
        if (parts.length === 3) {
            const monthIndex = monthNames.indexOf(parts[0]);
            const potentialDay = parseInt(parts[1], 10);
            const potentialYear = parseInt(parts[2], 10);
            if (monthIndex !== -1 && !isNaN(potentialDay) && !isNaN(potentialYear)) {
                return { year: potentialYear, month: monthIndex + 1, day: potentialDay, isValid: true };
            }
        }
        return { year: 0, month: 0, day: 0, isValid: false };
    } catch (e) {
        return { year: 0, month: 0, day: 0, isValid: false };
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const parsed = parseDateParam(params.date);
    if (!parsed.isValid) {
        return { title: 'NYT Crossword Answer' };
    }
    const { year, month, day } = parsed;
    const monthName = monthNames[month - 1];
    const formattedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    // Format: Crossword Answer for [Month] [Day], [Year]
    const title = `Crossword Answer for ${formattedMonthName} ${day}, ${year}`;
    const description = `Find the solution for the New York Times crossword puzzle on ${formattedMonthName} ${day}, ${year}. Complete answers for Across and Down clues.`;

    return {
        title,
        description,
        keywords: [
            `NYT crossword answer for ${formattedMonthName} ${day} ${year}`,
            `New York Times crossword solution ${year}`,
            `NYT crossword answer today`,
            `crossword answer for ${params.date}`
        ],
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        }
    };
}

export default async function CrosswordAnswerPage({ params }: PageProps) {
    const { date } = params;
    const parsed = parseDateParam(date);

    if (!parsed.isValid) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold text-red-600">Invalid Date Format</h1>
                <p className="mt-4">Please use the format: month-dd-yyyy (e.g., january-02-2025)</p>
                <Link href="/daily/nyt-crossword-answers" className="text-blue-600 underline mt-4 block">
                    Go to Archive
                </Link>
            </div>
        );
    }

    const { year, month, day } = parsed;
    const monthName = monthNames[month - 1];
    const formattedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    const paddedDay = day.toString().padStart(2, '0');
    const canonicalSlug = `${monthName}-${paddedDay}-${year}`;

    // Redirect to canonical format if needed
    if (date !== canonicalSlug) {
        redirect(`/nyt-crossword-answer-for-${canonicalSlug}`);
    }

    // Fetch Data
    const apiDate = `${year}-${month.toString().padStart(2, '0')}-${paddedDay}`;
    const result = await fetchCrosswordData(apiDate);

    if (!result || !result.success || !result.data) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Puzzle Not Found</h1>
                <p className="text-gray-600 mb-6">We couldn't find a puzzle for {formatDisplayDate(apiDate)}.</p>
                <Link href="/daily/nyt-crossword-answers" className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Archive
                </Link>
            </div>
        );
    }

    const puzzleData = result.data;
    const { puzzle, across, down } = puzzleData;

    // Schema Data
    const personName = puzzle.author || "NYT Crossword Constructor";
    const appUrl = "https://crossword-solver.io"; // Assuming base URL, replace if known otherwise default to relative handled by browser usually but absolute preferred for Schema

    // FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What is the NYT Crossword answer for ${formattedMonthName} ${day}, ${year}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The New York Times crossword puzzle for ${formattedMonthName} ${day}, ${year} is created by ${puzzle.author} and edited by ${puzzle.editor}. You can find all the across and down solutions on this page.`
                }
            },
            {
                "@type": "Question",
                "name": "Where can I find today's NYT crossword answers?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can find daily solutions for the New York Times crossword puzzle here on our website, updated daily."
                }
            }
        ]
    };

    // Article/NewsArticle Schema
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article", // Using tailored specific type if possible, usually Article or NewsArticle
        "headline": `Crossword Answer for ${formattedMonthName} ${day}, ${year}`,
        "datePublished": apiDate,
        "dateModified": apiDate,
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
            "@id": `${appUrl}/nyt-crossword-answer-for-${canonicalSlug}`
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
            "item": `${appUrl}/daily/nyt-crossword-answers`
        }, {
            "@type": "ListItem",
            "position": 3,
            "name": `Answer for ${formattedMonthName} ${day}, ${year}`,
            "item": `${appUrl}/nyt-crossword-answer-for-${canonicalSlug}`
        }]
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
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
                <div className="mx-auto max-w-5xl">
                    <div className="mb-6 flex items-center justify-between">
                        {/* Breadcrumbs visual if needed, currently just back link */}
                        <Link href="/daily/nyt-crossword-answers" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                            <ArrowLeftIcon className="mr-1 h-4 w-4" /> Back to Archive
                        </Link>
                    </div>

                    <div className="mb-8 rounded-xl bg-white p-6 shadow-xl">
                        <div className="text-center">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">New York Times by {puzzle.author}</span>

                            {/* H1 Update */}
                            <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                                Crossword Answer for {formattedMonthName} {day}, {year}
                            </h1>

                            <div className="mt-2 flex items-center justify-center text-gray-600">
                                <CalendarIcon className="mr-2 h-5 w-5" />
                                <span className="font-medium">{formatDisplayDate(puzzle.date)}</span>
                                <span className="mx-2">•</span>
                                <span>{puzzle.day_of_week}</span>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 md:grid-cols-2">
                            {/* Reduced duplication, just showing info */}
                            <div className="flex items-start space-x-3"><UserIcon className="h-5 w-5 text-blue-600" /><div><h3 className="text-sm font-medium text-gray-700">Author</h3><p className="text-gray-900">{puzzle.author}</p></div></div>
                            <div className="flex items-start space-x-3"><EditIcon className="h-5 w-5 text-blue-600" /><div><h3 className="text-sm font-medium text-gray-700">Editor</h3><p className="text-gray-900">{puzzle.editor}</p></div></div>
                        </div>
                    </div>

                    {/* SEO Paragraph */}
                    <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
                        <h2 className="mb-3 text-xl font-semibold text-gray-900">
                            NYT Crossword Answers for {formattedMonthName} {day}, {year}
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Welcome to the comprehensive solutions page for the <strong>New York Times Crossword puzzle released on {formattedMonthName} {day}, {year}</strong>.
                            Searching for the correct answers for the specific clues to complete your grid? We have listed every single Across and Down clue and its correct solution below.
                            Whether you are stuck on a tricky pun or a piece of trivia, our daily updated archive helps you solve the puzzle and keep your streak alive.
                        </p>
                    </div>

                    {/* Removed 'Play This Puzzle' button as requested */}

                    <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="rounded-lg bg-blue-50 p-4 shadow-inner">
                            {/* H2 Correctly */}
                            <h2 className="mb-4 border-b border-blue-200 pb-2 text-xl font-semibold text-blue-900">Across Clues & Answers</h2>
                            <div className="space-y-3">
                                {across.map((clue: any, idx: number) => (
                                    <div key={`across-${idx}`} className="rounded-md bg-white p-3 shadow-sm"><div className="flex items-start"><span className="mr-2 rounded-full bg-blue-100 px-2 py-0.5 text-sm font-semibold text-blue-800">{clue.number}</span><div className="flex-1"><span className="text-gray-800">{clue.clue_text}</span><div className="mt-2 flex justify-end"><span className="rounded-md bg-blue-100 px-2 py-1 font-mono font-bold text-blue-800">{clue.answer || "N/A"}</span></div></div></div></div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-lg bg-green-50 p-4 shadow-inner">
                            {/* H2 Correctly */}
                            <h2 className="mb-4 border-b border-green-200 pb-2 text-xl font-semibold text-green-900">Down Clues & Answers</h2>
                            <div className="space-y-3">
                                {down.map((clue: any, idx: number) => (
                                    <div key={`down-${idx}`} className="rounded-md bg-white p-3 shadow-sm"><div className="flex items-start"><span className="mr-2 rounded-full bg-green-100 px-2 py-0.5 text-sm font-semibold text-green-800">{clue.number}</span><div className="flex-1"><span className="text-gray-800">{clue.clue_text}</span><div className="mt-2 flex justify-end"><span className="rounded-md bg-green-100 px-2 py-1 font-mono font-bold text-green-800">{clue.answer || "N/A"}</span></div></div></div></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* FAQs Section */}
                    <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">Who created the crossword for {formattedMonthName} {day}, {year}?</h3>
                                <p className="text-gray-600">The puzzle was created by {puzzle.author || 'the NYT team'} and edited by {puzzle.editor || 'Will Shortz'}.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">When is the NYT Crossword published?</h3>
                                <p className="text-gray-600">The New York Times Crossword is published daily online at 10:00 PM EST (weekdays) and 6:00 PM EST (weekends) for the following day's puzzle.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-500"><p>Data sourced from the Crossword Archive API.</p></div>
                </div>
            </div>
        </div>
    );
}
