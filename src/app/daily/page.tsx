import Link from 'next/link';
import { Metadata } from 'next';
import { Calendar, NewspaperIcon, Clock, Award, Coffee, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Daily Crosswords | Crossword Central',
  description: 'Access today\'s crossword puzzles from NYT, USA Today, LA Times and more - updated daily at 5am IST.',
};

export default function DailyCrosswordsPage() {
  // Get today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Format for URL
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateUrl = `${year}/${month}/${day}`;
  
  const crosswordSources = [
    {
      title: 'NYT Daily',
      description: 'The New York Times daily crossword puzzle',
      icon: <NewspaperIcon className="h-10 w-10" />,
      color: 'bg-blue-100 text-blue-700',
      iconBg: 'bg-blue-600',
      href: '/daily/nyt-daily',
      updated: 'Updated daily at 5am IST',
    },
    {
      title: 'NYT Archive',
      description: 'Browse historical New York Times crossword puzzles',
      icon: <Calendar className="h-10 w-10" />,
      color: 'bg-green-100 text-green-700',
      iconBg: 'bg-green-600',
      href: '/daily/nyt-archive',
      updated: 'Puzzles from 1977 to present',
    },
    {
      title: 'Play Random Puzzle',
      description: 'Try a random crossword puzzle from our archives',
      icon: <Clock className="h-10 w-10" />,
      color: 'bg-indigo-100 text-indigo-700',
      iconBg: 'bg-indigo-600',
      href: '/nyt-crosswords/random',
      updated: 'Thousands of puzzles available',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Daily Crosswords</h1>
            <p className="mt-3 text-lg text-gray-600">
              Today's crossword puzzles from top publishers
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {formattedDate} • Updated daily at 5am IST
            </p>
          </div>

          {/* Crossword Sources Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {crosswordSources.map((source, index) => (
              <Link 
                href={source.href} 
                key={index}
                className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`relative p-6 ${source.color}`}>
                  <div className={`absolute right-4 top-4 rounded-full ${source.iconBg} p-2 text-white`}>
                    {source.icon}
                  </div>
                  <h3 className="text-xl font-bold">{source.title}</h3>
                  <p className="mt-2 text-sm">{source.description}</p>
                </div>
                <div className="flex flex-grow flex-col justify-between p-4">
                  <p className="text-xs text-gray-500">{source.updated}</p>
                  <div className="mt-4 self-end rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 group-hover:bg-blue-600 group-hover:text-white">
                    View Crossword →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* API Information */}
          <div className="mt-12 rounded-lg bg-blue-50 p-6 text-center">
            <h2 className="text-xl font-semibold text-blue-900">Automatic Updates</h2>
            <p className="mt-2 text-gray-700">
              All crosswords are automatically updated daily at 5am IST using our Crossword Archive API.
              If today's puzzle is unavailable, we'll display the most recent available puzzle.
            </p>
            <div className="mt-4 rounded-lg bg-white p-4">
              <code className="text-sm text-gray-800">
                API: https://crossword-archive-worker.mitomat.workers.dev/api/puzzle/{dateUrl}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 