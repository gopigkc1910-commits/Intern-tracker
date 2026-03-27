"use client";

import { useState, useTransition } from "react";

import { clientJsonFetch } from "../lib/client-json";

type SaveSearchButtonProps = {
  isAuthenticated: boolean;
  filters: {
    search?: string;
    type?: string;
    mode?: string;
    verified?: string;
    deadline_days?: string;
    paid_only?: string;
    min_stipend?: string;
  };
};

export function SaveSearchButton({ isAuthenticated, filters }: SaveSearchButtonProps) {
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isAuthenticated) {
    return <p className="text-sm text-slate">Sign in to save your favorite searches.</p>;
  }

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-[22px] border border-teal/10 bg-mist/70 p-4 md:flex-row md:items-center">
      <input
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        placeholder="Name this search, e.g. Remote AI internships"
        className="min-w-0 flex-1 rounded-2xl border border-teal/15 bg-white px-4 py-3 text-sm outline-none"
      />
      <button
        type="button"
        disabled={isPending || label.trim().length < 2}
        onClick={() => {
          startTransition(async () => {
            try {
              await clientJsonFetch("/api/saved-searches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  label: label.trim(),
                  search: filters.search || undefined,
                  type: filters.type || undefined,
                  mode: filters.mode || undefined,
                  verified: filters.verified === "true",
                  deadline_days: filters.deadline_days ? Number(filters.deadline_days) : undefined,
                  paid_only: filters.paid_only === "true",
                  min_stipend: filters.min_stipend ? Number(filters.min_stipend) : undefined
                })
              });
              setMessage("Search saved to your dashboard.");
              setLabel("");
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Could not save this search.");
            }
          });
        }}
        className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-mist"
      >
        {isPending ? "Saving..." : "Save search"}
      </button>
      {message ? <p className="text-sm text-slate">{message}</p> : null}
    </div>
  );
}
