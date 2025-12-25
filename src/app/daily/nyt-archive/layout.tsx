import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NYT Crossword Archive | Crossword Solver',
  description: 'Browse and access New York Times crossword puzzles from our archive - dating back to 1977.',
};

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 