"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Component Error Caught:", error);
  }, [error]);

  return (
    <div className="flex w-full items-center justify-center p-8 mt-12 animate-slide-up">
      <div className="w-full max-w-2xl rounded-[32px] border border-coral/20 bg-surface/80 p-8 backdrop-blur-xl shadow-glow text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-coral/10 text-coral">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="h-8 w-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink mb-3">
          Something went wrong
        </h2>
        <p className="text-sm text-slate mb-8 max-w-md mx-auto">
          We couldn't load this part of the application. It looks like a temporary issue or network error. Please try refreshing.
        </p>
        <button
          onClick={() => reset()}
          className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-mist transition-transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ink/50"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
