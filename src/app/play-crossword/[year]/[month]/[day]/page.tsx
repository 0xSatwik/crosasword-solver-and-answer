import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  EditIcon,
  InfoIcon,
  ArchiveIcon,
  ShuffleIcon
} from 'lucide-react';

import CrosswordGrid from '../../../../components/CrosswordGrid';
import CrosswordClues from '../../../../components/CrosswordClues';
import CrosswordPlayMode from '../../../../components/CrosswordPlayMode';
import { fetchCrosswordPuzzle, formatPuzzleDate, isDateInRange } from '../../../../../lib/nyt-crosswords';

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: { year: string; month: string; day: string }
}): Promise<Metadata> {
  const { year, month, day } = params;
  const dateStr = `${year}/${month}/${day}`;

  return {
    title: `NYT Crossword - ${formatPuzzleDate(dateStr)}`,
    description: `New York Times crossword puzzle for ${formatPuzzleDate(dateStr)}`,
  };
}

export default async function PuzzlePage({
  params
}: {
  params: { year: string; month: string; day: string }
}) {
  const { year, month, day } = params;

  // Check if date is within allowed range
  if (!isDateInRange(parseInt(year), parseInt(month), parseInt(day))) {
    notFound();
  }

  // Fetch puzzle data
  const puzzle = await fetchCrosswordPuzzle({ year, month, day });

  // If puzzle not found, show 404
  if (!puzzle) {
    notFound();
  }

  // Format date for display
  const dateStr = `${year}/${month}/${day}`;
  const formattedDate = formatPuzzleDate(dateStr);

  // Calculate previous and next days
  const currentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  const prevDate = new Date(currentDate);
  prevDate.setDate(prevDate.getDate() - 1);
  const prevYear = prevDate.getFullYear();
  const prevMonth = String(prevDate.getMonth() + 1).padStart(2, '0');
  const prevDay = String(prevDate.getDate()).padStart(2, '0');

  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 1);
  const nextYear = nextDate.getFullYear();
  const nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
  const nextDay = String(nextDate.getDate()).padStart(2, '0');

  // Check if next/prev dates are within range
  const isPrevInRange = isDateInRange(prevDate.getFullYear(), prevDate.getMonth() + 1, prevDate.getDate());
  const isNextInRange = isDateInRange(nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate());

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* Header with Puzzle Info */}
          <div className="mb-8 rounded-xl bg-white p-6 shadow-xl">
            <div className="text-center">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
                {puzzle.publisher}
              </span>
              <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                {puzzle.title}
              </h1>
              <div className="mt-2 flex items-center justify-center text-gray-600">
                <CalendarIcon className="mr-2 h-5 w-5" />
                <span className="font-medium">{formattedDate}</span>
                <span className="mx-2">•</span>
                <span>{puzzle.dow}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 md:grid-cols-2">
              <div className="flex items-start space-x-3">
                <UserIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Creator</h3>
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

              <div className="flex items-start space-x-3">
                <InfoIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Grid Size</h3>
                  <p className="text-gray-900">{puzzle.size.rows}×{puzzle.size.cols}</p>
                </div>
              </div>

              {puzzle.notepad && (
                <div className="col-span-1 flex items-start space-x-3 md:col-span-2">
                  <InfoIcon className="h-5 w-5 text-yellow-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Notes</h3>
                    <p className="italic text-gray-900">{puzzle.notepad}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            {isPrevInRange ? (
              <Link
                href={`/play-crossword/${prevYear}/${prevMonth}/${prevDay}`}
                className="flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
              >
                <ChevronLeftIcon className="mr-2 h-4 w-4" />
                Previous Day
              </Link>
            ) : (
              <div className="w-32"></div> // Spacer
            )}

            <div className="flex justify-center space-x-4">
              <Link
                href="/play-crossword"
                className="flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
              >
                <ArchiveIcon className="mr-2 h-4 w-4" />
                Play Crossword
              </Link>

              <Link
                href="/play-crossword/random"
                className="flex items-center rounded-full bg-purple-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-purple-700 hover:shadow-lg"
              >
                <ShuffleIcon className="mr-2 h-4 w-4" />
                Random
              </Link>
            </div>

            {isNextInRange ? (
              <Link
                href={`/play-crossword/${nextYear}/${nextMonth}/${nextDay}`}
                className="flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
              >
                Next Day
                <ChevronRightIcon className="ml-2 h-4 w-4" />
              </Link>
            ) : (
              <div className="w-32"></div> // Spacer
            )}
          </div>

          {/* Interactive Crossword with Play/Solution Toggle */}
          <CrosswordPlayMode puzzle={puzzle} />

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Data sourced from the open-source NYT Crosswords repository.</p>
            <p className="mt-1">Archive available from January 1, 1977 to December 31, 2014.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 