'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/daily', label: 'Daily Crosswords' },
    { href: '/solver', label: 'Solver Tool' },
    { href: '/nyt-mini-solver', label: 'NYT Mini Solver' },
    { href: '/archive', label: 'Archive' }
  ];

  return (
    <nav className="hidden md:block">
      <ul className="flex items-center gap-1">
        {navItems.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative block px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-300
                  ${isActive
                    ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }
                `}
                prefetch={true}
              >
                {link.label}

                {/* Hover underline effect for non-active items */}
                {!isActive && (
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 -translate-x-1/2 group-hover:w-full" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}