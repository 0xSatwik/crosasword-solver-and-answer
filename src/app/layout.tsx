import React from 'react';
import Link from 'next/link';
import './globals.css';
import Header from './components/Header';
import LoadingIndicator from './components/LoadingIndicator';

export const metadata = {
  title: 'Crossword Central - Solutions, Tools & Guides',
  description: 'Your one-stop destination for daily crossword solutions, solving tools, and expert crossword guides.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <LoadingIndicator />
        <Header />
        
        {children}
        
        <footer className="border-t border-gray-200 bg-white">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {/* Logo and About */}
              <div>
                <div className="mb-4 text-xl font-bold text-blue-700">
                  Crossword<span className="text-yellow-500">Central</span>
                </div>
                <p className="text-gray-600">
                  Your one-stop destination for daily crossword solutions and tools.
                </p>
              </div>
              
              {/* Quick Links */}
              <div>
                <h3 className="mb-4 font-semibold text-gray-900">Quick Links</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <Link href="/daily" className="hover:text-blue-700">
                      Daily Solutions
                    </Link>
                  </li>
                  <li>
                    <Link href="/solver" className="hover:text-blue-700">
                      Solver Tool
                    </Link>
                  </li>
                  <li>
                    <Link href="/nyt-crosswords" className="hover:text-blue-700">
                      Play Crossword
                    </Link>
                  </li>
                  <li>
                    <Link href="/guides" className="hover:text-blue-700">
                      Guides & Tips
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Publications */}
              <div>
                <h3 className="mb-4 font-semibold text-gray-900">Publications</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <Link href="/daily/nyt-daily/latest" className="hover:text-blue-700">
                      NYT Crossword
                    </Link>
                  </li>
                  <li>
                    <Link href="/nyt-crosswords/random" className="hover:text-blue-700">
                      Random NYT Puzzle
                    </Link>
                  </li>
                  <li>
                    <Link href="/daily/usa-today/latest" className="hover:text-blue-700">
                      USA Today
                    </Link>
                  </li>
                  <li>
                    <Link href="/daily/la-times/latest" className="hover:text-blue-700">
                      LA Times
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Legal */}
              <div>
                <h3 className="mb-4 font-semibold text-gray-900">Legal</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <Link href="/privacy" className="hover:text-blue-700">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-blue-700">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-blue-700">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-8 text-center">
              <p className="text-gray-600">
                © {new Date().getFullYear()} Crossword Central. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
} 