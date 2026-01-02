"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon, ArrowLeftIcon, UserIcon, EditIcon } from 'lucide-react';

// Format date for display
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
    const response = await fetch(`https://crossword-archive-worker.mitomat.workers.dev/api/puzzle/${date}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch puzzle for ${date}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching puzzle for ${date}:`, error);
    return null;
  }
}

export default function NytArchivePage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [puzzleData, setPuzzleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate years for the selector (1977 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1976 }, (_, i) => currentYear - i);

  // Month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Handle month navigation
  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Generate days for the calendar
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null); // Empty cells for days before the 1st
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Check if a date is in the future
  const isFutureDate = (year: number, month: number, day: number) => {
    const today = new Date();
    const checkDate = new Date(year, month - 1, day);
    return checkDate > today;
  };

  // Check if a date is today
  const isToday = (year: number, month: number, day: number) => {
    const today = new Date();
    return today.getFullYear() === year &&
      today.getMonth() === month - 1 &&
      today.getDate() === day;
  };

  // Format date for API
  const formatDateForApi = (year: number, month: number, day: number) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Handle date selection
  const handleDateSelect = async (day: number) => {
    if (isFutureDate(year, month, day)) {
      return;
    }

    // Convert to canonical format: [monthname]-[dd]-[yyyy]
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const monthName = monthNames[month - 1];
    const paddedDay = day.toString().padStart(2, '0');

    // Navigate to the new dedicated answer page
    window.location.href = `/nyt-crossword-answer-for-${monthName}-${paddedDay}-${year}`;
  };

  // Go to today's date
  const goToToday = () => {
    const today = new Date();
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
  };

  // Jump to selected year and month
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(parseInt(e.target.value));
  };

  // Load random puzzle
  const loadRandomPuzzle = async () => {
    setIsLoading(true);
    setError(null);

    // Generate a random date between 1977 and yesterday
    const startDate = new Date(1977, 0, 1);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Calculate the range in days
    const timeDiff = yesterday.getTime() - startDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    // Generate a random offset between 0 and daysDiff
    const randomDays = Math.floor(Math.random() * daysDiff);

    // Calculate the random date
    const randomDate = new Date(startDate);
    randomDate.setDate(startDate.getDate() + randomDays);

    // Format the date for the API
    const formattedDate = formatDateForApi(
      randomDate.getFullYear(),
      randomDate.getMonth() + 1,
      randomDate.getDate()
    );

    setSelectedDate(formattedDate);

    try {
      const result = await fetchCrosswordData(formattedDate);
      if (result?.success && result?.data) {
        setPuzzleData(result.data);
        // Update calendar to show the random date
        setYear(randomDate.getFullYear());
        setMonth(randomDate.getMonth() + 1);
      } else {
        setError('No puzzle data available for the random date. Please try again.');
        setPuzzleData(null);
      }
    } catch (err) {
      setError('Failed to load random puzzle data. Please try again.');
      setPuzzleData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/nyt-crossword-answer-today"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <ArrowLeftIcon className="mr-1 h-4 w-4" />
              Back to NYT Daily Crossword
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">NYT Crossword Archive</h1>
            <p className="mt-3 text-gray-600">
              Browse and access historical New York Times crossword puzzles
            </p>
          </div>

          {/* Calendar Card */}
          <div className="rounded-xl bg-white p-6 shadow-xl">
            {/* Calendar Navigation */}
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="rounded-full p-2 text-gray-700 hover:bg-gray-100"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-3">
                <select
                  value={month}
                  onChange={handleMonthChange}
                  className="rounded-md border-gray-300 py-1 text-sm"
                >
                  {months.map((monthName, index) => (
                    <option key={monthName} value={index + 1}>
                      {monthName}
                    </option>
                  ))}
                </select>

                <select
                  value={year}
                  onChange={handleYearChange}
                  className="rounded-md border-gray-300 py-1 text-sm"
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                <button
                  onClick={goToToday}
                  className="ml-2 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                >
                  Today
                </button>
              </div>

              <button
                onClick={nextMonth}
                className="rounded-full p-2 text-gray-700 hover:bg-gray-100"
                disabled={year === currentYear && month === new Date().getMonth() + 1}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-hidden rounded-lg bg-gray-50">
              {/* Day headers */}
              <div className="grid grid-cols-7 bg-gray-100 text-center font-medium text-gray-700">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="border-b border-gray-200 p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`border border-gray-200 p-2 text-center ${!day ? 'bg-gray-50' : ''
                      }`}
                  >
                    {day && (
                      isFutureDate(year, month, day) ? (
                        <span className="inline-block h-8 w-8 cursor-not-allowed rounded-full py-1 text-gray-400">
                          {day}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDateSelect(day)}
                          className={`inline-block h-8 w-8 rounded-full py-1 transition-colors hover:bg-blue-100 hover:text-blue-700 ${isToday(year, month, day)
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : selectedDate === formatDateForApi(year, month, day)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-700'
                            }`}
                        >
                          {day}
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 rounded-md bg-blue-50 p-4 text-center text-sm text-blue-800">
              Click on a date to view the NYT crossword puzzle solutions for that day.
              <br />
              Puzzles are available from 1977 to the present day.
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="mt-8 rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Navigation</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                href="/nyt-crossword-answer-today"
                className="flex items-center justify-center rounded-lg bg-blue-100 p-3 text-blue-700 transition-colors hover:bg-blue-200"
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                Today's Puzzle
              </Link>

              <button
                onClick={loadRandomPuzzle}
                className="flex items-center justify-center rounded-lg bg-purple-100 p-3 text-purple-700 transition-colors hover:bg-purple-200"
              >
                <SearchIcon className="mr-2 h-5 w-5" />
                Random Puzzle
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-8 rounded-xl bg-white p-8 shadow-xl text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading puzzle data...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="mt-8 rounded-xl bg-white p-6 shadow-xl">
              <div className="rounded-md bg-red-50 p-4 text-center text-red-800">
                <p>{error}</p>
                <button
                  onClick={loadRandomPuzzle}
                  className="mt-4 rounded-md bg-red-100 px-4 py-2 font-medium text-red-700 hover:bg-red-200"
                >
                  Try a Random Puzzle Instead
                </button>
              </div>
            </div>
          )}

          {/* Puzzle Display */}
          {puzzleData && !isLoading && (
            <div className="mt-8">
              {/* Header with Puzzle Info */}
              <div className="mb-8 rounded-xl bg-white p-6 shadow-xl">
                <div className="text-center">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
                    New York Times
                  </span>
                  <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                    {puzzleData.puzzle.title}
                  </h1>
                  <div className="mt-2 flex items-center justify-center text-gray-600">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    <span className="font-medium">{formatDisplayDate(puzzleData.puzzle.date)}</span>
                    <span className="mx-2">•</span>
                    <span>{puzzleData.puzzle.day_of_week}</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 md:grid-cols-2">
                  <div className="flex items-start space-x-3">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Author</h3>
                      <p className="text-gray-900">{puzzleData.puzzle.author}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <EditIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Editor</h3>
                      <p className="text-gray-900">{puzzleData.puzzle.editor}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clues Section */}
              <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Across Clues */}
                <div className="rounded-lg bg-blue-50 p-4 shadow-inner">
                  <h3 className="mb-4 border-b border-blue-200 pb-2 text-xl font-semibold text-blue-900">
                    Across
                  </h3>
                  <div className="space-y-3">
                    {puzzleData.across.map((clue: any, idx: number) => (
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
                  <h3 className="mb-4 border-b border-green-200 pb-2 text-xl font-semibold text-green-900">
                    Down
                  </h3>
                  <div className="space-y-3">
                    {puzzleData.down.map((clue: any, idx: number) => (
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

              {/* Play Button */}
              <div className="mb-8 flex justify-center">
                <Link
                  href={`/play-crossword/${selectedDate?.split('-')[0]}/${selectedDate?.split('-')[1]}/${selectedDate?.split('-')[2]}`}
                  className="flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
                >
                  Play This Puzzle
                </Link>
              </div>

              {/* API Source Info */}
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>Data sourced from the Crossword Archive API.</p>
                <p className="mt-1">Updated daily at 5am IST.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 