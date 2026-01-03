"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, Sparkles, Clock, Zap } from 'lucide-react';
import { fetchMiniList } from '../../../lib/nytMiniApi';

export default function NytMiniArchivePage() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    // Generate years for the selector (2014 to current year - Mini started later)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2013 }, (_, i) => currentYear - i);

    // Month names
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Load available dates
    useEffect(() => {
        async function loadDates() {
            setIsLoading(true);
            try {
                // Fetch a large batch to get all available dates
                const result = await fetchMiniList(1, 100);
                if (result?.success && result.dates) {
                    setAvailableDates(new Set(result.dates));
                }
            } catch (error) {
                console.error('Error loading dates:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadDates();
    }, []);

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

    // Format date for API check
    const formatDateForCheck = (year: number, month: number, day: number) => {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    // Check if date has a puzzle available
    const hasPuzzle = (year: number, month: number, day: number) => {
        const dateStr = formatDateForCheck(year, month, day);
        return availableDates.has(dateStr);
    };

    // Handle date selection
    const handleDateSelect = (day: number) => {
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

        // Navigate to the answer page
        window.location.href = `/nyt-mini-crossword-answer-for-${monthName}-${paddedDay}-${year}`;
    };

    // Go to today's date
    const goToToday = () => {
        const today = new Date();
        setYear(today.getFullYear());
        setMonth(today.getMonth() + 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white py-12">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl">
                    {/* Back link */}
                    <div className="mb-6">
                        <Link
                            href="/nyt-mini-answer-today"
                            className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors"
                        >
                            <ArrowLeftIcon className="mr-1 h-4 w-4" />
                            Back to Today's Mini
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-10 text-center">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            Mini Crossword Archive
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl mb-3">
                            NYT <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Mini</span> Archive
                        </h1>
                        <p className="text-gray-600">
                            Browse historical NYT Mini crossword puzzles
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="text-center p-4 rounded-2xl bg-white shadow-md border border-orange-100">
                            <Clock className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                            <div className="text-xl font-bold text-gray-900">5 min</div>
                            <div className="text-xs text-gray-500">Solve time</div>
                        </div>
                        <div className="text-center p-4 rounded-2xl bg-white shadow-md border border-orange-100">
                            <Zap className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                            <div className="text-xl font-bold text-gray-900">5×5</div>
                            <div className="text-xs text-gray-500">Grid size</div>
                        </div>
                        <div className="text-center p-4 rounded-2xl bg-white shadow-md border border-orange-100">
                            <CalendarIcon className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                            <div className="text-xl font-bold text-gray-900">Daily</div>
                            <div className="text-xs text-gray-500">Updates</div>
                        </div>
                    </div>

                    {/* Calendar Card */}
                    <div className="rounded-2xl bg-white p-6 shadow-xl border border-orange-100">
                        {/* Calendar Navigation */}
                        <div className="mb-6 flex items-center justify-between">
                            <button
                                onClick={prevMonth}
                                className="rounded-full p-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>

                            <div className="flex items-center space-x-3">
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(parseInt(e.target.value))}
                                    className="rounded-lg border-orange-200 py-2 px-3 text-sm font-medium focus:border-orange-500 focus:ring-orange-500"
                                >
                                    {months.map((monthName, index) => (
                                        <option key={monthName} value={index + 1}>
                                            {monthName}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    className="rounded-lg border-orange-200 py-2 px-3 text-sm font-medium focus:border-orange-500 focus:ring-orange-500"
                                >
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>

                                <button
                                    onClick={goToToday}
                                    className="ml-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 text-xs font-medium text-white hover:from-orange-600 hover:to-amber-600 transition-colors shadow-md"
                                >
                                    Today
                                </button>
                            </div>

                            <button
                                onClick={nextMonth}
                                className="rounded-full p-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                disabled={year === currentYear && month === new Date().getMonth() + 1}
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="text-center py-8">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-r-transparent"></div>
                                <p className="mt-2 text-gray-500 text-sm">Loading available dates...</p>
                            </div>
                        )}

                        {/* Calendar Grid */}
                        {!isLoading && (
                            <div className="overflow-hidden rounded-xl bg-orange-50/50">
                                {/* Day headers */}
                                <div className="grid grid-cols-7 bg-gradient-to-r from-orange-500 to-amber-500 text-center font-medium text-white">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="p-3 text-sm">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar days */}
                                <div className="grid grid-cols-7">
                                    {days.map((day, index) => (
                                        <div
                                            key={index}
                                            className={`border border-orange-100 p-2 text-center min-h-[50px] flex items-center justify-center ${!day ? 'bg-orange-50/30' : 'bg-white'
                                                }`}
                                        >
                                            {day && (
                                                isFutureDate(year, month, day) ? (
                                                    <span className="inline-flex items-center justify-center h-9 w-9 rounded-full text-gray-300 cursor-not-allowed text-sm">
                                                        {day}
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDateSelect(day)}
                                                        className={`inline-flex items-center justify-center h-9 w-9 rounded-full text-sm font-medium transition-all ${isToday(year, month, day)
                                                            ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-xl'
                                                            : hasPuzzle(year, month, day)
                                                                ? 'text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                                                                : 'text-gray-400 hover:bg-gray-100'
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
                        )}

                        {/* Instructions */}
                        <div className="mt-6 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 p-4 text-center text-sm text-orange-800 border border-orange-100">
                            Click on a date to view the NYT Mini crossword puzzle solutions for that day.
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div className="mt-8 rounded-2xl bg-white p-6 shadow-xl border border-orange-100">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Navigation</h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Link
                                href="/nyt-mini-answer-today"
                                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white font-medium transition-all hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl"
                            >
                                <Sparkles className="h-5 w-5" />
                                Today's Mini Puzzle
                            </Link>

                            <Link
                                href="/nyt-mini-solver"
                                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 p-4 text-white font-medium transition-all hover:from-amber-600 hover:to-yellow-600 shadow-lg hover:shadow-xl"
                            >
                                <CalendarIcon className="h-5 w-5" />
                                Mini Clue Solver
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
