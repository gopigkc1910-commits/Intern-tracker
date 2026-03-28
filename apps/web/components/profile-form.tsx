"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { clientJsonFetch } from "../lib/client-json";
import type { UserProfile } from "../lib/types";

function fromCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isValidUrl(url: string): boolean {
  if (!url) return true; // Empty is ok
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidGraduationYear(year: string): boolean {
  if (!year) return true; // Empty is ok
  const num = Number(year);
  return Number.isInteger(num) && num >= 2000 && num <= 2050;
}

export function ProfileForm({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState({
    full_name: profile.full_name ?? "",
    college_name: profile.college_name ?? "",
    degree: profile.degree ?? "",
    branch: profile.branch ?? "",
    graduation_year: profile.graduation_year?.toString() ?? "",
    city: profile.city ?? "",
    country: profile.country ?? "",
    bio: profile.bio ?? "",
    goals: profile.goals ?? "",
    preferred_domains: profile.preferred_domains.join(", "),
    preferred_locations: profile.preferred_locations.join(", "),
    preferred_opportunity_types: profile.preferred_opportunity_types.join(", "),
    skills: profile.skills.join(", "),
    github_url: profile.github_url ?? "",
    linkedin_url: profile.linkedin_url ?? "",
    resume_url: profile.resume_url ?? ""
  });

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        
        // Validation
        if (!isValidGraduationYear(formState.graduation_year)) {
          setMessage("Graduation year must be between 2000 and 2050.");
          return;
        }
        if (!isValidUrl(formState.github_url)) {
          setMessage("GitHub URL is invalid. Use a full URL like https://github.com/username");
          return;
        }
        if (!isValidUrl(formState.linkedin_url)) {
          setMessage("LinkedIn URL is invalid. Use a full URL like https://linkedin.com/in/username");
          return;
        }
        if (!isValidUrl(formState.resume_url)) {
          setMessage("Resume URL is invalid. Use a full URL like https://example.com/resume.pdf");
          return;
        }
        
        startTransition(async () => {
          try {
            await clientJsonFetch<UserProfile>("/api/profile", {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                full_name: formState.full_name,
                college_name: formState.college_name,
                degree: formState.degree,
                branch: formState.branch,
                graduation_year: formState.graduation_year ? Number(formState.graduation_year) : null,
                city: formState.city,
                country: formState.country,
                bio: formState.bio,
                goals: formState.goals,
                preferred_domains: fromCommaList(formState.preferred_domains),
                preferred_locations: fromCommaList(formState.preferred_locations),
                preferred_opportunity_types: fromCommaList(formState.preferred_opportunity_types),
                skills: fromCommaList(formState.skills),
                github_url: formState.github_url,
                linkedin_url: formState.linkedin_url,
                resume_url: formState.resume_url,
                onboarding_completed: true
              })
            });
            setMessage("Profile saved. Recommendations will reflect the new preferences.");
            router.refresh();
          } catch {
            setMessage("Could not save the profile. Make sure the API is available.");
          }
        });
      }}
    >
      <div className="rounded-3xl bg-mist px-5 py-4 text-sm leading-6 text-slate">
        Keep this practical: list the domains, opportunity types, and skills you want the dashboard to match against.
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {[
          ["full_name", "Full name"],
          ["college_name", "College"],
          ["degree", "Degree"],
          ["branch", "Branch"],
          ["graduation_year", "Graduation year"],
          ["city", "City"],
          ["country", "Country"],
          ["github_url", "GitHub URL"],
          ["linkedin_url", "LinkedIn URL"],
          ["resume_url", "Resume URL"]
        ].map(([key, label]) => (
          <label key={key} className="grid gap-2 text-sm font-medium text-ink">
            {label}
            <input
              value={formState[key as keyof typeof formState]}
              onChange={(event) =>
                setFormState((current) => ({ ...current, [key]: event.target.value }))
              }
              className="rounded-2xl border border-teal/15 bg-white px-4 py-3 text-sm text-ink outline-none"
            />
          </label>
        ))}
      </div>

      <label className="grid gap-2 text-sm font-medium text-ink">
        Bio
        <textarea
          value={formState.bio}
          onChange={(event) => setFormState((current) => ({ ...current, bio: event.target.value }))}
          className="min-h-24 rounded-2xl border border-teal/15 bg-white px-4 py-3 text-sm text-ink outline-none"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-ink">
        Goals
        <textarea
          value={formState.goals}
          onChange={(event) => setFormState((current) => ({ ...current, goals: event.target.value }))}
          className="min-h-24 rounded-2xl border border-teal/15 bg-white px-4 py-3 text-sm text-ink outline-none"
        />
      </label>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          ["preferred_domains", "Preferred domains"],
          ["preferred_locations", "Preferred locations"],
          ["preferred_opportunity_types", "Preferred opportunity types"],
          ["skills", "Skills"]
        ].map(([key, label]) => (
          <label key={key} className="grid gap-2 text-sm font-medium text-ink">
            {label}
            <textarea
              value={formState[key as keyof typeof formState]}
              onChange={(event) =>
                setFormState((current) => ({ ...current, [key]: event.target.value }))
              }
              className="min-h-24 rounded-2xl border border-teal/15 bg-white px-4 py-3 text-sm text-ink outline-none"
            />
          </label>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-mist"
        >
          {isPending ? "Saving..." : "Save Profile"}
        </button>
        {message ? <p className="text-sm text-slate">{message}</p> : null}
      </div>
      <p className="text-xs leading-5 text-slate">
        Tip: separate multiple entries with commas, for example `AI, Backend, Product`.
      </p>
    </form>
  );
}
