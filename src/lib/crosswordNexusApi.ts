/**
 * API client for the Crossword Nexus API (Cloudflare Worker)
 */

// Replace with your deployed worker URL
const API_URL = 'https://crossword-solver-api.mitomat.workers.dev';

export interface CrosswordAnswer {
  word: string;
  rating: number;
}

export interface CrosswordApiResponse {
  success: boolean;
  answers: CrosswordAnswer[];
  source: string;
  error?: string;
}

/**
 * Fetch crossword answers for a clue
 * @param clue The crossword clue to search for
 * @param pattern Optional pattern for matching specific letters
 * @returns Promise with the API response
 */
export async function fetchCrosswordAnswers(
  clue: string,
  pattern: string = ''
): Promise<CrosswordApiResponse> {
  try {
    // Build the URL with query parameters
    const url = new URL(API_URL);
    url.searchParams.append('clue', clue);
    if (pattern) {
      url.searchParams.append('pattern', pattern);
    }

    // Make the request
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching crossword answers:', error);
    return {
      success: false,
      answers: [],
      source: 'crosswordnexus.com',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generate a pattern string from letter boxes
 * @param letterBoxes Array of letters (empty string for unknown letters)
 * @returns Pattern string (e.g., "a?s" for ["a", "", "s"])
 */
export function generatePattern(letterBoxes: string[]): string {
  return letterBoxes.map(letter => letter || '?').join('');
} 