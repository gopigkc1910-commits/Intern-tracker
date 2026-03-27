"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { clientJsonFetch } from "../lib/client-json";
import type { AdminFeedbackItem } from "../lib/types";

const feedbackStatuses = ["new", "reviewing", "planned", "resolved"];

export function AdminFeedbackTriage({ items }: { items: AdminFeedbackItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <div className="mt-6 rounded-[24px] bg-mist p-5 text-sm text-slate">
        No feedback has been submitted yet. The feedback form will populate this inbox automatically.
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="rounded-[24px] bg-mist p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-teal">
              {item.category}
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-slate">{item.created_at.slice(0, 10)}</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-ink">{item.message}</p>
          <div className="mt-4 text-sm text-slate">
            <div>{item.name ?? item.user_name ?? "Anonymous visitor"}</div>
            <div>{item.email ?? "No email provided"}</div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <select
              defaultValue={item.status}
              disabled={isPending}
              onChange={(event) => {
                const nextStatus = event.target.value;
                startTransition(async () => {
                  await clientJsonFetch(`/api/admin/feedback/${item.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: nextStatus })
                  });
                  router.refresh();
                });
              }}
              className="rounded-full border border-teal/15 bg-white px-4 py-2 text-sm text-ink"
            >
              {feedbackStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <span className="text-xs uppercase tracking-[0.18em] text-slate">
              {isPending ? "Updating..." : `Status: ${item.status}`}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
