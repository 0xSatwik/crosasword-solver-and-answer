/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  experimental: {
    // Enable optimized navigation features
    scrollRestoration: true
  },
  async redirects() {
    return [
      {
        source: '/daily/nyt-daily',
        destination: '/nyt-crossword-answer-today',
        permanent: true,
      },
      {
        source: '/daily/nyt-daily/:path*',
        destination: '/nyt-crossword-answer-today/:path*',
        permanent: true,
      },
      {
        source: '/nyt-crosswords',
        destination: '/play-crossword',
        permanent: true,
      },
      {
        source: '/nyt-crosswords/:path*',
        destination: '/play-crossword/:path*',
        permanent: true,
      },
      {
        source: '/daily/nyt-archive',
        destination: '/daily/nyt-crossword-answers',
        permanent: true,
      },
      {
        source: '/daily/nyt-archive/:path*',
        destination: '/daily/nyt-crossword-answers/:path*',
        permanent: true,
      },
      {
        source: '/daily/nyt-crossword-answer-for-:slug*',
        destination: '/nyt-crossword-answer-for-:slug*',
        permanent: true,
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/nyt-crossword-answer-for-:date',
        destination: '/nyt-crossword-answer/:date',
      },
      {
        source: '/nyt-mini-crossword-answer-for-:date',
        destination: '/nyt-mini-crossword-answer/:date',
      }
    ];
  }
};

module.exports = nextConfig; 