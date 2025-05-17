import Link from "next/link";
import { CalendarDays, Database, Puzzle, Wrench } from "lucide-react";

export default function Home() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-blue-900 py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
            <span className="text-white">Crossword</span>{" "}
            <span className="text-yellow-300">Central</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-white/90 md:text-xl">
            Your one-stop destination for daily crossword solutions, 
            solving tools, and expert crossword guides.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/nyt-crosswords"
              className="w-full rounded-full bg-white px-6 py-3 font-medium text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl sm:w-auto"
            >
              Play Crossword
            </Link>
            <Link
              href="/daily"
              className="w-full rounded-full bg-blue-800 px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-blue-600 hover:shadow-xl sm:w-auto"
            >
              Daily Crosswords
            </Link>
          </div>
          
          <div className="mt-6">
            <Link
              href="/solver"
              className="inline-flex items-center rounded-full bg-blue-600 px-6 py-2 font-medium text-white shadow-lg transition-all hover:bg-blue-500"
            >
              Try Solver Tool
            </Link>
          </div>
        </div>

        {/* Grid pattern background */}
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="grid h-full w-full grid-cols-10 grid-rows-10">
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={i} 
                className={`border border-white/30 ${Math.random() > 0.85 ? 'bg-white' : ''}`}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Everything You Need For Crosswords
          </h2>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="group rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg hover:translate-y-[-5px]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CalendarDays className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Daily Solutions</h3>
              <p className="text-gray-600">
                Get answers for NYT, USA Today, LA Times, and other popular crosswords updated daily.
              </p>
              <Link href="/daily" className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-800">
                View Solutions →
              </Link>
            </div>
            
            {/* Feature 2 */}
            <div className="group rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg hover:translate-y-[-5px]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Solver Tool</h3>
              <p className="text-gray-600">
                Our advanced solver helps you find answers using clues, patterns, and letter hints.
              </p>
              <Link href="/solver" className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-800">
                Try Solver →
              </Link>
            </div>
            
            {/* Feature 3 */}
            <div className="group rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg hover:translate-y-[-5px]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <Puzzle className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Guides & Tips</h3>
              <p className="text-gray-600">
                Learn expert techniques and strategies to improve your crossword solving skills.
              </p>
              <Link href="/guides" className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-800">
                Read Guides →
              </Link>
            </div>
            
            {/* Feature 4 */}
            <div className="group rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg hover:translate-y-[-5px]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Play Crossword</h3>
              <p className="text-gray-600">
                Access every New York Times crossword since 1977 with our comprehensive archive.
              </p>
              <Link href="/nyt-crosswords" className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-800">
                Play Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Featured Publications
          </h2>
          <p className="mb-12 text-center text-gray-600">
            We cover solutions for all major crossword puzzles
          </p>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {['NYT', 'USA Today', 'LA Times', 'WSJ', 'The Guardian', 'Universal'].map((pub) => (
              <Link
                key={pub}
                href={`/daily/${pub.toLowerCase().replace(/\s+/g, '-')}/latest`}
                className="flex flex-col items-center justify-center rounded-lg bg-white p-6 text-center shadow-sm transition-all hover:bg-blue-50 hover:shadow-md hover:translate-y-[-3px]"
              >
                <div className="mb-2 text-xl font-bold text-blue-600">
                  {pub.split(' ').map(word => word.charAt(0)).join('')}
                </div>
                <span className="text-sm font-medium text-gray-800">{pub}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-900 py-16 text-white md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Ready to Solve Any Crossword?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Our tools and solutions can help you with even the most challenging puzzles.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/solver"
              className="w-full rounded-full bg-yellow-400 px-6 py-3 font-medium text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl sm:w-auto"
            >
              Try the Solver
            </Link>
            <Link
              href="/nyt-crosswords/random"
              className="w-full rounded-full bg-blue-700 px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-blue-600 hover:shadow-xl sm:w-auto"
            >
              Random NYT Puzzle
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 