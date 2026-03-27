"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createApplication, getBrowserDemoToken, updateApplication } from "../lib/api";
import type { ApplicationRecord } from "../lib/types";

type OpportunityActionPanelProps = {
  opportunityId: string;
  existingApplication?: ApplicationRecord;
};

export function OpportunityActionPanel({
  opportunityId,
  existingApplication
}: OpportunityActionPanelProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const runAction = (status: "saved" | "applied") => {
    startTransition(async () => {
      const token = getBrowserDemoToken();
      if (!token) {
        setMessage("Start the demo session first to save or apply.");
        return;
      }

      try {
        if (existingApplication) {
          await updateApplication(token, existingApplication.id, { status });
        } else {
          await createApplication(token, { opportunity_id: opportunityId, status });
        }
        setMessage(status === "saved" ? "Saved to your tracker." : "Application marked as submitted.");
        router.refresh();
      } catch {
        setMessage("Action failed. Check whether the API is running.");
      }
    });
  };

  return (
    <div className="rounded-3xl border border-teal/15 bg-white/85 p-5 shadow-glow">
      <h3 className="text-lg font-semibold text-ink">Your next step</h3>
      <p className="mt-2 text-sm leading-6 text-slate">
        {existingApplication
          ? `Current tracker status: ${existingApplication.status}. You can update it anytime.`
          : "Save this opportunity to your dashboard or mark it as applied once you submit."}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => runAction("saved")}
          className="rounded-full border border-teal/20 bg-mist px-5 py-2.5 text-sm font-medium text-teal"
        >
          {existingApplication ? "Move to Saved" : "Save Opportunity"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => runAction("applied")}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-mist"
        >
          Mark as Applied
        </button>
      </div>
      {message ? <p className="mt-3 text-sm text-slate">{message}</p> : null}
    </div>
  );
}
