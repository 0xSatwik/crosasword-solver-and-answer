// Types for NYT Crossword API
export interface NYTCrosswordPuzzle {
  acrossmap: number[] | null;
  admin: boolean;
  answers: {
    across: string[];
    down: string[];
  };
  author: string;
  autowrap: boolean | null;
  bbars: boolean | null;
  circles: boolean | null;
  clues: {
    across: string[];
    down: string[];
  };
  code: string | null;
  copyright: string;
  date: string;
  dow: string;
  downmap: any | null;
  editor: string;
  grid: string[];
  gridnums: number[];
  hastitle: boolean;
  hold: boolean | null;
  id: string | null;
  id2: string | null;
  interpretcolors: boolean | null;
  jnotes: string | null;
  key: string | null;
  mini: boolean | null;
  notepad: string | null;
  publisher: string;
  rbars: boolean | null;
  shadecircles: boolean | null;
  size: {
    cols: number;
    rows: number;
  };
  title: string;
  track: boolean | null;
  type: string | null;
  uniclue: boolean;
}

interface DateParams {
  year: string;
  month: string;
  day: string;
}

// Cache for already fetched puzzles to avoid redundant API calls
const puzzleCache = new Map<string, NYTCrosswordPuzzle>();

/**
 * Validates if a date is within the available archive range (1977-01-01 to 2014-12-31)
 */
export function isDateInRange(year: number, month: number, day: number): boolean {
  // Create date objects for the bounds and the target date
  const lowerBound = new Date(1977, 0, 1); // Jan 1, 1977
  const upperBound = new Date(2014, 11, 31); // Dec 31, 2014
  const targetDate = new Date(year, month - 1, day);
  
  // Check if the date is within bounds
  return targetDate >= lowerBound && targetDate <= upperBound;
}

/**
 * Fetches a crossword puzzle from the NYT Crosswords GitHub repository
 * 
 * @param year - Year of the puzzle (YYYY)
 * @param month - Month of the puzzle (MM)
 * @param day - Day of the puzzle (DD)
 * @returns The crossword puzzle data or null if not found
 */
export async function fetchCrosswordPuzzle({ year, month, day }: DateParams): Promise<NYTCrosswordPuzzle | null> {
  const cacheKey = `${year}-${month}-${day}`;
  
  // Check if we have this puzzle in the cache
  if (puzzleCache.has(cacheKey)) {
    return puzzleCache.get(cacheKey) || null;
  }
  
  // Validate date is within archive range
  if (!isDateInRange(parseInt(year), parseInt(month), parseInt(day))) {
    console.error(`Date ${year}-${month}-${day} is outside the available archive range (1977-01-01 to 2014-12-31)`);
    return null;
  }

  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/doshea/nyt_crosswords/master/${year}/${month}/${day}.json`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!response.ok) {
      console.error(`Failed to fetch puzzle for ${year}-${month}-${day}: ${response.status} ${response.statusText}`);
      return null;
    }

    const puzzle = await response.json() as NYTCrosswordPuzzle;
    
    // Store in cache
    puzzleCache.set(cacheKey, puzzle);
    
    return puzzle;
  } catch (error) {
    console.error(`Error fetching puzzle for ${year}-${month}-${day}:`, error);
    return null;
  }
}

/**
 * Generates a random date between Jan 1, 1977 and Dec 31, 2014
 * Avoids known gap periods in the dataset
 */
export function getRandomPuzzleDate(): DateParams {
  const start = new Date(1977, 0, 1).getTime(); // Jan 1, 1977
  const end = new Date(2014, 11, 31).getTime(); // Dec 31, 2014
  
  // Keep generating dates until we find one not in a gap period
  while (true) {
    const randomTimestamp = start + Math.random() * (end - start);
    const randomDate = new Date(randomTimestamp);
    
    const year = randomDate.getFullYear();
    const month = randomDate.getMonth() + 1;
    const day = randomDate.getDate();
    
    // Avoid known gap periods
    // 1978: Aug 10 - Nov 5
    if (year === 1978 && 
        ((month === 8 && day >= 10) || 
         month === 9 || 
         month === 10 || 
         (month === 11 && day <= 5))) {
      continue;
    }
    
    // Format as strings with leading zeros
    const formattedYear = year.toString();
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    
    return {
      year: formattedYear,
      month: formattedMonth,
      day: formattedDay
    };
  }
}

/**
 * Format date as Month D, YYYY (e.g., January 1, 1977)
 */
export function formatPuzzleDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('/');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Get day of the week for a specific date
 */
export function getDayOfWeek(dateStr: string): string {
  const [year, month, day] = dateStr.split('/');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  return date.toLocaleDateString('en-US', { weekday: 'long' });
} 