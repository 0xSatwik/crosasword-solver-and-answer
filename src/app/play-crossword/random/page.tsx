import { redirect } from 'next/navigation';
import { getRandomPuzzleDate } from '../../../lib/nyt-crosswords';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RandomPuzzlePage() {
  const { year, month, day } = getRandomPuzzleDate();

  // Redirect to the random puzzle
  redirect(`/play-crossword/${year}/${month}/${day}`);

  // This component will never render as it redirects, but Next.js requires a component
  return null;
} 