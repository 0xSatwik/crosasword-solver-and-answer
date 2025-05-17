"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function MobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(!mobileMenuOpen);
  }, [mobileMenuOpen]);

  const menuItems = [
    { href: '/daily', label: 'Daily Crosswords' },
    { href: '/solver', label: 'Solver Tool' },
    { href: '/nyt-crosswords', label: 'Play Crossword' },
    { href: '/guides', label: 'Guides' }
  ];

  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button 
        onClick={toggleMobileMenu}
        className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile menu dropdown with animation */}
      <div 
        className={`fixed inset-0 z-50 transform bg-white ${
          mobileMenuOpen 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full opacity-0'
        } transition-all duration-300 ease-in-out md:hidden`}
        style={{ top: '65px' }}
      >
        <div className="h-full overflow-y-auto px-6 py-6">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="block rounded-lg py-3 text-lg font-medium text-gray-900 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => setMobileMenuOpen(false)}
                  prefetch={true}
                >
                  {item.label}
                </Link>
                <div className="mt-2 h-px w-full bg-gray-100" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 