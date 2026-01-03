import Link from 'next/link';
import { Metadata } from 'next';
import { Calendar, NewspaperIcon, Sparkles, ArrowRight, Shuffle, Trophy, Clock, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Daily Crosswords | Crossword Solver',
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

  const crosswordSources = [
    {
      title: 'NYT Daily',
      description: 'The New York Times daily crossword puzzle with answers',
      icon: NewspaperIcon,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      href: '/nyt-crossword-answer-today',
      badge: 'Most Popular',
      badgeColor: 'bg-amber-500',
    },
    {
      title: 'NYT Mini',
      description: 'Quick 5-minute mini crossword puzzle with answers',
      icon: Sparkles,
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-50 to-amber-50',
      href: '/nyt-mini-answer-today',
      badge: 'Quick Play',
      badgeColor: 'bg-orange-500',
    },
  ];


  const stats = [
    { icon: Trophy, value: '45+', label: 'Years of Archives', color: 'text-amber-500' },
    { icon: Users, value: '10K+', label: 'Puzzles Available', color: 'text-blue-500' },
    { icon: Clock, value: '5 AM', label: 'Daily Updates IST', color: 'text-emerald-500' },
  ];

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="mb-12 text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Fresh Puzzles Every Day
            </div>
            <h1 className="text-4xl font-bold text-gray-900 md:text-5xl mb-4">
              Daily <span className="text-gradient">Crosswords</span>
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Access today's crossword puzzles from top publishers
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-gray-200 shadow-sm">
              <Calendar className="w-4 h-4 text-blue-500" />
              {formattedDate}
            </div>
          </div>

          {/* Crossword Sources Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-16">
            {crosswordSources.map((source, index) => {
              const Icon = source.icon;
              return (
                <Link
                  href={source.href}
                  key={index}
                  className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up border border-gray-100"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Badge */}
                  <div className={`absolute top-4 right-4 ${source.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10`}>
                    {source.badge}
                  </div>

                  {/* Colored header section */}
                  <div className={`relative p-8 bg-gradient-to-br ${source.bgGradient}`}>
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${source.gradient} flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <Icon className="h-8 w-8" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mt-5 mb-2">{source.title}</h3>
                    <p className="text-gray-600">{source.description}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between p-5 bg-white border-t border-gray-100">
                    <span className="text-sm text-gray-500">View puzzles</span>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${source.gradient} text-white group-hover:scale-110 transition-transform`}>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="card-glass rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Crossword <span className="text-gradient">Destination</span>
              </h2>
              <p className="text-gray-600">
                The most comprehensive crossword archive on the web
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="text-center p-4 rounded-2xl bg-white/50 border border-gray-100"
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}