"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { clientJsonFetch } from "../lib/client-json";
import type { SavedSearch } from "../lib/types";

function buildHref(item: SavedSearch) {
  const query = new URLSearchParams();
  if (item.search) query.set("search", item.search);
  if (item.type) query.set("type", item.type);
  if (item.mode) query.set("mode", item.mode);
  if (item.verified) query.set("verified", "true");
  if (item.deadline_days) query.set("deadline_days", item.deadline_days.toString());
  if (item.paid_only) query.set("paid_only", "true");
  if (item.min_stipend != null) query.set("min_stipend", item.min_stipend.toString());
  const suffix = query.toString();
  return suffix ? `/opportunities?${suffix}` : "/opportunities";
}

export function SavedSearchesPanel({ items }: { items: SavedSearch[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-teal/10 bg-white/90 p-6 text-sm text-slate">
        Save a search from the opportunities feed to quickly reopen your favorite filters here.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="rounded-[24px] border border-white/60 bg-white/90 p-5">
          <p className="font-semibold text-ink">{item.label}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              item.type,
              item.mode,
              item.verified ? "Verified" : null,
              item.paid_only ? "Paid" : null,
              item.deadline_days ? `${item.deadline_days}d deadline` : null,
              item.min_stipend != null ? `Min ${item.min_stipend}` : null
            ]
              .filter(Boolean)
              .map((chip) => (
                <span key={chip} className="rounded-full bg-teal/10 px-3 py-1 text-xs text-teal">
                  {chip}
                </span>
              ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium">
            <Link href={buildHref(item)} className="text-teal">
              Open search
            </Link>
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  await clientJsonFetch(`/api/saved-searches/${item.id}`, { method: "DELETE" });
                  router.refresh();
                });
              }}
              className="text-coral"
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
