import Link from "next/link";
import { CalendarDays, Database, Puzzle, Wrench, ArrowRight, Sparkles, Zap, HelpCircle, ChevronDown } from "lucide-react";

// FAQ data for SEO
const faqs = [
  {
    question: "How do I use the crossword solver?",
    answer: "Enter your crossword clue in the search box, select the word length if known, and add any letters you've already figured out. Our solver will find matching answers from our database of crossword solutions."
  },
  {
    question: "Where do the daily crossword answers come from?",
    answer: "We aggregate solutions from major publications including The New York Times, USA Today, LA Times, and more. Answers are updated daily to ensure you always have access to the latest puzzles."
  },
  {
    question: "Is the crossword solver free to use?",
    answer: "Yes! Our crossword solver and all daily solutions are completely free to use. No registration required."
  },
  {
    question: "Can I play old NYT crossword puzzles?",
    answer: "Absolutely! Our archive contains New York Times crosswords from 1977 to 2014, giving you access to thousands of classic puzzles to solve."
  },
  {
    question: "How accurate are the crossword answers?",
    answer: "Our solutions are sourced from verified crossword databases and are highly accurate. We cross-reference multiple sources to ensure reliability."
  }
];

export default function Home() {
  const features = [
    {
      icon: CalendarDays,
      title: 'Daily Solutions',
      abbr: 'NEW',
      description: 'Get answers for NYT, USA Today, LA Times, and other popular crosswords updated daily.',
      href: '/daily',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Wrench,
      title: 'Solver Tool',
      abbr: 'PRO',
      description: 'Find answers using clues, patterns, and letter hints with our powerful solver.',
      href: '/solver',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: Puzzle,
      title: 'Play Crossword',
      abbr: '10K+',
      description: 'Access every New York Times crossword since 1977 in our comprehensive archive.',
      href: '/nyt-crosswords',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: Database,
      title: 'Guides & Tips',
      abbr: 'FREE',
      description: 'Learn expert techniques and strategies to improve your crossword solving skills.',
      href: '/guides',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

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
            <span className="text-yellow-300">Solver</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Your one-stop destination for daily crossword solutions,
            powerful solving tools, and expert crossword guides.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link
              href="/solver"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-gray-900 shadow-xl transition-all duration-300 hover:bg-yellow-300 hover:shadow-2xl hover:scale-105"
            >
              <Wrench className="w-5 h-5" />
              Try Solver Tool
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
              href="/nyt-crosswords"
              className="group inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300"
            >
              <Puzzle className="w-4 h-4" />
              <span className="border-b border-white/50 group-hover:border-white">Play NYT Crosswords (1977-2014)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - New Premium Design */}
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

          {/* Premium Card Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up border border-gray-100"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Badge */}
                  <div className={`absolute top-4 right-4 bg-gradient-to-r ${feature.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10`}>
                    {feature.abbr}
                  </div>

                  {/* Colored header section */}
                  <div className="relative p-6 bg-gradient-to-br from-gray-50 to-white">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <Icon className="h-8 w-8" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mt-5 mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between p-4 bg-white border-t border-gray-100">
                    <span className="text-sm text-gray-500">Explore</span>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${feature.color} text-white group-hover:scale-110 transition-transform`}>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
                <HelpCircle className="w-4 h-4" />
                FAQ
              </span>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
                Frequently Asked <span className="text-gradient">Questions</span>
              </h2>
              <p className="text-gray-600">
                Everything you need to know about our crossword solver
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                    <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-5 pb-5 text-gray-600">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
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

      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Crossword Solver",
            "description": "Free online crossword solver and daily crossword answers. Find solutions for NYT, USA Today, LA Times and more.",
            "url": "https://crosswordsolver.com",
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1250"
            }
          })
        }}
      />

      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </>
  );
}