import { NYTCrosswordPuzzle } from '../../lib/nyt-crosswords';

interface CrosswordGridProps {
  puzzle: NYTCrosswordPuzzle;
  showSolution?: boolean;
}

export default function CrosswordGrid({ puzzle, showSolution = true }: CrosswordGridProps) {
  const { grid, gridnums, size } = puzzle;
  const { rows, cols } = size;

  return (
    <div className="flex justify-center">
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
            const flatIndex = row * cols + col;
            const cellContent = grid[flatIndex];
            const cellNumber = gridnums[flatIndex];
            const isBlackSquare = cellContent === '.';

            return (
              <div
                key={`cell-${row}-${col}`}
                className={`relative flex aspect-square w-6 xs:w-7 sm:w-8 select-none items-center justify-center border ${
                  isBlackSquare 
                    ? 'border-none bg-black' 
                    : 'border-gray-300 bg-white'
                }`}
                style={{
                  minWidth: '26px', 
                  minHeight: '26px',
                  maxWidth: '35px',
                  maxHeight: '35px'
                }}
              >
                {!isBlackSquare && cellNumber > 0 && (
                  <span className="absolute left-[1px] top-0 text-[6px] font-medium text-gray-900 xs:text-[7px] sm:text-[8px]">
                    {cellNumber}
                  </span>
                )}
                {!isBlackSquare && showSolution && (
                  <span className="text-xs font-bold text-blue-900 xs:text-sm">
                    {cellContent}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 