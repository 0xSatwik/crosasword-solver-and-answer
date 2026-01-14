import { Metadata } from 'next';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import {
  CalendarIcon,
  UserIcon,
  EditIcon,
  ArrowLeftIcon,
  ArchiveIcon
} from 'lucide-react';

// Fetch crossword data by reading the static today.json file from the filesystem
async function fetchLatestCrossword() {
  try {
    // In a server component, we can read the file directly. This is more reliable.
    const filePath = path.join(process.cwd(), 'public', 'today.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    // Basic validation to ensure the file is not empty or malformed
    if (!data?.puzzle?.date) {
      console.error("Fetched today.json is invalid or empty.");
      return null;
    }

    // Get today's date in YYYY-MM-DD format for comparison
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return {
      data: data,
      // A flag to indicate if the puzzle data is for a day other than today
      isStale: data.puzzle.date !== todayStr,
      actualDate: data.puzzle.date
    };

  } catch (error) {
    // This will catch file-not-found or JSON parsing errors
    console.error(`Error reading or parsing today.json:`, error);
    return null;
  }
}

// Format date for display
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}


export const metadata: Metadata = {
  title: 'NYT Crossword Answer Today | New York Times Crossword Solutions',
  description: 'Get the daily New York Times crossword answer today. Complete solutions for all Across and Down clues, updated daily.',
};

export default async function NytDailyPage() {
  // Fetch crossword data from the static file
  const result = await fetchLatestCrossword();

  // If no data is available, show a message instead of 404
  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6">
              <Link
                href="/daily"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <ArrowLeftIcon className="mr-1 h-4 w-4" />
                Back to Daily Crosswords
              </Link>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-xl text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">NYT Daily Crossword</h1>
              <div className="p-8 bg-gray-50 rounded-lg mb-6">
                <p className="text-gray-700 mb-4">Sorry, we couldn't load today's crossword puzzle.</p>
                <p className="text-gray-600">Our system automatically checks for new puzzles at 5am IST daily.</p>
              </div>
              <Link
                href="/daily/nyt-crossword-answers"
                className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
              >
                <ArchiveIcon className="mr-2 h-4 w-4" />
                Browse Puzzle Archive
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { data, isStale, actualDate } = result;
  const { puzzle, across, down } = data;

  // Format dates for display
  const displayDate = formatDate(puzzle.date);

  // Custom date format for H1: Month Day, Year (e.g. January 1, 2026)
  const dateObj = new Date(puzzle.date);
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const h1Date = `${monthName} ${day}, ${year}`;

  // SEO Meta generation for current data - technically metadata export handles static, but we can't easily dynamic it here without layout changes or generateMetadata export with data fetching duplication (which is fine). 
  // Since I replaced the static export metadata at the top, let's leave it generic there or if I can use generateMetadata with async. 
  // Next.js allows generateMetadata. I should probably switch to it for better SEO if I want the date in title.
  // But for now keeping the generic one and focusing on on-page elements as requested.

  // Schema Data
  const appUrl = "https://crossword-solver.io";
  const personName = puzzle.author || "NYT Crossword Constructor";

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the NYT Crossword answer today (${h1Date})?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The answers for the New York Times crossword today, ${h1Date}, are listed below. We provide solutions for all across and down clues.`
        }
      },
      {
        "@type": "Question",
        "name": "When does the next NYT Crossword come out?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The New York Times Crossword is available daily at 10 PM EST weekdays and 6 PM EST weekends."
        }
      }
    ]
  };

  // Article/NewsArticle Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nyt crossword answer today (${h1Date})`,
    "datePublished": puzzle.date,
    "dateModified": puzzle.date,
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
      "@id": `${appUrl}/nyt-crossword-answer-today`
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
      "name": "Today's Answer",
      "item": `${appUrl}/nyt-crossword-answer-today`
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
          {/* Back to Daily */}
          <div className="mb-6">
            <Link
              href="/daily"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <ArrowLeftIcon className="mr-1 h-4 w-4" />
              Back to Daily Crosswords
            </Link>
          </div>

          {/* Header with Puzzle Info */}
          <div className="mb-8 rounded-xl bg-white p-6 shadow-xl">
            {isStale && (
              <div className="mb-4 rounded-md bg-yellow-100 p-3 text-sm text-yellow-800">
                <strong>Note:</strong> Today's crossword is not yet available.
                Showing the most recent puzzle from {formatDate(actualDate)}.
              </div>
            )}

            <div className="text-center">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
                New York Times
              </span>

              {/* Requested H1 Format */}
              <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                Nyt crossword answer today ({h1Date})
              </h1>

              <div className="mt-2 flex items-center justify-center text-gray-600">
                <CalendarIcon className="mr-2 h-5 w-5" />
                <span className="font-medium">{displayDate}</span>
                <span className="mx-2">•</span>
                <span>{puzzle.day_of_week}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 md:grid-cols-2">
              <div className="flex items-start space-x-3">
                <UserIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Author</h3>
                  <p className="text-gray-900">{puzzle.author}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <EditIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Editor</h3>
                  <p className="text-gray-900">{puzzle.editor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Paragraph */}
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Today's NYT Crossword Answers - {h1Date}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Looking for the solution to today's <strong>New York Times Crossword</strong>? You've come to the right place.
              Below you will find the complete list of answers for the <strong>Nyt crossword answer today ({h1Date})</strong>.
              We update our database daily to provide you with the most accurate solutions for all Across and Down clues.
              Solve your puzzle with confidence and check back every day for the latest answers.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mb-8 flex justify-center">
            <Link
              href="/daily/nyt-crossword-answers"
              className="flex items-center rounded-full bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-purple-700 hover:shadow-lg"
            >
              <ArchiveIcon className="mr-2 h-4 w-4" />
              Browse Puzzle Archive
            </Link>
          </div>

          {/* Clues Section */}
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Across Clues */}
            <div className="rounded-lg bg-blue-50 p-4 shadow-inner">
              {/* H2 Correctly */}
              <h2 className="mb-4 border-b border-blue-200 pb-2 text-xl font-semibold text-blue-900">
                Across Clues & Answers
              </h2>
              <div className="space-y-3">
                {across.map((clue: { number: number; clue_text: string; answer?: string }, idx: number) => (
                  <div key={`across-${idx}`} className="rounded-md bg-white p-3 shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-col">
                      <div className="flex items-start">
                        <span className="mr-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-sm font-semibold text-blue-800">
                          {clue.number}
                        </span>
                        <div className="flex-1">
                          <span className="text-gray-800">{clue.clue_text}</span>
                          <div className="mt-2 flex justify-end">
                            <span className="rounded-md bg-blue-100 px-2 py-1 font-mono font-bold text-blue-800">
                              {clue.answer || "Not available"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Down Clues */}
            <div className="rounded-lg bg-green-50 p-4 shadow-inner">
              {/* H2 Correctly */}
              <h2 className="mb-4 border-b border-green-200 pb-2 text-xl font-semibold text-green-900">
                Down Clues & Answers
              </h2>
              <div className="space-y-3">
                {down.map((clue: { number: number; clue_text: string; answer?: string }, idx: number) => (
                  <div key={`down-${idx}`} className="rounded-md bg-white p-3 shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-col">
                      <div className="flex items-start">
                        <span className="mr-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-sm font-semibold text-green-800">
                          {clue.number}
                        </span>
                        <div className="flex-1">
                          <span className="text-gray-800">{clue.clue_text}</span>
                          <div className="mt-2 flex justify-end">
                            <span className="rounded-md bg-green-100 px-2 py-1 font-mono font-bold text-green-800">
                              {clue.answer || "Not available"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Please Bookmark our website for daily answers</p>
            <p className="mt-1">Updated daily at 5am IST</p>
          </div>
        </div>
      </div>
    </div>
  );
}