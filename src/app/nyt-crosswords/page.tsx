import { Metadata } from 'next';
import Link from 'next/link';
import { ArchiveIcon, CalendarDaysIcon, ShuffleIcon } from 'lucide-react';
import DateSelector from '../components/DateSelector';

export const metadata: Metadata = {
  title: 'NYT Crosswords Archive (1977-2014)',
  description: 'Explore New York Times crossword puzzles from 1977 to 2014',
};

export default function NYTCrosswordsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-16 pt-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
            NYT Crosswords Archive
          </h1>
          <div className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            1977-2014
          </div>
          <p className="mt-4 text-lg text-gray-600">
            Browse through the complete collection of New York Times crossword puzzles
            from January 1, 1977 to December 31, 2014.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {/* Quick Access Card */}
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/nyt-crosswords/random"
              className="group flex items-center justify-center rounded-xl bg-white p-6 text-center shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col items-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                  <ShuffleIcon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">Random Puzzle</h3>
                <p className="text-sm text-gray-600">
                  Discover a random crossword from our archive
                </p>
              </div>
            </Link>

            <Link
              href="#explorer"
              className="group flex items-center justify-center rounded-xl bg-white p-6 text-center shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col items-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <ArchiveIcon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">Browse Archive</h3>
                <p className="text-sm text-gray-600">
                  Find a specific puzzle by date
                </p>
              </div>
            </Link>
          </div>

          {/* Date Selector */}
          <div id="explorer" className="scroll-mt-16">
            <DateSelector />
          </div>

          {/* Information Card */}
          <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">About the Archive</h2>
            <p className="mb-4 text-gray-700">
              This archive contains data for every New York Times crossword from January 1, 1977 to December 31, 2014. 
              The puzzles are sourced from the open-source NYT Crosswords repository in JSON format.
            </p>
            
            <div className="mb-4 overflow-x-auto rounded-md bg-gray-50 p-4">
              <code className="block text-sm text-gray-800">
                https://raw.githubusercontent.com/doshea/nyt_crosswords/master/YYYY/MM/DD.json
              </code>
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="font-medium">Known gaps in coverage:</p>
              <ul className="ml-5 mt-2 list-disc">
                <li>1978: August 10 - November 5</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 