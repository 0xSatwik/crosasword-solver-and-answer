import { Metadata } from 'next';
import SolverClient from './SolverClient';

export const metadata: Metadata = {
  title: "Crossword Solver | Free Online Crossword Puzzle Helper",
  description: "Solve any crossword clue with our free online Crossword Solver. Search by clue, pattern, or word length. Includes NYT Crossword and Mini answers.",
  keywords: ["Crossword Solver", "Crossword Puzzle Helper", "Solve Crossword Clue", "Crossword Answers", "NYT Crossword Solver"],
};

export default function SolverPage() {
  return <SolverClient />;
}