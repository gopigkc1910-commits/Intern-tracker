"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteApplication, getBrowserAuthToken, updateApplication } from "../lib/api";
import type { ApplicationRecord } from "../lib/types";

const STATUSES = ["saved", "applied", "shortlisted", "rejected", "accepted"] as const;

export function ApplicationStatusBoard({ items }: { items: ApplicationRecord[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateStatus = (applicationId: string, status: (typeof STATUSES)[number]) => {
    startTransition(async () => {
      const token = getBrowserAuthToken();
      if (!token) {
        setMessage("Sign in again to manage your tracker.");
        return;
      }
      try {
        await updateApplication(token, applicationId, { status });
        setMessage("Tracker updated.");
        router.refresh();
      } catch {
        setMessage("Could not update the tracker.");
      }
    });
  };

  const removeItem = (applicationId: string) => {
    startTransition(async () => {
      const token = getBrowserAuthToken();
      if (!token) {
        setMessage("Sign in again to manage your tracker.");
        return;
      }
      try {
        await deleteApplication(token, applicationId);
        setMessage("Item removed from tracker.");
        router.refresh();
      } catch {
        setMessage("Could not remove that item.");
      }
    });
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.id} className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-glow">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-teal">{item.status}</p>
              <h3 className="mt-1 text-xl font-semibold text-ink">{item.opportunity.title}</h3>
              <p className="mt-1 text-sm text-slate">
                {item.opportunity.organization} | {item.opportunity.mode} | {item.opportunity.domain}
              </p>
              {item.note ? <p className="mt-3 text-sm leading-6 text-slate">{item.note}</p> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={isPending}
                  onClick={() => updateStatus(item.id, status)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    item.status === status
                      ? "bg-ink text-mist"
                      : "border border-teal/20 bg-mist text-teal"
                  }`}
                >
                  {status}
                </button>
              ))}
              <button
                type="button"
                disabled={isPending}
                onClick={() => removeItem(item.id)}
                className="rounded-full border border-coral/30 px-3 py-1.5 text-xs font-medium text-coral"
              >
                Remove
              </button>
            </div>
          </div>
        </article>
      ))}
      {message ? <p className="text-sm text-slate">{message}</p> : null}
    </div>
  );
}
