"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "intern_radar_compare_slugs";
const MAX_COMPARE = 3;

function readSlugs() {
  if (typeof window === "undefined") return [] as string[];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function writeSlugs(slugs: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  window.dispatchEvent(new Event("intern-radar-compare-update"));
}

export function CompareToggleButton({ slug }: { slug: string }) {
  const [selected, setSelected] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setSelected(readSlugs().includes(slug));
    sync();
    window.addEventListener("intern-radar-compare-update", sync);
    return () => window.removeEventListener("intern-radar-compare-update", sync);
  }, [slug]);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => {
          const current = readSlugs();
          if (current.includes(slug)) {
            writeSlugs(current.filter((item) => item !== slug));
            setMessage("Removed from compare.");
            return;
          }
          if (current.length >= MAX_COMPARE) {
            setMessage("You can compare up to 3 opportunities.");
            return;
          }
          writeSlugs([...current, slug]);
          setMessage("Added to compare.");
        }}
        className={`rounded-full px-4 py-2 text-sm font-medium ${
          selected ? "bg-ink text-mist" : "border border-teal/20 bg-white text-teal"
        }`}
      >
        {selected ? "Added to compare" : "Compare"}
      </button>
      {message ? <p className="text-xs text-slate">{message}</p> : null}
    </div>
  );
}
