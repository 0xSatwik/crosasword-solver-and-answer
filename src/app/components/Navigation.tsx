import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="hidden md:block">
      <ul className="flex items-center space-x-1">
        {[
          { href: '/daily', label: 'Daily Crosswords' },
          { href: '/solver', label: 'Solver Tool' },
          { href: '/nyt-crosswords', label: 'Play Crossword' },
          { href: '/guides', label: 'Guides' }
        ].map((link) => (
          <li key={link.href}>
            <Link 
              href={link.href} 
              className="block px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700 rounded-md"
              prefetch={true}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
} 