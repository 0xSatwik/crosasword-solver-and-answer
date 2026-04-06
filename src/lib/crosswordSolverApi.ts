import type { FormattedClueHistoryItem } from './crosswordArchiveApi';
import type { MiniClueMatch } from './nytMiniApi';

const API_URL = 'https://crossword-solver-api.mitomat.workers.dev';

export interface SolverAnswer {
  word: string;
  score: number;
  rating?: number;
  source: string;
  frequency?: number;
  daily_count?: number;
  mini_count?: number;
  last_seen?: string;
  sources?: string[];
}

export interface SolverHistory {
  daily: FormattedClueHistoryItem[];
  mini: MiniClueMatch[];
}

export interface SolverApiResponse {
  success: boolean;
  source: 'internal' | 'crosswordnexus' | 'datamuse';
  used_fallback: boolean;
  answers: SolverAnswer[];
  history: SolverHistory;
  clue: string;
  normalized_clue: string;
  pattern: string;
  timestamp: string;
  error?: string;
}

export async function solveCrosswordClue(
  clue: string,
  pattern: string = ''
): Promise<SolverApiResponse> {
  const url = new URL('/solve', API_URL);
  url.searchParams.set('clue', clue);

  if (pattern) {
    url.searchParams.set('pattern', pattern);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Solver API request failed with status ${response.status}`);
  }

  return response.json();
}
