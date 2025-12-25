/**
 * API client for the Crossword Archive API
 */

const API_URL = 'https://crossword-archive-worker.mitomat.workers.dev';

export interface ClueHistoryItem {
  clue_id: number;
  puzzle_id: number;
  number: number;
  direction: string;
  clue_text: string;
  answer: string;
  date: string;
  title: string;
}

// Add formatted fields for display
export interface FormattedClueHistoryItem extends ClueHistoryItem {
  formatted_date: string;
  day_of_week: string;
}

export interface ClueHistoryResponse {
  success: boolean;
  data: FormattedClueHistoryItem[];
  timestamp: string;
}

// API raw response structure
interface ApiRawResponse {
  success: boolean;
  data: {
    query: string;
    count: number;
    results: ClueHistoryItem[];
  };
}

/**
 * Format a date string to a readable format
 */
function formatDate(dateString: string): { formatted: string; dayOfWeek: string } {
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const formatted = date.toLocaleDateString('en-US', options);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    return { formatted, dayOfWeek };
  } catch {
    return { formatted: dateString, dayOfWeek: '' };
  }
}

/**
 * Normalize clue text for comparison (lowercase, trim, normalize whitespace)
 */
function normalizeClueText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Search for historical clues by text
 * @param clueText The clue text to search for
 * @param exactMatch If true, filter to only exact matches
 * @returns Promise with the API response
 */
export async function searchClueHistory(
  clueText: string,
  exactMatch: boolean = true
): Promise<ClueHistoryResponse> {
  try {
    // Build the URL with query parameters
    const url = new URL(`${API_URL}/api/search/clue`);
    url.searchParams.append('q', clueText);

    // Make the request
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const rawData: ApiRawResponse = await response.json();

    if (!rawData.success || !rawData.data || !rawData.data.results) {
      return {
        success: false,
        data: [],
        timestamp: new Date().toISOString()
      };
    }

    // Get results from the nested structure
    let results = rawData.data.results;

    // Filter to exact matches if requested
    if (exactMatch) {
      const normalizedQuery = normalizeClueText(clueText);
      results = results.filter(item =>
        normalizeClueText(item.clue_text) === normalizedQuery
      );
    }

    // Format the results with readable dates
    const formattedResults: FormattedClueHistoryItem[] = results.map(item => {
      const { formatted, dayOfWeek } = formatDate(item.date);
      return {
        ...item,
        formatted_date: formatted,
        day_of_week: dayOfWeek
      };
    });

    return {
      success: true,
      data: formattedResults,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching clue history:', error);
    return {
      success: false,
      data: [],
      timestamp: new Date().toISOString()
    };
  }
}