"use client";

import { useState } from 'react';
import { PencilIcon, EyeIcon } from 'lucide-react';
import { NYTCrosswordPuzzle } from '../../lib/nyt-crosswords';
import CrosswordGrid from './CrosswordGrid';
import CrosswordPlayer from './CrosswordPlayer';

interface CrosswordPlayModeProps {
  puzzle: NYTCrosswordPuzzle;
}

export default function CrosswordPlayMode({ puzzle }: CrosswordPlayModeProps) {
  const [mode, setMode] = useState<'play' | 'solution'>('play');

  return (
    <div className="rounded-xl bg-white p-4 shadow-xl sm:p-6">
      {/* Mode Toggle Buttons */}
      <div className="mb-4 sm:mb-6 flex justify-center">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setMode('play')}
            className={`flex items-center rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              mode === 'play'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <PencilIcon className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
            Play Mode
          </button>
          <button
            onClick={() => setMode('solution')}
            className={`flex items-center rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              mode === 'solution'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <EyeIcon className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
            View Solution
          </button>
        </div>
      </div>

      {/* Title based on mode */}
      <h2 className="mb-4 sm:mb-6 text-center text-xl sm:text-2xl font-bold text-gray-900">
        {mode === 'play' ? 'Play Crossword' : 'Crossword Solution'}
      </h2>

      {/* Content based on mode */}
      {mode === 'play' ? (
        <CrosswordPlayer puzzle={puzzle} />
      ) : (
        <div>
          <CrosswordGrid puzzle={puzzle} showSolution={true} />
          <div className="mt-4 text-center text-sm text-gray-500">
            {puzzle.copyright}
          </div>
        </div>
      )}
    </div>
  );
} 