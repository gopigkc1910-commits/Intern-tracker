import Link from "next/link";

import { AppHeader } from "../../components/app-header";
import { listOpportunities } from "../../lib/api";
import type { OpportunitySummary } from "../../lib/types";

export const dynamic = "force-dynamic";

type OpportunitiesPageProps = {
  searchParams?: {
    search?: string;
    type?: string;
    mode?: string;
  };
};

function deadlineLabel(value: string | null) {
  if (!value) return "Rolling";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(value));
}

export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const currentFilters = searchParams ?? {};
  let items: OpportunitySummary[] = [];
  let error = false;

  try {
    items = await listOpportunities(currentFilters);
  } catch {
    error = true;
  }

  return (
    <main className="page-shell">
      <section className="glass-panel rounded-[32px] p-6 shadow-glow md:p-8">
        <AppHeader
          eyebrow="Opportunity Feed"
          title="Search, filter, and act quickly."
          description="Browse the database-backed feed, then open a detail view to save or apply."
          links={[
            { href: "/", label: "Landing" },
            { href: "/dashboard", label: "Dashboard" },
            { href: "/profile", label: "Profile" }
          ]}
        />

        <form className="mt-8 grid gap-4 rounded-[28px] border border-teal/10 bg-white/90 p-5 md:grid-cols-[2fr_1fr_1fr_auto]">
          <input
            type="text"
            name="search"
            defaultValue={currentFilters.search ?? ""}
            placeholder="Search by role, domain, or location"
            className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 text-sm outline-none"
          />
          <select
            name="type"
            defaultValue={currentFilters.type ?? ""}
            className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 text-sm outline-none"
          >
            <option value="">All types</option>
            <option value="internship">Internship</option>
            <option value="hackathon">Hackathon</option>
            <option value="scholarship">Scholarship</option>
            <option value="event">Event</option>
          </select>
          <select
            name="mode"
            defaultValue={currentFilters.mode ?? ""}
            className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 text-sm outline-none"
          >
            <option value="">All modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
          <button type="submit" className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-mist">
            Apply Filters
          </button>
        </form>

        {error ? (
          <div className="mt-8 rounded-3xl border border-coral/20 bg-white/90 p-6 text-sm text-slate">
            Could not load opportunities. Start the API and database, then refresh this page.
          </div>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-teal/10 bg-white/90 p-6 text-sm text-slate">
            No opportunities match the current filters yet. Try a broader keyword or reset the filters.
          </div>
        ) : (
          <>
            <div className="mt-8 flex items-center justify-between text-sm text-slate">
              <p>{items.length} opportunities available right now</p>
              <p>Open a detail page to save or apply.</p>
            </div>
            <div className="mt-4 grid gap-5">
            {items.map((item) => (
              <article key={item.id} className="rounded-[28px] border border-white/60 bg-white/90 p-5 shadow-glow">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-teal">
                      <span>{item.type}</span>
                      <span>{item.domain}</span>
                      <span>{item.mode}</span>
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold text-ink">{item.title}</h2>
                    <p className="mt-1 text-sm text-slate">
                      {item.organization} | {item.location_text ?? "Location flexible"}
                    </p>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate">{item.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-teal/10 px-3 py-1 text-xs text-teal">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-mist p-4 text-sm text-slate">
                    <p className="font-medium text-ink">Deadline</p>
                    <p className="mt-1">{deadlineLabel(item.deadline_at)}</p>
                    <Link
                      href={`/opportunities/${item.slug}`}
                      className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-mist"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
