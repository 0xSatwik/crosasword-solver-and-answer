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
  formatted_date: string;
  day_of_week: string;
  title: string;
}

export interface ClueHistoryResponse {
  success: boolean;
  data: ClueHistoryItem[];
  timestamp: string;
}

/**
 * Search for historical clues by text
 * @param clueText The clue text to search for
 * @returns Promise with the API response
 */
export async function searchClueHistory(
  clueText: string
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching clue history:', error);
    return {
      success: false,
      data: [],
      timestamp: new Date().toISOString()
    };
  }
} 