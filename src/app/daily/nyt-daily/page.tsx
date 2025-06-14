import { Metadata } from 'next';
import Link from 'next/link';
import { 
  CalendarIcon, 
  UserIcon,
  EditIcon,
  InfoIcon,
  PlayIcon,
  ArrowLeftIcon,
  ArchiveIcon
} from 'lucide-react';

// The public URL of the site where today.json is hosted.
// For production, it's best to set NEXT_PUBLIC_SITE_URL in your environment variables.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://crossword-solver-new.vercel.app';

// Fetch crossword data from the static today.json file
async function fetchLatestCrossword() {
  try {
    // Fetch from the public URL of the site
    const response = await fetch(`${SITE_URL}/today.json`, { 
      next: { revalidate: 60 } // Revalidate every minute
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch today.json (status: ${response.status})`);
    }
    
    const data = await response.json();

    // Basic validation to ensure the file is not empty or malformed
    if (!data?.puzzle?.date) {
      console.error("Fetched today.json is invalid or empty.");
      return null;
    }
    
    // Get today's date in YYYY-MM-DD format for comparison
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    return { 
      data: data,
      // A flag to indicate if the puzzle data is for a day other than today
      isStale: data.puzzle.date !== todayStr,
      actualDate: data.puzzle.date
    };

  } catch (error) {
    console.error(`Error fetching latest crossword from today.json:`, error);
    return null;
  }
}

// Format date for display
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export const metadata: Metadata = {
  title: 'NYT Daily Crossword | Crossword Central',
  description: 'Today\'s New York Times crossword puzzle with solutions - updated daily at 5am IST.',
};

export default async function NytDailyPage() {
  // Fetch crossword data from the static file
  const result = await fetchLatestCrossword();
  
  // If no data is available, show a message instead of 404
  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6">
              <Link 
                href="/daily"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <ArrowLeftIcon className="mr-1 h-4 w-4" />
                Back to Daily Crosswords
              </Link>
            </div>
            
            <div className="rounded-xl bg-white p-6 shadow-xl text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">NYT Daily Crossword</h1>
              <div className="p-8 bg-gray-50 rounded-lg mb-6">
                <p className="text-gray-700 mb-4">Sorry, we couldn't load today's crossword puzzle.</p>
                <p className="text-gray-600">Our system automatically checks for new puzzles at 5am IST daily.</p>
              </div>
              <Link 
                href="/daily/nyt-archive"
                className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
              >
                <ArchiveIcon className="mr-2 h-4 w-4" />
                Browse Puzzle Archive
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const { data, isStale, actualDate } = result;
  const { puzzle, across, down } = data;
  
  // Format dates for display
  const displayDate = formatDate(puzzle.date);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* Back to Daily */}
          <div className="mb-6">
            <Link 
              href="/daily"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <ArrowLeftIcon className="mr-1 h-4 w-4" />
              Back to Daily Crosswords
            </Link>
          </div>

          {/* Header with Puzzle Info */}
          <div className="mb-8 rounded-xl bg-white p-6 shadow-xl">
            {isStale && (
              <div className="mb-4 rounded-md bg-yellow-100 p-3 text-sm text-yellow-800">
                <strong>Note:</strong> Today's crossword is not yet available. 
                Showing the most recent puzzle from {formatDate(actualDate)}.
              </div>
            )}
            
            <div className="text-center">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
                New York Times
              </span>
              <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                {puzzle.title}
              </h1>
              <div className="mt-2 flex items-center justify-center text-gray-600">
                <CalendarIcon className="mr-2 h-5 w-5" />
                <span className="font-medium">{displayDate}</span>
                <span className="mx-2">•</span>
                <span>{puzzle.day_of_week}</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 md:grid-cols-2">
              <div className="flex items-start space-x-3">
                <UserIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Author</h3>
                  <p className="text-gray-900">{puzzle.author}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <EditIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Editor</h3>
                  <p className="text-gray-900">{puzzle.editor}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-center sm:space-y-0 sm:space-x-4">
            <Link
              href="/daily/nyt-archive"
              className="flex items-center rounded-full bg-purple-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-purple-700 hover:shadow-lg"
            >
              <ArchiveIcon className="mr-2 h-4 w-4" />
              Browse Puzzle Archive
            </Link>
            
            <Link
              href={`/nyt-crosswords/${actualDate.split('-')[0]}/${actualDate.split('-')[1]}/${actualDate.split('-')[2]}`}
              className="flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              <PlayIcon className="mr-2 h-4 w-4" />
              Play This Puzzle
            </Link>
          </div>
          
          {/* Clues Section */}
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Across Clues */}
            <div className="rounded-lg bg-blue-50 p-4 shadow-inner">
              <h3 className="mb-4 border-b border-blue-200 pb-2 text-xl font-semibold text-blue-900">
                Across
              </h3>
              <div className="space-y-3">
                {across.map((clue, idx) => (
                  <div key={`across-${idx}`} className="rounded-md bg-white p-3 shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-col">
                      <div className="flex items-start">
                        <span className="mr-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-sm font-semibold text-blue-800">
                          {clue.number}
                        </span>
                        <div className="flex-1">
                          <span className="text-gray-800">{clue.clue_text}</span>
                          <div className="mt-2 flex justify-end">
                            <span className="rounded-md bg-blue-100 px-2 py-1 font-mono font-bold text-blue-800">
                              {clue.answer || "Not available"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Down Clues */}
            <div className="rounded-lg bg-green-50 p-4 shadow-inner">
              <h3 className="mb-4 border-b border-green-200 pb-2 text-xl font-semibold text-green-900">
                Down
              </h3>
              <div className="space-y-3">
                {down.map((clue, idx) => (
                  <div key={`down-${idx}`} className="rounded-md bg-white p-3 shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-col">
                      <div className="flex items-start">
                        <span className="mr-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-sm font-semibold text-green-800">
                          {clue.number}
                        </span>
                        <div className="flex-1">
                          <span className="text-gray-800">{clue.clue_text}</span>
                          <div className="mt-2 flex justify-end">
                            <span className="rounded-md bg-green-100 px-2 py-1 font-mono font-bold text-green-800">
                              {clue.answer || "Not available"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* API Source Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Data sourced from the Crossword Archive API.</p>
            <p className="mt-1">Updated daily at 5am IST.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 