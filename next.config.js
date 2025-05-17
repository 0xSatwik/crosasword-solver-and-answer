/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  experimental: {
    // Enable optimized navigation features
    optimizeCss: true,
    scrollRestoration: true,
    // Optimize route prefetching
    optimisticNavigation: true
  }
};

module.exports = nextConfig; 