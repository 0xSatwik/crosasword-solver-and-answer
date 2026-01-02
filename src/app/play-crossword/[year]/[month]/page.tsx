import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: { year: string; month: string }
}): Promise<Metadata> {
  const { year, month } = params;
  const monthName = new Date(parseInt(year), parseInt(month) - 1, 1)
    .toLocaleString('default', { month: 'long' });

  return {
    title: `${monthName} ${year} NYT Crosswords`,
    description: `Browse New York Times crossword puzzles for ${monthName} ${year}`,
  };
}

export default function MonthCalendarPage({
  params
}: {
  params: { year: string; month: string }
}) {
  const { year, month } = params;

  // Validate parameters
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);

  if (
    isNaN(yearNum) ||
    isNaN(monthNum) ||
    yearNum < 1977 ||
    yearNum > new Date().getFullYear() ||
    monthNum < 1 ||
    monthNum > 12
  ) {
    notFound();
  }

  // Convert to numbers for date calculations
  const currentYear = yearNum;
  const currentMonth = monthNum - 1; // JavaScript months are 0-indexed

  // Get month information
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Check if in a gap period
  const isInGap1978 = (
    currentYear === 1978 &&
    ((currentMonth === 7 && lastDay.getDate() >= 10) || // August
      currentMonth === 8 || // September
      currentMonth === 9 || // October
      (currentMonth === 10 && firstDay.getDate() <= 5)) // November
  );

  const isInGap2015_2016 = (
    (currentYear === 2015 && currentMonth === 7 && lastDay.getDate() >= 30) || // August 2015
    (currentYear === 2015 && currentMonth > 7) || // September-December 2015
    (currentYear === 2016 && currentMonth < 4) || // January-April 2016
    (currentYear === 2016 && currentMonth === 4 && firstDay.getDate() <= 1) // May 1, 2016
  );

  // Calculate previous and next months
  const prevMonth = new Date(currentYear, currentMonth - 1, 1);
  const nextMonth = new Date(currentYear, currentMonth + 1, 1);

  const prevMonthUrl = `/play-crossword/${prevMonth.getFullYear()}/${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;
  const nextMonthUrl = `/play-crossword/${nextMonth.getFullYear()}/${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;

  // Month and year names for display
  const monthName = firstDay.toLocaleString('default', { month: 'long' });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            {monthName} {currentYear}
          </h1>
          <p className="mt-2 text-gray-600">
            New York Times Crossword Puzzles
          </p>
        </div>

        {/* Month Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={prevMonthUrl}
            className="flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Previous Month
          </Link>

          <Link
            href="/play-crossword"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50"
          >
            Back to Explorer
          </Link>

          <Link
            href={nextMonthUrl}
            className="flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Next Month
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Gap Warning */}
        {(isInGap1978 || isInGap2015_2016) && (
          <div className="mb-6 rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Data Gap Warning
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    {isInGap1978 && "Some puzzles for this month are missing due to a known gap in the dataset (August 10 - November 5, 1978)."}
                    {isInGap2015_2016 && "Some puzzles for this month are missing due to a known gap in the dataset (August 30, 2015 - May 1, 2016)."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="mb-8 overflow-hidden rounded-lg border bg-white shadow">
          {/* Day names */}
          <div className="grid grid-cols-7 border-b bg-gray-50 text-center font-semibold">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {/* Empty cells for days before the first of the month */}
            {Array.from({ length: startDayOfWeek }).map((_, index) => (
              <div key={`empty-start-${index}`} className="min-h-[80px] border-b border-r p-2" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dateStr = `${year}/${month}/${String(day).padStart(2, '0')}`;

              // Check if date is in a gap period
              const isInAugToNovGap1978 = (
                currentYear === 1978 &&
                ((currentMonth === 7 && day >= 10) || // August
                  currentMonth === 8 || // September
                  currentMonth === 9 || // October
                  (currentMonth === 10 && day <= 5)) // November
              );

              const isInAug2015ToMay2016Gap = (
                (currentYear === 2015 && currentMonth === 7 && day >= 30) || // August 2015
                (currentYear === 2015 && currentMonth > 7) || // September-December 2015
                (currentYear === 2016 && currentMonth < 4) || // January-April 2016
                (currentYear === 2016 && currentMonth === 4 && day <= 1) // May 1, 2016
              );

              const isAvailable = !isInAugToNovGap1978 && !isInAug2015ToMay2016Gap;

              // Check if this date is in the future
              const puzzleDate = new Date(currentYear, currentMonth, day);
              const isInFuture = puzzleDate > new Date();

              return (
                <div
                  key={`day-${day}`}
                  className={`min-h-[80px] border-b border-r p-2 ${(startDayOfWeek + index) % 7 === 0 ? 'border-l' : ''}`}
                >
                  <div className="font-medium">{day}</div>

                  {isInFuture ? (
                    <div className="mt-2 text-sm text-gray-400">
                      Not yet published
                    </div>
                  ) : isAvailable ? (
                    <Link
                      href={`/play-crossword/${dateStr}`}
                      className="mt-2 block rounded bg-blue-50 px-2 py-1 text-sm text-blue-700 transition hover:bg-blue-100"
                    >
                      View Puzzle
                    </Link>
                  ) : (
                    <div className="mt-2 text-sm text-gray-400">
                      Not available
                    </div>
                  )}
                </div>
              );
            })}

            {/* Empty cells for days after the end of the month */}
            {Array.from({ length: (7 - ((startDayOfWeek + daysInMonth) % 7)) % 7 }).map((_, index) => (
              <div key={`empty-end-${index}`} className="min-h-[80px] border-b border-r p-2" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 