"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "intern_radar_compare_slugs";

/**
 * Validate if a slug is in proper format (alphanumeric, hyphens, underscores only)
 */
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9_-]+$/i.test(slug) && slug.length > 0 && slug.length < 255;
}

function readSlugs() {
  if (typeof window === "undefined") return [] as string[];
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown;
    if (!Array.isArray(stored)) return [];
    return stored.filter((item): item is string => typeof item === "string" && isValidSlug(item));
  } catch {
    return [];
  }
}

function writeSlugs(slugs: string[]) {
  const validated = slugs.filter(isValidSlug);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
  window.dispatchEvent(new Event("intern-radar-compare-update"));
}

export function CompareTray() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setSlugs(readSlugs());
    sync();
    window.addEventListener("intern-radar-compare-update", sync);
    return () => window.removeEventListener("intern-radar-compare-update", sync);
  }, []);

  if (slugs.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-4 z-40 hidden max-w-sm rounded-[24px] border border-white/60 bg-white/95 p-4 shadow-glow lg:block">
      <p className="text-sm font-semibold text-ink">Comparison tray</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {slugs.map((slug) => (
          <span key={slug} className="rounded-full bg-mist px-3 py-1 text-xs text-slate">
            {slug}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium">
        <Link href={`/compare?slugs=${encodeURIComponent(slugs.join(","))}`} className="text-teal">
          Compare now
        </Link>
        <button type="button" onClick={() => writeSlugs([])} className="text-coral">
          Clear
        </button>
      </div>
    </div>
  );
}
