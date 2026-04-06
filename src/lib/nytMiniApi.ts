/**
 * API client for the NYT Mini Crossword Archive API
 * Base URL: https://nyt-mini-archive.nytsolver.workers.dev
 */

const API_URL = 'https://nyt-mini-archive.nytsolver.workers.dev';

// Types for Mini API responses
export interface MiniClue {
    direction: string;
    number: string;
    clue: string;
    answer: string;
}

export interface MiniPuzzleData {
    across: Record<string, { clue: string; answer: string }>;
    down: Record<string, { clue: string; answer: string }>;
}

export interface MiniTodayResponse {
    success: boolean;
    date: string;
    formatted: string;
    data: MiniPuzzleData;
    clues: MiniClue[];
}

export interface MiniDateResponse {
    success: boolean;
    date: string;
    formatted: string;
    data: MiniPuzzleData;
    clues: MiniClue[];
}

export interface MiniListItem {
    date: string;
}

export interface MiniListResponse {
    success: boolean;
    page: number;
    limit: number;
    total: number;
    dates: string[];
}

export interface MiniClueMatch {
    date: string;
    direction: string;
    number: string;
    clue: string;
    answer: string;
}

export interface MiniClueSearchResponse {
    success: boolean;
    count: number;
    matches: MiniClueMatch[];
}

/**
 * Format a date string to a readable format
 */
export function formatMiniDate(dateString: string): { formatted: string; dayOfWeek: string } {
    try {
        const date = new Date(dateString + 'T00:00:00');
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
 * Fetch today's mini puzzle
 */
export async function fetchMiniToday(): Promise<MiniTodayResponse | null> {
    try {
        const response = await fetch(`${API_URL}/today`, {
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error('Failed to fetch today\'s mini puzzle');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching today\'s mini puzzle:', error);
        return null;
    }
}

/**
 * Fetch mini puzzle by date
 * @param date Date in YYYY-MM-DD format
 */
export async function fetchMiniByDate(date: string): Promise<MiniDateResponse | null> {
    try {
        const response = await fetch(`${API_URL}/date?date=${date}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Failed to fetch mini puzzle for ${date}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching mini puzzle for ${date}:`, error);
        return null;
    }
}

/**
 * Fetch paginated list of available dates
 */
export async function fetchMiniList(page: number = 1, limit: number = 50): Promise<MiniListResponse | null> {
    try {
        const response = await fetch(`${API_URL}/list?page=${page}&limit=${limit}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error('Failed to fetch mini puzzle list');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching mini puzzle list:', error);
        return null;
    }
}

/**
 * Search for clues matching a query
 */
export async function searchMiniClues(
    query: string,
    mode: 'contains' | 'exact' = 'contains'
): Promise<MiniClueSearchResponse | null> {
    try {
        const response = await fetch(`${API_URL}/clue?q=${encodeURIComponent(query)}&mode=${mode}`);

        if (!response.ok) {
            throw new Error('Failed to search mini clues');
        }

        return await response.json();
    } catch (error) {
        console.error('Error searching mini clues:', error);
        return null;
    }
}
