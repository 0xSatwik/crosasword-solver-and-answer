import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          Puzzle Not Found
        </h2>
        <p className="mb-8 text-lg text-gray-600">
          Sorry, we couldn't find the crossword puzzle you're looking for.
        </p>
        <div className="space-y-4">
          <p className="text-gray-600">This might be due to:</p>
          <ul className="mx-auto mb-8 ml-4 list-disc space-y-2 text-left text-gray-600">
            <li>A date that is outside the available range (puzzles start from January 1, 1977)</li>
            <li>A date falling within one of the known gap periods:
              <ul className="ml-6 mt-2 list-circle text-sm">
                <li>August 10 - November 5, 1978</li>
                <li>August 30, 2015 - May 1, 2016</li>
              </ul>
            </li>
            <li>A future date for which a puzzle hasn't been published yet</li>
          </ul>
          <div className="space-x-4">
            <Link
              href="/nyt-crosswords"
              className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Return to Explorer
            </Link>
            <Link
              href="/nyt-crosswords/random"
              className="rounded-md bg-white px-4 py-2 font-medium text-blue-600 hover:bg-blue-50"
            >
              Try a Random Puzzle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 