"use client";

import { useState } from "react";

import { clientJsonFetch } from "../lib/client-json";
import { siteConfig } from "../lib/site-config";

const categories = ["Bug report", "Feature request", "General feedback"] as const;

export function FeedbackComposer() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Bug report");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mailtoHref = `mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(
    `${siteConfig.feedbackEmailSubject} - ${category}`
  )}&body=${encodeURIComponent(message.trim() || "Share your feedback here.")}`;

  return (
    <div className="rounded-[30px] border border-white/60 bg-white/90 p-6">
      <h2 className="text-xl font-semibold text-ink">Send feedback from the app</h2>
      <p className="mt-2 text-sm leading-6 text-slate">
        Pick a category, add a short message, and your mail app will open with everything prefilled.
      </p>

      <div className="mt-5 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate">
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 outline-none"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm text-slate">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as (typeof categories)[number])}
            className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 outline-none"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm text-slate">
          Message
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={6}
            placeholder="What happened, what you expected, or what you want added next"
            className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 outline-none"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isSubmitting || message.trim().length < 5}
            onClick={async () => {
              setIsSubmitting(true);
              setStatus(null);
              try {
                await clientJsonFetch("/api/feedback", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    category,
                    message: message.trim(),
                    name: name.trim() || undefined,
                    email: email.trim() || undefined
                  })
                });
                setMessage("");
                setStatus("Feedback submitted. It will now appear in the admin inbox.");
              } catch (error) {
                setStatus(error instanceof Error ? error.message : "Feedback submission failed.");
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-mist"
          >
            {isSubmitting ? "Submitting..." : "Submit feedback"}
          </button>
          <a href={mailtoHref} className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-mist">
            Open email draft
          </a>
          <a
            href={`${siteConfig.githubUrl}/issues`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-teal/20 bg-white px-5 py-3 text-sm font-medium text-teal"
          >
            Open GitHub issues
          </a>
        </div>

        {status ? <p className="text-sm text-slate">{status}</p> : null}
      </div>
    </div>
  );
}
