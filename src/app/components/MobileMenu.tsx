"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Wrench, Puzzle, BookOpen, Search, X, Menu } from 'lucide-react';
import { createPortal } from 'react-dom';

const menuItems = [
  { href: '/', label: 'Home', icon: Home, description: 'Back to homepage' },
  { href: "/daily", label: 'Daily Crosswords', icon: Calendar, description: 'Today\'s puzzles' },
  { href: '/solver', label: 'Solver Tool', icon: Wrench, description: 'Find answers' },
  { href: "/play-crossword", label: 'Play Crossword', icon: Puzzle, description: 'Interactive puzzles' },
  { href: '/guides', label: 'Guides', icon: BookOpen, description: 'Tips & tricks' }
];

function MobileMenuPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button - visible only on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Full Screen Mobile Menu - rendered via portal to escape any parent stacking context */}
      {isOpen && (
        <MobileMenuPortal>
          <div
            className="md:hidden"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99999,
            }}
          >
            {/* Solid Background - NOT transparent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)',
              }}
            />

            {/* Decorative Pattern Overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Content Container */}
            <div
              style={{
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header with Close Button */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderBottom: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Puzzle className="w-5 h-5 text-white" />
                  </div>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                    Menu
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href ||
                      (item.href !== '/' && pathname?.startsWith(item.href));

                    return (
                      <li key={item.href} style={{ marginBottom: '8px' }}>
                        <Link
                          href={item.href}
                          onClick={handleClose}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px',
                            borderRadius: '16px',
                            background: isActive ? 'white' : 'rgba(255,255,255,0.15)',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                          }}
                        >
                          <div
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isActive
                                ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                                : 'rgba(255,255,255,0.2)',
                            }}
                          >
                            <Icon
                              className="w-6 h-6"
                              style={{ color: 'white' }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: '18px',
                                color: isActive ? '#1f2937' : 'white',
                              }}
                            >
                              {item.label}
                            </div>
                            <div
                              style={{
                                fontSize: '14px',
                                color: isActive ? '#6b7280' : 'rgba(255,255,255,0.7)',
                              }}
                            >
                              {item.description}
                            </div>
                          </div>
                          {isActive && (
                            <div
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#22c55e',
                              }}
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Footer with CTA */}
              <div
                style={{
                  padding: '16px',
                  borderTop: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <Link
                  href="/solver"
                  onClick={handleClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '16px 24px',
                    background: 'white',
                    color: '#1f2937',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                  }}
                >
                  <Search className="w-5 h-5" />
                  <span>Quick Solve</span>
                </Link>

                <p
                  style={{
                    marginTop: '16px',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '12px',
                  }}
                >
                  © 2024 Crossword Solver
                </p>
              </div>
            </div>
          </div>
        </MobileMenuPortal>
      )}
    </>
  );
}