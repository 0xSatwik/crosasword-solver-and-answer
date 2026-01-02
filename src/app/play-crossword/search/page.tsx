import { Metadata } from 'next';
import Link from 'next/link';
import { SearchIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Search NYT Crosswords',
  description: 'Search the New York Times crossword puzzle archive',
};

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Search NYT Crosswords
          </h1>
          <p className="mt-2 text-gray-600">
            Find puzzles by date, author, or editor
          </p>
        </div>

        {/* Note: This would be a client component in a real implementation */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center">
            <div className="relative flex-grow">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for puzzles by author, editor, or title..."
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              className="ml-4 rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="author" className="mb-1 block text-sm font-medium text-gray-700">
                Author
              </label>
              <select
                id="author"
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">Any Author</option>
                <option value="Will Shortz">Will Shortz</option>
                <option value="Joel Fagliano">Joel Fagliano</option>
                <option value="Patrick Berry">Patrick Berry</option>
                {/* More options would be populated from actual data */}
              </select>
            </div>

            <div>
              <label htmlFor="editor" className="mb-1 block text-sm font-medium text-gray-700">
                Editor
              </label>
              <select
                id="editor"
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">Any Editor</option>
                <option value="Will Shortz">Will Shortz</option>
                <option value="Eugene T. Maleska">Eugene T. Maleska</option>
                {/* More options would be populated from actual data */}
              </select>
            </div>

            <div>
              <label htmlFor="day" className="mb-1 block text-sm font-medium text-gray-700">
                Day of Week
              </label>
              <select
                id="day"
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">Any Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="from-date" className="mb-1 block text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                type="date"
                id="from-date"
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                min="1977-01-01"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label htmlFor="to-date" className="mb-1 block text-sm font-medium text-gray-700">
                To Date
              </label>
              <input
                type="date"
                id="to-date"
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                min="1977-01-01"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        {/* Sample Results */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Search Results</h2>
          <p className="mb-6 text-gray-600">
            Search functionality would be implemented with client-side components in a real application. Below are sample results.
          </p>

          <div className="divide-y">
            {[
              {
                date: "2022-01-15",
                title: "NY TIMES, SAT, JAN 15, 2022",
                author: "Erik Agard",
                editor: "Will Shortz",
                dow: "Saturday"
              },
              {
                date: "2021-11-23",
                title: "NY TIMES, TUE, NOV 23, 2021",
                author: "Ross Trudeau",
                editor: "Will Shortz",
                dow: "Tuesday"
              },
              {
                date: "2020-05-07",
                title: "NY TIMES, THU, MAY 07, 2020",
                author: "Jeff Chen",
                editor: "Will Shortz",
                dow: "Thursday"
              }
            ].map((result, idx) => {
              const [year, month, day] = result.date.split('-');
              return (
                <div key={idx} className="py-4">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        By {result.author} • Edited by {result.editor}
                      </p>
                    </div>
                    <Link
                      href={`/play-crossword/${year}/${month}/${day}`}
                      className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100"
                    >
                      View Puzzle
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center">
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <a href="#" className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="relative inline-flex items-center border border-gray-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:z-20">1</a>
              <a href="#" className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">2</a>
              <a href="#" className="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex">3</a>
              <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">...</span>
              <a href="#" className="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex">8</a>
              <a href="#" className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">9</a>
              <a href="#" className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">10</a>
              <a href="#" className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </a>
            </nav>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/play-crossword"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50"
          >
            Back to Explorer
          </Link>
        </div>
      </div>
    </div>
  );
} 