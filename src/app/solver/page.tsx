'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, XIcon, PlusIcon, MinusIcon, CalendarIcon } from 'lucide-react';
import { fetchCrosswordAnswers, generatePattern } from '../../lib/crosswordNexusApi';
import { searchClueHistory, ClueHistoryItem } from '../../lib/crosswordArchiveApi';

export default function SolverPage() {
  // State for the solver
  const [clue, setClue] = useState('');
  const [selectedLength, setSelectedLength] = useState<number | null>(null);
  const [letterBoxes, setLetterBoxes] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [clueHistory, setClueHistory] = useState<ClueHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  
  // References
  const clueInputRef = useRef<HTMLInputElement>(null);
  
  // API URLs
  const DATAMUSE_API_URL = 'https://api.datamuse.com/words';
  
  // Update letter boxes when length changes
  useEffect(() => {
    if (selectedLength) {
      setLetterBoxes(Array(selectedLength).fill(''));
    } else {
      setLetterBoxes([]);
    }
  }, [selectedLength]);
  
  // Handle letter input change
  const handleLetterChange = (index: number, value: string) => {
    const newLetterBoxes = [...letterBoxes];
    newLetterBoxes[index] = value.toLowerCase();
    setLetterBoxes(newLetterBoxes);
  };
  
  // Convert letter boxes to pattern
  const getPatternFromLetters = () => {
    return letterBoxes.map(letter => letter || '?').join('');
  };
  
  // Find top-rated results
  const getTopRatedResults = (results: any[], isNexusData: boolean = true) => {
    if (results.length === 0) return [];
    
    // For Crossword Nexus results, find all with the highest rating
    if (isNexusData) {
      const maxRating = Math.max(...results.map(r => r.rating || Math.floor(r.score / 100)));
      return results.filter(r => (r.rating || Math.floor(r.score / 100)) === maxRating);
    } 
    
    // For Datamuse, just return the top result
    return [results[0]];
  };
  
  // Search for historical clue data
  const fetchClueHistory = async (clueText: string) => {
    setHistoryLoading(true);
    try {
      const response = await searchClueHistory(clueText);
      if (response.success && response.data.length > 0) {
        setClueHistory(response.data);
      } else {
        setClueHistory([]);
      }
    } catch (error) {
      console.error('Error fetching clue history:', error);
      setClueHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };
  
  // Try Datamuse as a fallback
  const tryDatamuseFallback = async () => {
    try {
      // Build the API URL
      let apiUrl = `${DATAMUSE_API_URL}?ml=${encodeURIComponent(clue)}&max=100`;
      
      // Add pattern parameter if we have letter boxes
      if (letterBoxes.length > 0 && !showAll && selectedLength) {
        const pattern = getPatternFromLetters();
        apiUrl += `&sp=${encodeURIComponent(pattern)}`;
      }
      
      // Make API request to Datamuse
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setLoading(false);
      setUsingFallback(true);
      
      if (data && data.length > 0) {
        // Filter by length if needed
        let filteredResults = data;
        if (selectedLength && !showAll) {
          filteredResults = data.filter((item: any) => item.word.length === selectedLength);
        }
        
        // Sort results by score (higher first)
        filteredResults.sort((a: any, b: any) => b.score - a.score);
        
        // Set results
        setResults(filteredResults);
      } else {
        setResults([]);
        setError('No matching words found. Try a different clue or letter pattern.');
      }
    } catch (error) {
      setLoading(false);
      setError('Error fetching results: ' + (error instanceof Error ? error.message : 'Unknown error'));
      console.error('Error:', error);
    }
  };
  
  // Search function
  const searchCrossword = async () => {
    // Validate input
    if (!clue) {
      setError('Please enter a clue');
      return;
    }
    
    // Clear previous error and state
    setError('');
    setLoading(true);
    setClueHistory([]);
    setUsingFallback(false);
    
    // Fetch historical clue data
    fetchClueHistory(clue);
    
    try {
      // First try Crossword Nexus API (via our Cloudflare Worker)
      const pattern = selectedLength && !showAll ? getPatternFromLetters() : '';
      const response = await fetchCrosswordAnswers(clue, pattern);
      
      if (response.success && response.answers.length > 0) {
        setLoading(false);
        
        // Map the response to match our expected format but preserve rating
        const formattedResults = response.answers.map(answer => ({
          word: answer.word,
          score: answer.rating * 100, // Store rating as score * 100 for consistency
          rating: answer.rating // Keep original rating
        }));
        
        setResults(formattedResults);
      } else {
        // If no results from Crossword Nexus, try Datamuse as fallback
        await tryDatamuseFallback();
      }
    } catch (error) {
      // If an error occurred with Crossword Nexus, try Datamuse
      await tryDatamuseFallback();
    }
  };
  
  // Handle clicking outside of input
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        clueInputRef.current && 
        !clueInputRef.current.contains(e.target as Node)
      ) {
        // Handle any click outside of input if needed
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Increment/decrement selected length
  const incrementLength = () => {
    if (selectedLength === null) {
      setSelectedLength(1);
    } else if (selectedLength < 15) {
      setSelectedLength(selectedLength + 1);
    }
    setShowAll(false);
  };
  
  const decrementLength = () => {
    if (selectedLength && selectedLength > 1) {
      setSelectedLength(selectedLength - 1);
    }
    setShowAll(false);
  };
  
  // Length options for the first screenshot style
  const lengthOptions = [2, 3, 4, 5, 6, 7, 8, 9, '10+'];
  
  // Group results by word length
  const groupResultsByLength = () => {
    const grouped: { [key: number]: any[] } = {};
    
    results.forEach(result => {
      const length = result.word.length;
      if (!grouped[length]) {
        grouped[length] = [];
      }
      grouped[length].push(result);
    });
    
    return grouped;
  };
  
  const groupedResults = groupResultsByLength();
  const topResults = getTopRatedResults(results, !usingFallback);
  
  return (
    <div className="container mx-auto px-2 py-4 sm:px-2 sm:py-6">
      <div className="mx-auto max-w-2xl bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Crossword Solver
        </h1>
        
        {/* Clue input */}
        <div className="mb-4">
          <label htmlFor="clue" className="mb-2 block text-sm font-medium text-gray-700">
            Clue
          </label>
          <div className="relative">
            <input
              ref={clueInputRef}
              type="text"
              id="clue"
              className="w-full rounded-md border-2 border-orange-400 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Clue?"
              value={clue}
              onChange={(e) => setClue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchCrossword();
                }
              }}
            />
            {clue && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setClue('');
                }}
              >
                <XIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Show All Toggle */}
        <div className="mb-4">
          <button
            className={`text-sm text-orange-500 font-medium ${showAll ? 'underline' : ''}`}
            onClick={() => {
              setShowAll(!showAll);
              if (!showAll) {
                setSelectedLength(null);
                setLetterBoxes([]);
              }
            }}
          >
            {showAll ? "[x] show all" : "[ ] show all"}
          </button>
        </div>
        
        {/* Letter Boxes or Length Selection */}
        {!showAll && (
          <div className="mb-4">
            {selectedLength ? (
              /* Letter Boxes */
              <div className="flex items-center gap-1 justify-center">
                <button 
                  className="h-10 w-10 bg-orange-500 text-white flex items-center justify-center rounded-md"
                  onClick={decrementLength}
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
                
                {letterBoxes.map((letter, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">{index + 1}</div>
                    <input
                      type="text"
                      maxLength={1}
                      className="h-10 w-10 border border-gray-300 rounded-md text-center text-lg font-medium"
                      value={letter}
                      onChange={(e) => handleLetterChange(index, e.target.value)}
                      placeholder="?"
                    />
                  </div>
                ))}
                
                <button 
                  className="h-10 w-10 bg-orange-500 text-white flex items-center justify-center rounded-md"
                  onClick={incrementLength}
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              /* Length Selection */
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Enter length and letters
                </label>
                <div className="flex border border-gray-300">
                  {lengthOptions.map((length, index) => (
                    <button
                      key={length}
                      className={`py-2 flex-1 text-center ${
                        index < lengthOptions.length - 1 ? 'border-r border-gray-300' : ''
                      } hover:bg-gray-100`}
                      onClick={() => {
                        if (length === '10+') {
                          setSelectedLength(10);
                        } else {
                          setSelectedLength(length as number);
                        }
                      }}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Search button */}
        <div className="mb-6">
          <button
            className="w-full rounded-md bg-orange-500 py-3 font-medium text-white hover:bg-orange-600 flex items-center justify-center gap-2"
            onClick={searchCrossword}
          >
            <SearchIcon className="h-5 w-5" />
            SOLVE THE CLUE
          </button>
        </div>
        
        {/* Data source indicator (only shown when fallback is used) */}
        {usingFallback && results.length > 0 && (
          <div className="mb-4 rounded-md bg-amber-50 p-3 text-amber-700 text-sm">
            Using Datamuse data (fallback source)
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700 text-sm">
            {error}
          </div>
        )}
        
        {/* Loading indicator */}
        {loading && (
          <div className="my-4 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <span className="ml-3">Searching...</span>
          </div>
        )}
        
        {/* Crossword Archive Results */}
        {!loading && clueHistory.length > 0 && (
          <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-blue-900">
                Historical Clue Data
              </h2>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                Crossword Archive
              </span>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {clueHistory.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-md border border-blue-100 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="mb-2 sm:mb-0">
                    <div className="text-lg font-bold text-blue-800">{item.answer}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {item.formatted_date}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {item.number}{item.direction === 'across' ? 'A' : 'D'}
                    </div>
                    <div className="text-sm font-medium">{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* History Loading indicator */}
        {historyLoading && !loading && (
          <div className="my-4 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-3 text-sm text-blue-700">Loading historical data...</span>
          </div>
        )}
        
        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="rounded-md border border-gray-200 bg-white p-4">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Possible Answers
            </h2>
            
            {/* Top Results */}
            {topResults.length > 0 && (
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">
                  {topResults.length > 1 ? 'Best Matches' : 'Best Match'}
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {topResults.map((result, index) => (
                    <div key={index} className="bg-orange-50 border-2 border-orange-300 rounded-md p-3 text-center">
                      <span className="text-xl font-bold text-orange-700">{result.word}</span>
                      <div className="text-sm text-gray-500 mt-1">
                        {!usingFallback ? (
                          <div className="flex justify-center">
                            {Array('rating' in result ? result.rating : Math.floor(result.score / 100))
                              .fill(0)
                              .map((_, i) => (
                                <span key={i} className="text-yellow-500">★</span>
                              ))}
                          </div>
                        ) : (
                          <span>Score: {result.score}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Results by Length */}
            <div className="space-y-4">
              {Object.keys(groupedResults)
                .map(Number)
                .sort((a, b) => b - a) // Sort by length in descending order
                .map(length => (
                  <div key={length} className="border-t pt-3">
                    <h3 className="text-md font-medium text-gray-800 mb-2">
                      {length}-Letter Words ({groupedResults[length].length})
                    </h3>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {groupedResults[length].map((result, index) => (
                        <div
                          key={index}
                          className="rounded-md border border-gray-200 bg-gray-50 p-2 text-center"
                        >
                          <span className="font-medium">{result.word}</span>
                          {!usingFallback && (
                            <div className="flex justify-center mt-1">
                              {Array('rating' in result ? result.rating : Math.floor(result.score / 100))
                                .fill(0)
                                .map((_, i) => (
                                  <span key={i} className="text-yellow-500 text-xs">★</span>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 