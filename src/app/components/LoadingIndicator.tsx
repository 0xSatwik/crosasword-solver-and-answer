"use client";

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function LoadingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Create a timeout to avoid flashing the loading indicator for fast transitions
    let timeoutId: NodeJS.Timeout;

    const handleRouteChangeStart = () => {
      timeoutId = setTimeout(() => {
        setIsLoading(true);
      }, 100); // Small delay to avoid flashing for quick routes
    };

    const handleRouteChangeComplete = () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };

    // Set up route change observers
    window.addEventListener('beforeunload', handleRouteChangeStart);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('beforeunload', handleRouteChangeStart);
    };
  }, []);

  // Watch for URL changes to detect navigation
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="h-1 w-full bg-blue-50">
        <div className="animate-loading-bar h-1 bg-blue-600 transition-all"></div>
      </div>
    </div>
  );
}

// Add this CSS to your global stylesheet
// .animate-loading-bar {
//   width: 0%;
//   animation: loading-bar 2s ease-in-out infinite;
// }
// @keyframes loading-bar {
//   0% { width: 0%; }
//   50% { width: 70%; }
//   100% { width: 100%; }
// } 