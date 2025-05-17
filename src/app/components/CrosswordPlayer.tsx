"use client";

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { NYTCrosswordPuzzle } from '../../lib/nyt-crosswords';
import CrosswordClues from './CrosswordClues';

interface CrosswordPlayerProps {
  puzzle: NYTCrosswordPuzzle;
}

export default function CrosswordPlayer({ puzzle }: CrosswordPlayerProps) {
  const { grid, gridnums, size, clues, answers } = puzzle;
  const { rows, cols } = size;
  
  // State for the player's input
  const [playerGrid, setPlayerGrid] = useState<string[]>(Array(grid.length).fill(''));
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [revealed, setRevealed] = useState<boolean[]>(Array(grid.length).fill(false));
  const [activeClue, setActiveClue] = useState<string>('');
  const [activeClueNumber, setActiveClueNumber] = useState<number | null>(null);
  // Add state for revealing all clue answers
  const [allCluesRevealed, setAllCluesRevealed] = useState<boolean>(false);
  // Add state for active across and down clues
  const [activeAcrossClue, setActiveAcrossClue] = useState<{number: number, clue: string} | null>(null);
  const [activeDownClue, setActiveDownClue] = useState<{number: number, clue: string} | null>(null);
  // Add state for the displayed clue direction in the section below grid
  const [displayedClueDirection, setDisplayedClueDirection] = useState<'across' | 'down'>('across');
  
  // Refs for the grid cells and clue elements
  const cellRefs = useRef<Array<HTMLDivElement | null>>([]);
  const clueRefs = useRef<{[key: string]: HTMLElement | null}>({});
  
  // Process clues to extract numbers and content
  const processClues = (cluesList: string[]) => {
    return cluesList.map((clue) => {
      const match = clue.match(/^(\d+)\.\s(.+)$/);
      if (!match) return null;
      
      const [, numberStr, clueText] = match;
      return {
        number: parseInt(numberStr, 10),
        clue: clueText
      };
    }).filter(Boolean) as { number: number; clue: string }[];
  };
  
  const acrossClues = processClues(clues.across);
  const downClues = processClues(clues.down);
  
  // Find the first non-black cell for initial focus
  useEffect(() => {
    const firstNonBlackCellIndex = grid.findIndex(cell => cell !== '.');
    if (firstNonBlackCellIndex >= 0) {
      const row = Math.floor(firstNonBlackCellIndex / cols);
      const col = firstNonBlackCellIndex % cols;
      setActiveCell([row, col]);
    }
  }, [grid, cols]);

  // Helper function to check if a cell is a black square
  const isBlackSquare = (row: number, col: number) => {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return true; // Out of bounds
    const index = row * cols + col;
    return grid[index] === '.';
  };

  // Helper function to get the flat index from row and column
  const getFlatIndex = (row: number, col: number) => row * cols + col;
  
  // Find the number of the current word
  const findCurrentWordNumber = (row: number, col: number, dir: 'across' | 'down') => {
    if (dir === 'across') {
      // Move to the leftmost cell of the current word
      let currentCol = col;
      while (currentCol > 0 && !isBlackSquare(row, currentCol - 1)) {
        currentCol--;
      }
      
      // Get the number of that cell
      const leftmostCellIndex = getFlatIndex(row, currentCol);
      return gridnums[leftmostCellIndex] || null;
    } else {
      // Move to the topmost cell of the current word
      let currentRow = row;
      while (currentRow > 0 && !isBlackSquare(currentRow - 1, col)) {
        currentRow--;
      }
      
      // Get the number of that cell
      const topmostCellIndex = getFlatIndex(currentRow, col);
      return gridnums[topmostCellIndex] || null;
    }
  };
  
  // Find the cell coordinates for a clue number and direction
  const findCellForClue = (clueNumber: number, dir: 'across' | 'down'): [number, number] | null => {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = getFlatIndex(row, col);
        
        if (gridnums[index] === clueNumber) {
          // For across clues, need to check if cell starts an across word
          if (dir === 'across') {
            // Either leftmost column or left cell is black
            if (col === 0 || isBlackSquare(row, col - 1)) {
              // And next cell is not black (word has length > 1) or we're at the rightmost column
              if (col === cols - 1 || !isBlackSquare(row, col + 1)) {
                return [row, col];
              }
            }
          } 
          // For down clues, need to check if cell starts a down word
          else if (dir === 'down') {
            // Either topmost row or cell above is black
            if (row === 0 || isBlackSquare(row - 1, col)) {
              // And cell below is not black (word has length > 1) or we're at the bottommost row
              if (row === rows - 1 || !isBlackSquare(row + 1, col)) {
                return [row, col];
              }
            }
          }
        }
      }
    }
    
    return null;
  };
  
  // Handle clicking on a clue number in the grid
  const handleCellNumberClick = (event: React.MouseEvent, cellNumber: number) => {
    event.stopPropagation(); // Prevent cell click event
    
    // Determine if the active cell is part of an across word, a down word, or both
    const acrossNumber = activeCell ? findCurrentWordNumber(activeCell[0], activeCell[1], 'across') : null;
    const downNumber = activeCell ? findCurrentWordNumber(activeCell[0], activeCell[1], 'down') : null;
    
    // Toggle between across and down if the cell has both
    if (acrossNumber === cellNumber && downNumber === cellNumber) {
      setDirection(direction === 'across' ? 'down' : 'across');
    } 
    // If the current direction is across but the cell only has a down clue
    else if (downNumber === cellNumber && acrossNumber !== cellNumber) {
      setDirection('down');
    }
    // If the current direction is down but the cell only has an across clue
    else if (acrossNumber === cellNumber && downNumber !== cellNumber) {
      setDirection('across');
    }
    // Default to the first valid direction
    else {
      const acrossClueExists = acrossClues.some(c => c.number === cellNumber);
      const downClueExists = downClues.some(c => c.number === cellNumber);
      
      if (acrossClueExists) {
        setDirection('across');
        const cellCoords = findCellForClue(cellNumber, 'across');
        if (cellCoords) setActiveCell(cellCoords);
      } else if (downClueExists) {
        setDirection('down');
        const cellCoords = findCellForClue(cellNumber, 'down');
        if (cellCoords) setActiveCell(cellCoords);
      }
    }
  };
  
  // Navigate to a cell when a clue is clicked
  const handleClueClick = (clueNumber: number, dir: 'across' | 'down') => {
    const cellCoords = findCellForClue(clueNumber, dir);
    if (cellCoords) {
      setActiveCell(cellCoords);
      setDirection(dir);
    }
  };
  
  // Update active clue when active cell or direction changes
  useEffect(() => {
    if (activeCell) {
      const [row, col] = activeCell;
      
      // Find the clue numbers for both across and down words
      const acrossClueNumber = findCurrentWordNumber(row, col, 'across');
      const downClueNumber = findCurrentWordNumber(row, col, 'down');
      
      // Set active clue number based on current direction
      setActiveClueNumber(direction === 'across' ? acrossClueNumber : downClueNumber);
      
      // Find the corresponding across clue
      if (acrossClueNumber) {
        const currentAcrossClue = acrossClues.find(c => c.number === acrossClueNumber);
        if (currentAcrossClue) {
          setActiveAcrossClue(currentAcrossClue);
        } else {
          setActiveAcrossClue(null);
        }
      } else {
        setActiveAcrossClue(null);
      }
      
      // Find the corresponding down clue
      if (downClueNumber) {
        const currentDownClue = downClues.find(c => c.number === downClueNumber);
        if (currentDownClue) {
          setActiveDownClue(currentDownClue);
        } else {
          setActiveDownClue(null);
        }
      } else {
        setActiveDownClue(null);
      }
      
      // Set the active clue text based on current direction
      if (direction === 'across' && acrossClueNumber) {
        const currentClue = acrossClues.find(c => c.number === acrossClueNumber);
        if (currentClue) {
          setActiveClue(`${acrossClueNumber} Across: ${currentClue.clue}`);
        } else {
          setActiveClue('');
        }
      } else if (direction === 'down' && downClueNumber) {
        const currentClue = downClues.find(c => c.number === downClueNumber);
        if (currentClue) {
          setActiveClue(`${downClueNumber} Down: ${currentClue.clue}`);
        } else {
          setActiveClue('');
        }
      } else {
        setActiveClue('');
      }
    }
  }, [activeCell, direction, acrossClues, downClues]);

  // Move to the next cell in the direction
  const moveToNextCell = (row: number, col: number, dir: 'across' | 'down') => {
    if (dir === 'across') {
      let nextCol = col + 1;
      let nextRow = row;
      
      // If at the end of a row, move to the next row
      if (nextCol >= cols) {
        nextCol = 0;
        nextRow = (nextRow + 1) % rows;
      }
      
      // Skip black squares
      while (nextRow < rows && isBlackSquare(nextRow, nextCol)) {
        nextCol++;
        if (nextCol >= cols) {
          nextCol = 0;
          nextRow = (nextRow + 1) % rows;
          if (nextRow === row) break; // Avoid infinite loop
        }
      }
      
      if (nextRow < rows && !isBlackSquare(nextRow, nextCol)) {
        setActiveCell([nextRow, nextCol]);
      }
    } else {
      let nextRow = row + 1;
      let nextCol = col;
      
      // If at the bottom of a column, move to the top of the next column
      if (nextRow >= rows) {
        nextRow = 0;
        nextCol = (nextCol + 1) % cols;
      }
      
      // Skip black squares
      while (nextCol < cols && isBlackSquare(nextRow, nextCol)) {
        nextRow++;
        if (nextRow >= rows) {
          nextRow = 0;
          nextCol = (nextCol + 1) % cols;
          if (nextCol === col) break; // Avoid infinite loop
        }
      }
      
      if (nextCol < cols && !isBlackSquare(nextRow, nextCol)) {
        setActiveCell([nextRow, nextCol]);
      }
    }
  };
  
  // Move to the previous cell in the direction
  const moveToPrevCell = (row: number, col: number, dir: 'across' | 'down') => {
    if (dir === 'across') {
      let prevCol = col - 1;
      let prevRow = row;
      
      // If at the beginning of a row, move to the previous row
      if (prevCol < 0) {
        prevCol = cols - 1;
        prevRow = (prevRow - 1 + rows) % rows;
      }
      
      // Skip black squares
      while (prevRow >= 0 && isBlackSquare(prevRow, prevCol)) {
        prevCol--;
        if (prevCol < 0) {
          prevCol = cols - 1;
          prevRow = (prevRow - 1 + rows) % rows;
          if (prevRow === row) break; // Avoid infinite loop
        }
      }
      
      if (prevRow >= 0 && !isBlackSquare(prevRow, prevCol)) {
        setActiveCell([prevRow, prevCol]);
      }
    } else {
      let prevRow = row - 1;
      let prevCol = col;
      
      // If at the top of a column, move to the bottom of the previous column
      if (prevRow < 0) {
        prevRow = rows - 1;
        prevCol = (prevCol - 1 + cols) % cols;
      }
      
      // Skip black squares
      while (prevCol >= 0 && isBlackSquare(prevRow, prevCol)) {
        prevRow--;
        if (prevRow < 0) {
          prevRow = rows - 1;
          prevCol = (prevCol - 1 + cols) % cols;
          if (prevCol === col) break; // Avoid infinite loop
        }
      }
      
      if (prevCol >= 0 && !isBlackSquare(prevRow, prevCol)) {
        setActiveCell([prevRow, prevCol]);
      }
    }
  };
  
  // Handle key press events
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, row: number, col: number) => {
    const index = getFlatIndex(row, col);
    
    // Prevent default for arrow keys to avoid scrolling
    if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'Tab'].includes(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case 'ArrowUp':
        if (row > 0 && !isBlackSquare(row - 1, col)) {
          setActiveCell([row - 1, col]);
          setDirection('down');
        }
        break;
      case 'ArrowRight':
        if (col < cols - 1 && !isBlackSquare(row, col + 1)) {
          setActiveCell([row, col + 1]);
          setDirection('across');
        }
        break;
      case 'ArrowDown':
        if (row < rows - 1 && !isBlackSquare(row + 1, col)) {
          setActiveCell([row + 1, col]);
          setDirection('down');
        }
        break;
      case 'ArrowLeft':
        if (col > 0 && !isBlackSquare(row, col - 1)) {
          setActiveCell([row, col - 1]);
          setDirection('across');
        }
        break;
      case 'Tab':
        if (e.shiftKey) {
          moveToPrevCell(row, col, direction);
        } else {
          moveToNextCell(row, col, direction);
        }
        break;
      case 'Backspace':
        // If cell is not empty, clear it
        if (playerGrid[index]) {
          const newGrid = [...playerGrid];
          newGrid[index] = '';
          setPlayerGrid(newGrid);
        } else {
          // If cell is already empty, move to previous cell
          moveToPrevCell(row, col, direction);
        }
        break;
      case 'Delete':
        const newGrid = [...playerGrid];
        newGrid[index] = '';
        setPlayerGrid(newGrid);
        break;
      case ' ':
        // Toggle direction
        setDirection(direction === 'across' ? 'down' : 'across');
        break;
      default:
        // Handle letter input (a-z, A-Z)
        if (/^[a-zA-Z]$/.test(e.key)) {
          const newGrid = [...playerGrid];
          newGrid[index] = e.key.toUpperCase();
          setPlayerGrid(newGrid);
          
          // Move to next cell after input
          moveToNextCell(row, col, direction);
        }
    }
  };
  
  // Focus the active cell
  useEffect(() => {
    if (activeCell) {
      const [row, col] = activeCell;
      const index = getFlatIndex(row, col);
      cellRefs.current[index]?.focus();
    }
  }, [activeCell]);

  // Handle revealing a single cell
  const revealCell = (row: number, col: number) => {
    const index = getFlatIndex(row, col);
    if (grid[index] !== '.') {
      const newPlayerGrid = [...playerGrid];
      newPlayerGrid[index] = grid[index];
      
      const newRevealed = [...revealed];
      newRevealed[index] = true;
      
      setPlayerGrid(newPlayerGrid);
      setRevealed(newRevealed);
    }
  };

  // Handle revealing the entire puzzle
  const revealPuzzle = () => {
    const newPlayerGrid = [...grid];
    const newRevealed = Array(grid.length).fill(false).map((_, i) => grid[i] !== '.');
    
    setPlayerGrid(newPlayerGrid);
    setRevealed(newRevealed);
    // Also reveal all clue answers
    setAllCluesRevealed(true);
  };

  // Check if the player has completed the puzzle correctly
  const isPuzzleComplete = () => {
    return playerGrid.every((cell, index) => {
      if (grid[index] === '.') return true;
      return cell.toUpperCase() === grid[index].toUpperCase();
    });
  };

  // Set up refs array with the correct length
  useEffect(() => {
    cellRefs.current = Array(rows * cols).fill(null);
  }, [rows, cols]);

  // Toggle displayed clue direction
  const toggleClueDirection = () => {
    setDisplayedClueDirection(displayedClueDirection === 'across' ? 'down' : 'across');
  };

  return (
    <div className="flex flex-col items-center">
      {/* Active Clue Display */}
      <div className="mb-3 sm:mb-4 min-h-[40px] w-full max-w-lg rounded-lg bg-blue-100 p-2 sm:p-3 text-center shadow-md">
        {activeClue ? (
          <p className="text-sm sm:text-base font-medium text-blue-900">{activeClue}</p>
        ) : (
          <p className="text-xs sm:text-sm text-gray-600">Click a cell to begin</p>
        )}
      </div>

      {/* Current Across and Down Clues */}
      <div className="mb-3 sm:mb-4 w-full max-w-lg rounded-lg bg-gray-100 p-2 sm:p-3 shadow-md">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <h3 className="text-sm sm:text-base font-medium text-gray-800">Current Clues</h3>
          <button 
            onClick={toggleClueDirection} 
            className="px-2 py-1 text-xs sm:text-sm bg-white hover:bg-gray-200 rounded-md transition-colors shadow-sm border border-gray-200"
          >
            Show {displayedClueDirection === 'across' ? 'Down' : 'Across'}
          </button>
        </div>
        
        {displayedClueDirection === 'across' ? (
          activeAcrossClue ? (
            <div className="p-1.5 sm:p-2 rounded-md bg-blue-100 shadow-sm border border-blue-200">
              <span className="font-bold text-xs sm:text-sm text-blue-900">{activeAcrossClue.number} Across: </span>
              <span className="text-xs sm:text-sm text-blue-800">{activeAcrossClue.clue}</span>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-500 italic p-1.5 sm:p-2">No active across clue</p>
          )
        ) : (
          activeDownClue ? (
            <div className="p-1.5 sm:p-2 rounded-md bg-green-100 shadow-sm border border-green-200">
              <span className="font-bold text-xs sm:text-sm text-green-900">{activeDownClue.number} Down: </span>
              <span className="text-xs sm:text-sm text-green-800">{activeDownClue.clue}</span>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-500 italic p-1.5 sm:p-2">No active down clue</p>
          )
        )}
      </div>

      {/* Interactive Grid - Reduce size and ensure square shape */}
      <div className="mb-6 flex justify-center">
        <div className="overflow-auto max-w-full rounded-xl border-2 border-gray-900 bg-gray-900 p-1 shadow-2xl">
          <div 
            className="grid gap-[1px] bg-gray-900"
            style={{ 
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              width: 'fit-content',
              aspectRatio: `${cols}/${rows}`
            }}
          >
            {Array.from({ length: rows * cols }).map((_, index) => {
              const row = Math.floor(index / cols);
              const col = index % cols;
              const cellContent = grid[index];
              const cellNumber = gridnums[index];
              const isBlack = cellContent === '.';
              const isActive = activeCell && activeCell[0] === row && activeCell[1] === col;
              const isRevealed = revealed[index];
              
              // Check if cell is part of the active word
              const isActiveWord = activeCell && activeClueNumber && !isBlack ? (() => {
                if (direction === 'across') {
                  // Find the number of the across word this cell belongs to
                  const thisWordNumber = findCurrentWordNumber(row, col, 'across');
                  return thisWordNumber === activeClueNumber;
                } else {
                  // Find the number of the down word this cell belongs to
                  const thisWordNumber = findCurrentWordNumber(row, col, 'down');
                  return thisWordNumber === activeClueNumber;
                }
              })() : false;
  
              return (
                <div
                  key={`cell-${row}-${col}`}
                  ref={(el) => { cellRefs.current[index] = el; }}
                  tabIndex={isBlack ? -1 : 0}
                  className={`relative flex aspect-square w-6 xs:w-7 sm:w-8 select-none items-center justify-center border ${
                    isBlack 
                      ? 'border-none bg-black' 
                      : isActive
                        ? 'border-blue-500 bg-blue-100 outline-none ring-1 ring-blue-500'
                        : isActiveWord
                          ? 'border-gray-300 bg-blue-50'
                          : isRevealed
                            ? 'border-gray-300 bg-yellow-50'
                            : 'border-gray-300 bg-white'
                  }`}
                  style={{
                    minWidth: '26px', 
                    minHeight: '26px',
                    maxWidth: '35px',
                    maxHeight: '35px'
                  }}
                  onClick={() => !isBlack && setActiveCell([row, col])}
                  onKeyDown={e => !isBlack && handleKeyDown(e, row, col)}
                >
                  {!isBlack && cellNumber > 0 && (
                    <span 
                      className="absolute left-[1px] top-0 cursor-pointer text-[6px] font-medium text-gray-900 hover:text-blue-600 xs:text-[7px] sm:text-[8px]"
                      onClick={(e) => handleCellNumberClick(e, cellNumber)}
                    >
                      {cellNumber}
                    </span>
                  )}
                  {!isBlack && (
                    <span className={`text-xs font-bold xs:text-sm ${
                      isRevealed ? 'text-red-600' : 'text-blue-900'
                    }`}>
                      {playerGrid[index] || ''}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-4 sm:mb-6 grid w-full max-w-lg grid-cols-2 gap-2 sm:gap-4">
        <button 
          onClick={() => activeCell && revealCell(activeCell[0], activeCell[1])}
          className="rounded-md bg-yellow-500 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base font-medium text-white shadow-md transition-all hover:bg-yellow-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          Reveal Cell
        </button>
        <button 
          onClick={revealPuzzle}
          className="rounded-md bg-red-500 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base font-medium text-white shadow-md transition-all hover:bg-red-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Reveal Puzzle
        </button>
      </div>

      {/* Clues Section */}
      <div className="mb-4 sm:mb-6 w-full">
        <h3 className="mb-2 sm:mb-3 text-center text-lg sm:text-xl font-semibold text-gray-900 border-b border-gray-200 pb-1">Clues</h3>
        <CrosswordClues puzzle={puzzle} onClueClick={handleClueClick} forceRevealAll={allCluesRevealed} />
      </div>

      {/* Instructions */}
      <div className="mb-4 sm:mb-6 rounded-lg bg-gray-100 p-3 sm:p-4 text-xs sm:text-sm text-gray-700 shadow-md border border-gray-200">
        <h3 className="mb-1 sm:mb-2 font-semibold text-gray-900 border-b border-gray-200 pb-1">How to Play:</h3>
        <ul className="list-disc space-y-0.5 sm:space-y-1 pl-4 sm:pl-5">
          <li>Click on a cell or use arrow keys to navigate</li>
          <li>Type letters to fill in cells</li>
          <li>Press Space to switch between Across and Down</li>
          <li>Click on cell numbers to jump to that clue</li>
          <li>Click on clues below to jump to that location in the grid</li>
        </ul>
        <p className="mt-1 sm:mt-2 pt-1 border-t border-gray-200">
          Current direction: <span className="font-semibold text-blue-900">{direction === 'across' ? 'Across' : 'Down'}</span>
        </p>
      </div>
    </div>
  );
} 