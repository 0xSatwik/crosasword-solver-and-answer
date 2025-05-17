import Link from 'next/link';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold">
            <span className="text-blue-600">Crossword</span>
            <span className="text-yellow-500">Central</span>
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