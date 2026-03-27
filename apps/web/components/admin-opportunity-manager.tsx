"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { clientJsonFetch } from "../lib/client-json";
import type { OpportunityDetail } from "../lib/types";

type OpportunityFormState = {
  title: string;
  organization: string;
  type: string;
  domain: string;
  mode: string;
  location_text: string;
  description: string;
  application_url: string;
  eligibility_text: string;
  required_skills: string;
  tags: string;
  stipend_min: string;
  stipend_max: string;
  currency: string;
  deadline_at: string;
  is_verified: boolean;
  status: string;
};

const emptyForm: OpportunityFormState = {
  title: "",
  organization: "",
  type: "internship",
  domain: "",
  mode: "Remote",
  location_text: "",
  description: "",
  application_url: "",
  eligibility_text: "",
  required_skills: "",
  tags: "",
  stipend_min: "",
  stipend_max: "",
  currency: "INR",
  deadline_at: "",
  is_verified: false,
  status: "published"
};

function toCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toFormState(item?: OpportunityDetail): OpportunityFormState {
  if (!item) return emptyForm;
  return {
    title: item.title,
    organization: item.organization,
    type: item.type,
    domain: item.domain,
    mode: item.mode,
    location_text: item.location_text ?? "",
    description: item.description,
    application_url: item.application_url,
    eligibility_text: item.eligibility_text ?? "",
    required_skills: item.required_skills.join(", "),
    tags: item.tags.join(", "),
    stipend_min: item.stipend_min?.toString() ?? "",
    stipend_max: item.stipend_max?.toString() ?? "",
    currency: item.currency ?? "INR",
    deadline_at: item.deadline_at ? item.deadline_at.slice(0, 10) : "",
    is_verified: item.is_verified,
    status: item.status
  };
}

export function AdminOpportunityManager({ opportunities }: { opportunities: OpportunityDetail[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formState, setFormState] = useState<OpportunityFormState>(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedOpportunity = opportunities.find((item) => item.id === selectedId);

  const submit = (mode: "create" | "update") => {
    startTransition(async () => {
      setMessage(null);
      try {
        const payload = {
          ...formState,
          location_text: formState.location_text || null,
          eligibility_text: formState.eligibility_text || null,
          required_skills: toCommaList(formState.required_skills),
          tags: toCommaList(formState.tags),
          stipend_min: formState.stipend_min ? Number(formState.stipend_min) : null,
          stipend_max: formState.stipend_max ? Number(formState.stipend_max) : null,
          currency: formState.currency || null,
          deadline_at: formState.deadline_at ? `${formState.deadline_at}T00:00:00.000Z` : null
        };

        if (mode === "create") {
          await clientJsonFetch("/api/admin/opportunities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          setMessage("Opportunity created.");
          setFormState(emptyForm);
          setSelectedId(null);
        } else if (selectedId) {
          await clientJsonFetch(`/api/admin/opportunities/${selectedId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          setMessage("Opportunity updated.");
        }
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Opportunity action failed.");
      }
    });
  };

  const remove = () => {
    if (!selectedId) return;
    startTransition(async () => {
      setMessage(null);
      try {
        await clientJsonFetch(`/api/admin/opportunities/${selectedId}`, {
          method: "DELETE"
        });
        setMessage("Opportunity deleted.");
        setSelectedId(null);
        setFormState(emptyForm);
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Delete failed.");
      }
    });
  };

  return (
    <section className="rounded-[30px] border border-white/60 bg-white/90 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Opportunity management</h2>
          <p className="mt-1 text-sm leading-6 text-slate">
            Create, edit, verify, draft, archive, or remove listings directly from admin.
          </p>
        </div>
        <p className="text-sm text-slate">{opportunities.length} listings</p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              setSelectedId(null);
              setFormState(emptyForm);
              setMessage("Ready to create a new listing.");
            }}
            className="w-full rounded-[22px] bg-ink px-4 py-3 text-left text-sm font-medium text-mist"
          >
            + New opportunity
          </button>
          <div className="max-h-[32rem] space-y-3 overflow-y-auto pr-1">
            {opportunities.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedId(item.id);
                  setFormState(toFormState(item));
                  setMessage(null);
                }}
                className={`w-full rounded-[22px] p-4 text-left ${
                  selectedId === item.id ? "bg-ink text-mist" : "bg-mist text-ink"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold">{item.title}</p>
                  <span className="text-xs uppercase tracking-[0.18em]">{item.status}</span>
                </div>
                <p className="mt-1 text-sm opacity-80">{item.organization}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] opacity-70">
                  {item.type} | {item.mode} | {item.domain}
                </p>
              </button>
            ))}
          </div>
        </div>

        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit(selectedOpportunity ? "update" : "create");
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["title", "Title"],
              ["organization", "Organization"],
              ["domain", "Domain"],
              ["location_text", "Location"],
              ["application_url", "Application URL"],
              ["currency", "Currency"]
            ].map(([key, label]) => (
              <label key={key} className="grid gap-2 text-sm font-medium text-ink">
                {label}
                <input
                  value={formState[key as keyof OpportunityFormState].toString()}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, [key]: event.target.value }))
                  }
                  className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 outline-none"
                />
              </label>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="grid gap-2 text-sm font-medium text-ink">
              Type
              <select
                value={formState.type}
                onChange={(event) => setFormState((current) => ({ ...current, type: event.target.value }))}
                className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 outline-none"
              >
                <option value="internship">Internship</option>
                <option value="hackathon">Hackathon</option>
                <option value="scholarship">Scholarship</option>
                <option value="event">Event</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink">
              Mode
              <select
                value={formState.mode}
                onChange={(event) => setFormState((current) => ({ ...current, mode: event.target.value }))}
                className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 outline-none"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink">
              Status
              <select
                value={formState.status}
                onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value }))}
                className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 outline-none"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink">
              Deadline
              <input
                type="date"
                value={formState.deadline_at}
                onChange={(event) => setFormState((current) => ({ ...current, deadline_at: event.target.value }))}
                className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-ink">
              Required skills
              <textarea
                value={formState.required_skills}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, required_skills: event.target.value }))
                }
                className="min-h-24 rounded-2xl border border-teal/15 bg-mist px-4 py-3 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink">
              Tags
              <textarea
                value={formState.tags}
                onChange={(event) => setFormState((current) => ({ ...current, tags: event.target.value }))}
                className="min-h-24 rounded-2xl border border-teal/15 bg-mist px-4 py-3 outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-ink">
              Description
              <textarea
                value={formState.description}
                onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                className="min-h-28 rounded-2xl border border-teal/15 bg-mist px-4 py-3 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink">
              Eligibility
              <textarea
                value={formState.eligibility_text}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, eligibility_text: event.target.value }))
                }
                className="min-h-28 rounded-2xl border border-teal/15 bg-mist px-4 py-3 outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-medium text-ink">
              Stipend min
              <input
                type="number"
                value={formState.stipend_min}
                onChange={(event) => setFormState((current) => ({ ...current, stipend_min: event.target.value }))}
                className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink">
              Stipend max
              <input
                type="number"
                value={formState.stipend_max}
                onChange={(event) => setFormState((current) => ({ ...current, stipend_max: event.target.value }))}
                className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 outline-none"
              />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-teal/15 bg-mist px-4 py-3 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={formState.is_verified}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, is_verified: event.target.checked }))
                }
              />
              Verified listing
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={isPending} className="rounded-full bg-ink px-5 py-3 text-sm text-mist">
              {isPending ? "Saving..." : selectedOpportunity ? "Update opportunity" : "Create opportunity"}
            </button>
            {selectedOpportunity ? (
              <button
                type="button"
                disabled={isPending}
                onClick={remove}
                className="rounded-full border border-coral/30 bg-white px-5 py-3 text-sm text-coral"
              >
                Delete opportunity
              </button>
            ) : null}
          </div>
          {message ? <p className="text-sm text-slate">{message}</p> : null}
        </form>
      </div>
    </section>
  );
}
