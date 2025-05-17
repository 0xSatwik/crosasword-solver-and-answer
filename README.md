# Crossword Central

A modern Next.js website dedicated to crossword puzzles, featuring daily solutions from major publications, guides, and an interactive solver tool.

## Features

- **Daily Crossword Solutions**: Get answers for NYT, USA Today, LA Times, and more
- **Advanced Solver Tool**: Find crossword answers using clues and letter patterns
- **Guides & Tips**: Learn techniques to improve your crossword solving skills 
- **Responsive Design**: Beautiful interface that works on desktop and mobile
- **Fast Performance**: Built with Next.js for optimal user experience

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with Shadcn UI components
- **API Integration**: Datamuse API for the solver tool
- **Data Management**: Static generation for daily puzzle solutions
- **Authentication**: (Optional) For saving favorites or custom crosswords

## Project Structure

```
src/
├── app/                      # Next.js app router
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── global.css            # Global styles
│   ├── daily/                # Daily crossword answers section
│   │   ├── [publication]/    # Dynamic routes for each publication
│   │   │   └── [date]/       # Dynamic routes for specific dates
│   ├── solver/               # Crossword solver tool
│   ├── guides/               # Guides and tips section
│   └── about/                # About page
├── components/               # Reusable components
│   ├── ui/                   # UI components (buttons, cards, etc.)
│   ├── layout/               # Layout components (header, footer, etc.)
│   ├── solver/               # Solver-specific components
│   └── daily/                # Daily crossword components
├── lib/                      # Utility functions and shared code
│   ├── api/                  # API functions
│   └── utils/                # Utility functions
└── public/                   # Static assets
```

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

Deploy the project to Vercel:

```
npm run build
```

Then follow Vercel's deployment instructions.

## Customization

- Update the daily puzzle data in the `src/app/daily/[publication]/[date]` routes
- Modify the solver tool UI and behavior in the `src/app/solver` directory
- Add new guides and articles in the `src/app/guides` directory

## License

MIT 