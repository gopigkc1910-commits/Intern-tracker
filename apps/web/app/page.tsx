import Link from "next/link";

import { BrandMark } from "../components/brand-mark";
import { AuthEntryPanel } from "../components/auth-entry-panel";
import { listOpportunities } from "../lib/api";
import type { OpportunitySummary } from "../lib/types";

export const dynamic = "force-dynamic";

function formatDeadline(value: string | null) {
  if (!value) {
    return "Rolling";
  }
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(value));
}

export default async function HomePage() {
  let featured: OpportunitySummary[] = [];
  let apiError = false;

  try {
    featured = (await listOpportunities()).slice(0, 3);
  } catch {
    apiError = true;
  }

  return (
    <main className="page-shell">
      <section className="glass-panel soft-grid overflow-hidden rounded-[36px] p-6 shadow-glow md:p-10">
        <nav className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <BrandMark />
          <div className="pill-nav flex-wrap text-sm text-slate">
            <Link href="/opportunities">Explore</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/opportunities?type=hackathon">Hackathons</Link>
            <Link href="/feedback">Feedback</Link>
            <Link href="/help">Help</Link>
          </div>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.9fr] lg:items-start">
          <div>
            <p className="inline-flex rounded-full bg-teal/10 px-3 py-1 text-sm font-medium text-teal">
              Built for students who do not want to miss deadlines
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Discover internships, hackathons, scholarships, and events. Track what matters before it closes.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate">
              Browse opportunities as a guest, then sign in with email or phone when you are ready to save, track,
              personalize recommendations, and build a stronger search workflow.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/opportunities" className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-mist">
                Explore Opportunities
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-teal/20 bg-mist px-6 py-3 text-sm font-medium text-teal"
              >
                Open Dashboard
              </Link>
            </div>

            <div className="mt-6 max-w-2xl">
              <AuthEntryPanel redirectTo="/dashboard" />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Browse fast", "Search internships, hackathons, scholarships, and events from one place."],
                ["Track clearly", "Save or apply, then update statuses from a single dashboard."],
                ["Tune matches", "Edit profile preferences and watch recommendations shift in real time."]
              ].map(([title, copy]) => (
                <div key={title} className="soft-card p-4">
                  <h2 className="text-sm font-semibold text-ink">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-ink p-5 text-mist">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-sm text-mint">Fresh opportunities</div>
                <div className="text-2xl font-semibold">Production seed feed</div>
              </div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs">Guest friendly</div>
            </div>

            {apiError ? (
              <div className="rounded-2xl bg-white/10 p-4 text-sm text-mint">
                The API is still waking up. Refresh in a moment to see the live feed.
              </div>
            ) : (
              <div className="space-y-4">
                {featured.map((item) => (
                  <article key={item.id} className="rounded-2xl bg-white/8 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-medium">{item.title}</div>
                        <div className="mt-1 text-sm text-mint">{item.organization}</div>
                      </div>
                      <div className="rounded-full bg-white/10 px-3 py-1 text-xs">
                        {formatDeadline(item.deadline_at)}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-white/10 px-2.5 py-1 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
