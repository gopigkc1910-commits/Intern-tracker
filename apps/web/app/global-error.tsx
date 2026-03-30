"use client";

import { useEffect } from "react";
import Link from "next/link";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-mist p-6">
        <div className="w-full max-w-lg rounded-[32px] border border-coral/20 bg-surface-strong/80 p-10 backdrop-blur-xl shadow-glow text-center animate-slide-up">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-coral/10 text-coral">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-10 w-10"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-ink mb-4">
            Critical System Error
          </h1>
          <p className="text-sm leading-relaxed text-slate mb-8">
            A fatal error occurred at the application root level. We've logged this to our monitoring system. Please try reloading the page to recover.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="rounded-2xl bg-ink px-8 py-4 text-sm font-semibold text-mist transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ink/50"
            >
              Restart Application
            </button>
            <Link
              href="/"
              className="rounded-2xl border border-teal/20 bg-surface px-8 py-4 text-sm font-semibold text-ink transition-all hover:-translate-y-1 hover:bg-teal/5 focus:outline-none focus:ring-2 focus:ring-teal/30"
            >
              Return Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
