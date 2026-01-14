import { Metadata } from 'next';
import NytMiniSolverClient from './NytMiniSolverClient';

export const metadata: Metadata = {
    title: "NYT Mini Crossword Solver | Daily Answer Helper",
    description: "Stuck on today's NYT Mini? Use our free Mini Crossword Solver to find answers for any clue. Updated daily with the latest solutions.",
    keywords: ["NYT Mini Solver", "Mini Crossword Answers", "NYT Mini Clue Helper", "Daily Mini Solutions"],
};

export default function NytMiniSolverPage() {
    return <NytMiniSolverClient />;
}
