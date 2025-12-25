import Link from 'next/link';
import { Metadata } from 'next';
import { Calendar, NewspaperIcon, Clock, Sparkles, ArrowRight, Shuffle } from 'lucide-react';

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
      icon: NewspaperIcon,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      href: '/daily/nyt-daily',
      updated: 'Updated daily at 5am IST',
    },
    {
      title: 'NYT Archive',
      description: 'Browse historical New York Times crossword puzzles',
      icon: Calendar,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      href: '/daily/nyt-archive',
      updated: 'Puzzles from 1977 to present',
    },
    {
      title: 'Play Random Puzzle',
      description: 'Try a random crossword puzzle from our archives',
      icon: Shuffle,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      href: '/nyt-crosswords/random',
      updated: 'Thousands of puzzles available',
    },
  ];

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="mb-12 text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Updated Daily
            </div>
            <h1 className="text-4xl font-bold text-gray-900 md:text-5xl mb-4">
              Daily <span className="text-gradient">Crosswords</span>
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Today's crossword puzzles from top publishers
            </p>
            <p className="text-sm text-gray-500 bg-white/60 backdrop-blur-sm inline-block px-4 py-2 rounded-full border border-gray-200">
              📅 {formattedDate}
            </p>
          </div>

          {/* Crossword Sources Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-16">
            {crosswordSources.map((source, index) => {
              const Icon = source.icon;
              return (
                <Link
                  href={source.href}
                  key={index}
                  className="group card-premium overflow-hidden hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Colored header */}
                  <div className={`relative p-6 bg-gradient-to-br ${source.bgGradient} -m-6 mb-0`}>
                    {/* Icon */}
                    <div className={`absolute right-4 top-4 w-14 h-14 rounded-2xl bg-gradient-to-br ${source.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{source.title}</h3>
                    <p className="text-sm text-gray-600 pr-16">{source.description}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between p-6 -m-6 mt-4 bg-white">
                    <p className="text-xs text-gray-500">{source.updated}</p>
                    <div className={`flex items-center gap-1 text-sm font-semibold bg-gradient-to-r ${source.gradient} bg-clip-text text-transparent group-hover:gap-2 transition-all`}>
                      <span>View</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* API Information */}
          <div className="card-glass rounded-3xl p-8 text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6 shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Automatic Updates
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              All crosswords are automatically updated daily at 5am IST using our Crossword Archive API.
              If today's puzzle is unavailable, we'll display the most recent available puzzle.
            </p>

            <div className="bg-gray-900 rounded-xl p-4 max-w-xl mx-auto">
              <code className="text-sm text-emerald-400 break-all">
                https://crossword-archive-worker.mitomat.workers.dev/api/puzzle/{dateUrl}
              </code>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            {[
              { value: '45+', label: 'Years of Archives' },
              { value: '10K+', label: 'Puzzles Available' },
              { value: '24/7', label: 'Always Updated' },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm animate-fade-in-up"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}