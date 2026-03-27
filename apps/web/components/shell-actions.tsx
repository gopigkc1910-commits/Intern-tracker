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
        <Link href="/admin" className="rounded-full border border-teal/20 bg-white/80 px-4 py-2 text-sm text-slate">
          Admin
        </Link>
      ) : null}
      <button
        type="button"
        onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        className="rounded-full border border-teal/20 bg-white/80 px-4 py-2 text-sm text-slate"
      >
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </button>
      <SessionActionButton
        isAuthenticated={initialAuthenticated}
        className="rounded-full bg-ink px-4 py-2 text-sm text-mist"
      />
    </div>
  );
}
