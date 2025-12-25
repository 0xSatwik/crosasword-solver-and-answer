'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100'
        : 'bg-white/80 backdrop-blur-md'
        }`}
    >
      {/* Decorative gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />

      <div className="container mx-auto flex h-18 items-center justify-between px-4 py-4 md:px-6">
        {/* Logo with premium styling */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
        >
          {/* Logo icon */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-105">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          {/* Logo text */}
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-gradient">Crossword</span>
            <span className="text-gradient-gold">Solver</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Navigation />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}