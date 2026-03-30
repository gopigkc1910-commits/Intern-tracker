"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SessionActionButton } from "./session-action-button";

type ShellActionsProps = {
  initialTheme: string;
  initialAuthenticated: boolean;
  showAdminLink?: boolean;
};

export function ShellActions({ initialTheme, initialAuthenticated, showAdminLink = false }: ShellActionsProps) {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.cookie = `intern_tracker_theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }, [theme]);

  return (
    <div className="flex items-center gap-3">
      {showAdminLink ? (
        <Link href="/admin" className="rounded-full border border-teal/20 bg-surface/80 backdrop-blur-md px-5 py-2 text-sm font-medium text-slate transition-all hover:bg-teal/5 hover:text-teal hover:border-teal/30">
          Admin
        </Link>
      ) : null}
      
      <button
        type="button"
        aria-label="Toggle Dark Mode"
        onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-slate/15 bg-surface/80 backdrop-blur-md text-slate transition-all hover:scale-105 hover:bg-teal/10 hover:text-teal hover:border-teal/30 focus:outline-none focus:ring-2 focus:ring-teal/30"
      >
        <span className="sr-only">Toggle theme</span>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className={`h-5 w-5 absolute transition-transform duration-500 ${theme === 'dark' ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className={`h-5 w-5 absolute transition-transform duration-500 ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>

      <SessionActionButton
        isAuthenticated={initialAuthenticated}
        className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-surface-strong shadow-md transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ink/50"
      />
    </div>
  );
}
