"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { clientJsonFetch } from "../lib/client-json";

type ShellActionsProps = {
  initialTheme: string;
  initialAuthenticated: boolean;
  showAdminLink?: boolean;
};

export function ShellActions({ initialTheme, initialAuthenticated, showAdminLink = false }: ShellActionsProps) {
  const router = useRouter();
  const [theme, setTheme] = useState(initialTheme);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [isPending, startTransition] = useTransition();

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
      {isAuthenticated ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await clientJsonFetch<{ ok: boolean }>("/api/auth/session", {
                method: "DELETE"
              });
              setIsAuthenticated(false);
              router.push("/");
              router.refresh();
            });
          }}
          className="rounded-full bg-ink px-4 py-2 text-sm text-mist"
        >
          {isPending ? "Signing out..." : "Sign out"}
        </button>
      ) : (
        <Link href="/" className="rounded-full bg-ink px-4 py-2 text-sm text-mist">
          Sign in
        </Link>
      )}
    </div>
  );
}
