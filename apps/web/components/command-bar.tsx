"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const quickLinks = [
  { href: "/opportunities", label: "Explore opportunities" },
  { href: "/dashboard", label: "Open dashboard" },
  { href: "/profile", label: "Edit profile" },
  { href: "/feedback", label: "Send feedback" }
];

export function CommandBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-teal/20 bg-white/80 px-4 py-2 text-sm text-slate"
      >
        Search
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-ink/30 p-4 backdrop-blur-sm">
          <div className="mx-auto mt-20 max-w-2xl rounded-[28px] border border-white/60 bg-white p-5 shadow-glow">
            <div className="flex items-center gap-3 rounded-2xl border border-teal/15 bg-mist px-4 py-3">
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && query.trim()) {
                    router.push(`/opportunities?search=${encodeURIComponent(query.trim())}`);
                    setOpen(false);
                    setQuery("");
                  }
                }}
                placeholder="Search opportunities, or use quick links below"
                className="w-full bg-transparent text-sm outline-none"
              />
              <span className="text-xs uppercase tracking-[0.18em] text-slate">Enter</span>
            </div>

            <div className="mt-5 grid gap-3">
              {quickLinks.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => {
                    router.push(item.href);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="rounded-2xl bg-mist px-4 py-3 text-left text-sm text-ink"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
