import { MetadataRoute } from 'next';

// Generate last 100 days
function getDates(days: number) {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // Format: YYYY-MM-DD for dynamic paths if API supports it, or canonical format
        // The project seems to support multiple formats, but canonical slug logic in pages points to month-day-year (january-01-2026)

        const monthNames = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ];
        const monthName = monthNames[date.getMonth()];
        const slug = `${monthName}-${day}-${year}`;

        dates.push({
            slug,
            date: date.toISOString().split('T')[0] // yyyy-mm-dd for lastModified
        });
    }
    return dates;
}

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://crossword-solver.io';
    const last100Days = getDates(100);

    // Static Routes
    const routes = [
        '',
        '/daily',
        '/daily/nyt-crossword-answers',
        '/daily/nyt-mini-crossword-answers',
        '/nyt-crossword-answer-today',
        '/nyt-mini-answer-today',
        '/solver',
        '/nyt-mini-solver',
        '/archive',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Dynamic Routes - Main Crossword
    const mainCrosswordRoutes = last100Days.map((d) => ({
        url: `${baseUrl}/nyt-crossword-answer-for-${d.slug}`,
        lastModified: d.date,
        changeFrequency: 'never' as const, // Past puzzles don't change
        priority: 0.6,
    }));

    // Dynamic Routes - Mini Crossword
    const miniCrosswordRoutes = last100Days.map((d) => ({
        url: `${baseUrl}/nyt-mini-crossword-answer-for-${d.slug}`,
        lastModified: d.date,
        changeFrequency: 'never' as const,
        priority: 0.6,
    }));

    return [...routes, ...mainCrosswordRoutes, ...miniCrosswordRoutes];
}
