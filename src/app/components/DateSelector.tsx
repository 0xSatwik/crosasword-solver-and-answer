"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon } from 'lucide-react';

interface DateSelectorProps {
  defaultYear?: number;
  defaultMonth?: number;
  defaultDay?: number;
}

export default function DateSelector({ defaultYear, defaultMonth, defaultDay }: DateSelectorProps) {
  const router = useRouter();
  
  // Set defaults within the valid range
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear || 2000);
  const [selectedMonth, setSelectedMonth] = useState<number>(defaultMonth || 1);
  const [selectedDay, setSelectedDay] = useState<number>(defaultDay || 1);

  // Constants
  const startYear = 1977;
  const endYear = 2014;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  // Month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days in selected month
  const getDaysInMonth = (year: number, month: number) => {
    // Month is 1-based, but Date constructor expects 0-based month
    return new Date(year, month, 0).getDate();
  };

  const daysInSelectedMonth = getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);

  // Update days when year or month changes
  useEffect(() => {
    const maxDay = getDaysInMonth(selectedYear, selectedMonth);
    if (selectedDay > maxDay) {
      setSelectedDay(maxDay);
    }
  }, [selectedYear, selectedMonth, selectedDay]);

  // Navigate to the puzzle for the selected date
  const goToPuzzle = () => {
    const formattedMonth = String(selectedMonth).padStart(2, '0');
    const formattedDay = String(selectedDay).padStart(2, '0');
    router.push(`/nyt-crosswords/${selectedYear}/${formattedMonth}/${formattedDay}`);
  };

  // Navigate to random puzzle within range
  const goToRandom = () => {
    const randomYear = startYear + Math.floor(Math.random() * (endYear - startYear + 1));
    const randomMonth = 1 + Math.floor(Math.random() * 12);
    let randomDay = 1 + Math.floor(Math.random() * getDaysInMonth(randomYear, randomMonth));
    
    // Special case for December 2014 - limit to 31st
    if (randomYear === 2014 && randomMonth === 12) {
      randomDay = Math.min(randomDay, 31);
    }
    
    const formattedMonth = String(randomMonth).padStart(2, '0');
    const formattedDay = String(randomDay).padStart(2, '0');
    router.push(`/nyt-crosswords/${randomYear}/${formattedMonth}/${formattedDay}`);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center">
        <CalendarIcon className="mr-3 h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-900">Select a Crossword Date</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="year" className="mb-1 block text-sm font-medium text-gray-700">
            Year
          </label>
          <select 
            id="year" 
            className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="month" className="mb-1 block text-sm font-medium text-gray-700">
            Month
          </label>
          <select 
            id="month" 
            className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((monthName, index) => (
              <option key={monthName} value={index + 1}>
                {monthName}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="day" className="mb-1 block text-sm font-medium text-gray-700">
            Day
          </label>
          <select 
            id="day" 
            className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            value={selectedDay}
            onChange={(e) => setSelectedDay(parseInt(e.target.value))}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button 
          className="w-full rounded-full bg-blue-600 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          onClick={goToPuzzle}
        >
          View Selected Puzzle
        </button>
        
        <button 
          className="w-full rounded-full bg-purple-600 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-purple-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto"
          onClick={goToRandom}
        >
          Random Puzzle (1977-2014)
        </button>
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        Note: Archive available from January 1, 1977 to December 31, 2014
      </div>
    </div>
  );
} 