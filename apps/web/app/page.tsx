import Link from "next/link";

import { BrandMark } from "../components/brand-mark";
import { AuthEntryPanel } from "../components/auth-entry-panel";
import { getServerAuthToken } from "../lib/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const token = await getServerAuthToken();

  // If user is authenticated, redirect to dashboard
  if (token) {
    return (
      <main className="page-shell">
        <section className="glass-panel rounded-[32px] p-8 shadow-glow">
          <p className="text-xs uppercase tracking-[0.3em] text-teal">Welcome Back</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">You're all set!</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate">
            Your dashboard is ready with personalized opportunities, saved searches, and application tracking.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-mist">
              Open Dashboard
            </Link>
            <Link href="/opportunities" className="rounded-full border border-teal/20 bg-mist px-5 py-3 text-sm font-medium text-teal">
              Explore Opportunities
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="glass-panel soft-grid overflow-hidden rounded-[36px] p-6 shadow-glow md:p-10">
        <nav className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <BrandMark />
          <div className="pill-nav flex-wrap text-sm text-slate">
            <Link href="/opportunities">Explore</Link>
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
              Discover internships, hackathons, scholarships, and events.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate">
              Track what matters before it closes. Sign in to save opportunities, get personalized recommendations, and manage your applications in one organized dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/opportunities" className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-mist">
                Browse Opportunities
              </Link>
            </div>

            <div className="mt-6 max-w-2xl">
              <AuthEntryPanel redirectTo="/dashboard" />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Browse", "Search internships, hackathons, scholarships from one place."],
                ["Save & Track", "Save opportunities and update application statuses easily."],
                ["Match Fast", "Get personalized recommendations based on your profile."]
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
                <div className="text-sm text-mint">Explore</div>
                <div className="text-2xl font-semibold">as a guest first</div>
              </div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs">No login needed</div>
            </div>
            <p className="text-sm leading-6 text-mint/80">
              Browse the full database of opportunities, compare options, and explore filters. Sign in when you're ready to save, track status, and get personalized matches.
            </p>
            <Link href="/opportunities" className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-mint">
              Start browsing →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
