"use client";

import { useState, useEffect } from 'react';
import { EyeIcon } from 'lucide-react';
import { NYTCrosswordPuzzle } from '../../lib/nyt-crosswords';

interface CrosswordCluesProps {
  puzzle: NYTCrosswordPuzzle;
  onClueClick?: (number: number, direction: 'across' | 'down') => void;
  forceRevealAll?: boolean;
}

export default function CrosswordClues({ puzzle, onClueClick, forceRevealAll = false }: CrosswordCluesProps) {
  const { clues, answers } = puzzle;
  
  // State to track which clue answers have been revealed
  const [revealedAcross, setRevealedAcross] = useState<Set<number>>(new Set());
  const [revealedDown, setRevealedDown] = useState<Set<number>>(new Set());
  
  // Process clues to extract numbers and content
  const processClues = (cluesList: string[], answersList: string[]) => {
    return cluesList.map((clue, index) => {
      const match = clue.match(/^(\d+)\.\s(.+)$/);
      if (!match) return null;
      
      const [, numberStr, clueText] = match;
      return {
        number: parseInt(numberStr, 10),
        clue: clueText,
        answer: answersList[index]
      };
    }).filter(Boolean) as { number: number; clue: string; answer: string }[];
  };
  
  const acrossClues = processClues(clues.across, answers.across);
  const downClues = processClues(clues.down, answers.down);
  
  // React to forceRevealAll prop changes
  useEffect(() => {
    if (forceRevealAll) {
      // Reveal all across clues
      const allAcrossNumbers = new Set(acrossClues.map(clue => clue.number));
      setRevealedAcross(allAcrossNumbers);
      
      // Reveal all down clues
      const allDownNumbers = new Set(downClues.map(clue => clue.number));
      setRevealedDown(allDownNumbers);
    }
  }, [forceRevealAll, acrossClues, downClues]);
  
  // Toggle reveal for a specific clue
  const toggleRevealAcross = (number: number) => {
    const newRevealed = new Set(revealedAcross);
    if (newRevealed.has(number)) {
      newRevealed.delete(number);
    } else {
      newRevealed.add(number);
    }
    setRevealedAcross(newRevealed);
  };
  
  const toggleRevealDown = (number: number) => {
    const newRevealed = new Set(revealedDown);
    if (newRevealed.has(number)) {
      newRevealed.delete(number);
    } else {
      newRevealed.add(number);
    }
    setRevealedDown(newRevealed);
  };
  
  // Handle clicking on a clue
  const handleClueClick = (number: number, direction: 'across' | 'down') => {
    if (onClueClick) {
      onClueClick(number, direction);
    }
  };
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-2">
      {/* Across Clues */}
      <div className="rounded-lg bg-blue-50 p-3 sm:p-4 shadow-inner">
        <h3 className="mb-3 border-b border-blue-200 pb-1 sm:pb-2 text-lg sm:text-xl font-semibold text-blue-900">
          Across
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {acrossClues.map((clueObj, idx) => (
            <div key={`across-${idx}`} className="group rounded-md bg-white p-2 sm:p-3 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col">
                <div className="flex items-start justify-between">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleClueClick(clueObj.number, 'across')}
                  >
                    <span className="mr-2 inline-block rounded-full bg-blue-100 px-1.5 py-0.5 text-xs sm:text-sm font-semibold text-blue-800">
                      {clueObj.number}
                    </span>
                    <span className="text-sm sm:text-base text-gray-800">{clueObj.clue}</span>
                  </div>
                  <button 
                    className="ml-2 flex-shrink-0 rounded-md bg-gray-100 p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                    onClick={() => toggleRevealAcross(clueObj.number)}
                    aria-label={`Reveal answer for ${clueObj.number} across`}
                  >
                    <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
                
                {revealedAcross.has(clueObj.number) && (
                  <div className="mt-1 sm:mt-2 flex justify-end">
                    <span className="rounded-md bg-blue-100 px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs sm:text-sm font-mono font-bold text-blue-800">
                      {clueObj.answer}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Down Clues */}
      <div className="rounded-lg bg-green-50 p-3 sm:p-4 shadow-inner">
        <h3 className="mb-3 border-b border-green-200 pb-1 sm:pb-2 text-lg sm:text-xl font-semibold text-green-900">
          Down
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {downClues.map((clueObj, idx) => (
            <div key={`down-${idx}`} className="group rounded-md bg-white p-2 sm:p-3 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col">
                <div className="flex items-start justify-between">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleClueClick(clueObj.number, 'down')}
                  >
                    <span className="mr-2 inline-block rounded-full bg-green-100 px-1.5 py-0.5 text-xs sm:text-sm font-semibold text-green-800">
                      {clueObj.number}
                    </span>
                    <span className="text-sm sm:text-base text-gray-800">{clueObj.clue}</span>
                  </div>
                  <button 
                    className="ml-2 flex-shrink-0 rounded-md bg-gray-100 p-1 text-gray-600 hover:bg-green-100 hover:text-green-700"
                    onClick={() => toggleRevealDown(clueObj.number)}
                    aria-label={`Reveal answer for ${clueObj.number} down`}
                  >
                    <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
                
                {revealedDown.has(clueObj.number) && (
                  <div className="mt-1 sm:mt-2 flex justify-end">
                    <span className="rounded-md bg-green-100 px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs sm:text-sm font-mono font-bold text-green-800">
                      {clueObj.answer}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="col-span-1 text-center text-xs text-gray-500 lg:col-span-2">
        Click on a clue to navigate to it in the grid. Click the eye icon to reveal an answer.
      </div>
    </div>
  );
} 