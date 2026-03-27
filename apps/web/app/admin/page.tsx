import Link from "next/link";

import { AppHeader } from "../../components/app-header";
import { getAdminOverview, getAdminUsers } from "../../lib/admin";
import type { AdminUserSummary, AnalyticsOverview } from "../../lib/types";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export default async function AdminPage() {
  let overview: AnalyticsOverview;
  let users: AdminUserSummary[];

  try {
    [overview, { items: users }] = await Promise.all([getAdminOverview(), getAdminUsers()]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin data is unavailable.";
    return (
      <main className="page-shell">
        <section className="glass-panel rounded-[32px] p-6 shadow-glow md:p-8">
          <AppHeader
            eyebrow="Admin"
            title="Admin access is not ready."
            description={message}
            links={[
              { href: "/", label: "Landing" },
              { href: "/dashboard", label: "Dashboard" }
            ]}
          />
          <div className="mt-8 rounded-3xl border border-coral/20 bg-white/90 p-6 text-sm leading-7 text-slate">
            Set `INTERN_TRACKER_ADMIN_TOKEN` on both the API and web services, then reload this page.
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="glass-panel rounded-[32px] p-6 shadow-glow md:p-8">
        <AppHeader
          eyebrow="Admin"
          title="User and platform overview"
          description="Review account creation, onboarding progress, and tracker usage from one production-facing panel."
          links={[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/opportunities", label: "Feed" }
          ]}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            ["Active users", overview.active_users.toString()],
            ["Opportunities", overview.new_opportunities.toString()],
            ["Saved apps", overview.saved_applications.toString()],
            ["Applied apps", overview.applied_applications.toString()]
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-white/60 bg-white/90 p-5">
              <p className="text-sm text-slate">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-[28px] border border-white/60 bg-white/90 p-5 shadow-glow">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-ink">Stored users</h2>
              <p className="text-sm leading-6 text-slate">
                The API stores profile and tracker data in PostgreSQL when database mode is enabled.
              </p>
            </div>
            <p className="text-sm text-slate">{users.length} user records</p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm">
              <thead>
                <tr className="text-slate">
                  <th className="px-3 py-2 font-medium">User</th>
                  <th className="px-3 py-2 font-medium">Contact</th>
                  <th className="px-3 py-2 font-medium">Academics</th>
                  <th className="px-3 py-2 font-medium">Location</th>
                  <th className="px-3 py-2 font-medium">Tracker</th>
                  <th className="px-3 py-2 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="rounded-2xl bg-mist text-ink">
                    <td className="rounded-l-2xl px-3 py-4 align-top">
                      <div className="font-medium">{user.full_name}</div>
                      <div className="mt-1 text-xs text-slate">{user.id}</div>
                    </td>
                    <td className="px-3 py-4 align-top text-slate">
                      <div>{user.email ?? "No email"}</div>
                      <div className="mt-1">{user.phone ?? "No phone"}</div>
                    </td>
                    <td className="px-3 py-4 align-top text-slate">
                      <div>{user.college_name ?? "No college"}</div>
                      <div className="mt-1">
                        {[user.degree, user.branch, user.graduation_year?.toString()].filter(Boolean).join(" | ") ||
                          "Not completed"}
                      </div>
                    </td>
                    <td className="px-3 py-4 align-top text-slate">
                      {[user.city, user.country].filter(Boolean).join(", ") || "Not provided"}
                    </td>
                    <td className="px-3 py-4 align-top text-slate">
                      <div>{user.applications_count} applications</div>
                      <div className="mt-1">
                        {user.onboarding_completed ? "Onboarding complete" : "Onboarding incomplete"}
                      </div>
                    </td>
                    <td className="rounded-r-2xl px-3 py-4 align-top text-slate">{formatDate(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-sm text-slate">
            Direct API access also works:
            {" "}
            <code>GET /api/v1/admin/users</code>
            {" "}
            with the
            {" "}
            <code>X-Admin-Token</code>
            {" "}
            header.
          </div>
        </section>
      </section>
    </main>
  );
}
