"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AUTH_TOKEN_COOKIE } from "../lib/api";

type ShellActionsProps = {
  initialTheme: string;
  initialAuthenticated: boolean;
};

export function ShellActions({ initialTheme, initialAuthenticated }: ShellActionsProps) {
  const router = useRouter();
  const [theme, setTheme] = useState(initialTheme);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.cookie = `intern_tracker_theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }, [theme]);

  useEffect(() => {
    setIsAuthenticated(document.cookie.includes(`${AUTH_TOKEN_COOKIE}=`));
  }, []);

  return (
    <div className="flex items-center gap-3">
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
          onClick={() => {
            document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`;
            setIsAuthenticated(false);
            router.push("/");
            router.refresh();
          }}
          className="rounded-full bg-ink px-4 py-2 text-sm text-mist"
        >
          Sign out
        </button>
      ) : (
        <Link href="/" className="rounded-full bg-ink px-4 py-2 text-sm text-mist">
          Sign in
        </Link>
      )}
    </div>
  );
}
