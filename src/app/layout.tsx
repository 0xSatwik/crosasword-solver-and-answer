import React from 'react';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingIndicator from './components/LoadingIndicator';
import Script from 'next/script';


export const metadata = {
  title: 'Crossword Solver - Free Daily Solutions & Answers',
  description: 'Free online crossword solver and daily answers for NYT, USA Today, LA Times and more. Find solutions with our powerful solver tool.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0B6MPRTWJF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-0B6MPRTWJF');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 font-sans antialiased">
        <LoadingIndicator />
        <Header />

        <main className="relative">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}