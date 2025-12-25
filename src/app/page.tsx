import Link from "next/link";
import { CalendarDays, Database, Puzzle, Wrench, ArrowRight, Sparkles, Zap } from "lucide-react";

export default function Home() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const features = [
    {
      icon: CalendarDays,
      title: 'Daily Solutions',
      description: 'Get answers for NYT, USA Today, LA Times, and other popular crosswords updated daily.',
      href: '/daily',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Wrench,
      title: 'Solver Tool',
      description: 'Our advanced solver helps you find answers using clues, patterns, and letter hints.',
      href: '/solver',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
    },
    {
      icon: Puzzle,
      title: 'Guides & Tips',
      description: 'Learn expert techniques and strategies to improve your crossword solving skills.',
      href: '/guides',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: Database,
      title: 'Play Crossword',
      description: 'Access every New York Times crossword since 1977 with our comprehensive archive.',
      href: '/nyt-crosswords',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
  ];

  const publications = ['NYT', 'USA Today', 'LA Times', 'WSJ', 'The Guardian', 'Universal'];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Animated background gradient */}
        <div className="absolute inset-0 animated-gradient opacity-90" />

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating shapes */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid h-full w-full grid-cols-12 grid-rows-8">
              {Array.from({ length: 96 }).map((_, i) => (
                <div
                  key={i}
                  className={`border border-white/20 ${Math.random() > 0.92 ? 'bg-white/30' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="container relative mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white/90 text-sm font-medium animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            Your #1 Crossword Companion
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <span className="text-white">Crossword</span>{" "}
            <span className="text-yellow-300">Central</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Your one-stop destination for daily crossword solutions,
            powerful solving tools, and expert crossword guides.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link
              href="/nyt-crosswords"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-gray-900 shadow-xl transition-all duration-300 hover:bg-yellow-300 hover:shadow-2xl hover:scale-105"
            >
              <Puzzle className="w-5 h-5" />
              Play Crossword
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/daily"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-white/30 hover:shadow-xl"
            >
              <CalendarDays className="w-5 h-5" />
              Daily Crosswords
            </Link>
          </div>

          <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <Link
              href="/solver"
              className="group inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300"
            >
              <Zap className="w-4 h-4" />
              <span className="border-b border-white/50 group-hover:border-white">Try our powerful Solver Tool</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
              Everything You Need
            </span>
            <h2 className="text-3xl font-bold text-gray-900 md:text-5xl mb-4">
              Powerful <span className="text-gradient">Crossword Tools</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              From daily solutions to advanced solving tools, we've got everything to make you a crossword master.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group card-premium hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Icon */}
                  <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  <div className="flex items-center gap-1 text-blue-600 font-medium group-hover:gap-2 transition-all">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
              Featured <span className="text-gradient-gold">Publications</span>
            </h2>
            <p className="text-gray-600">
              We cover solutions for all major crossword puzzles
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {publications.map((pub, index) => (
              <Link
                key={pub}
                href={`/daily/${pub.toLowerCase().replace(/\s+/g, '-')}/latest`}
                className="group flex flex-col items-center justify-center rounded-2xl bg-gray-50 p-6 text-center hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="mb-3 text-2xl font-bold text-blue-600 group-hover:text-white transition-colors">
                  {pub.split(' ').map(word => word.charAt(0)).join('')}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-white/90 transition-colors">
                  {pub}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700" />

        {/* Decorative circles */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
            Ready to Solve Any Crossword?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90">
            Our tools and solutions can help you with even the most challenging puzzles.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/solver"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-8 py-4 font-bold text-gray-900 shadow-xl transition-all duration-300 hover:bg-yellow-300 hover:shadow-2xl hover:scale-105"
            >
              <Wrench className="w-5 h-5" />
              Try the Solver
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/nyt-crosswords/random"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-white/30 hover:shadow-xl"
            >
              <Puzzle className="w-5 h-5" />
              Random NYT Puzzle
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}