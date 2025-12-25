"use client";

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Calendar, Wrench, Puzzle, BookOpen } from 'lucide-react';

export default function MobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(!mobileMenuOpen);
  }, [mobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/daily', label: 'Daily Crosswords', icon: Calendar },
    { href: '/solver', label: 'Solver Tool', icon: Wrench },
    { href: '/nyt-crosswords', label: 'Play Crossword', icon: Puzzle },
    { href: '/guides', label: 'Guides', icon: BookOpen }
  ];

  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className={`relative z-50 rounded-xl p-2.5 transition-all duration-300 ${mobileMenuOpen
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
            : 'text-gray-700 hover:bg-gray-100'
          }`}
        aria-label="Toggle mobile menu"
      >
        <div className="relative w-6 h-6">
          <span className={`absolute top-1 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
            }`} />
          <span className={`absolute top-3 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : ''
            }`} />
          <span className={`absolute top-5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`} />
        </div>
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={`fixed top-0 right-0 z-40 h-full w-80 max-w-[85vw] transform bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500" />

        <div className="h-full overflow-y-auto px-6 py-24">
          {/* Menu header */}
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Navigation</p>
          </div>

          {/* Menu items */}
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

              return (
                <li
                  key={item.href}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-4 rounded-xl px-4 py-4 text-lg font-medium transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                    prefetch={true}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA Section */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <Link
              href="/solver"
              className="block w-full text-center py-4 px-6 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              onClick={() => setMobileMenuOpen(false)}
            >
              🔍 Try Solver Tool
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}