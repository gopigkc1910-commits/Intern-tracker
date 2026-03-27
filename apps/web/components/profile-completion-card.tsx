import Link from "next/link";

import type { UserProfile } from "../lib/types";

function completionScore(profile: UserProfile) {
  const checks = [
    profile.college_name,
    profile.degree,
    profile.branch,
    profile.city,
    profile.country,
    profile.bio,
    profile.goals,
    profile.github_url,
    profile.linkedin_url,
    profile.resume_url,
    profile.skills.length > 0 ? "skills" : null,
    profile.preferred_domains.length > 0 ? "domains" : null,
    profile.preferred_locations.length > 0 ? "locations" : null,
    profile.preferred_opportunity_types.length > 0 ? "types" : null
  ];

  const completed = checks.filter(Boolean).length;
  const total = checks.length;
  return Math.round((completed / total) * 100);
}

export function ProfileCompletionCard({ profile }: { profile: UserProfile }) {
  const percent = completionScore(profile);

  return (
    <section className="rounded-3xl border border-white/60 bg-white/90 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">Profile completion</h2>
          <p className="mt-1 text-sm text-slate">A stronger profile improves recommendations and reminders.</p>
        </div>
        <div className="text-2xl font-semibold text-ink">{percent}%</div>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-mist">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal to-coral transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate">
          {percent >= 80 ? "Your profile is in strong shape." : "Add more detail to unlock better matches."}
        </p>
        <Link href="/profile" className="text-sm font-medium text-teal">
          Improve profile
        </Link>
      </div>
    </section>
  );
}
