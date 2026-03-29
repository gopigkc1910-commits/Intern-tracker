import { redirect } from "next/navigation";

import { BrandMark } from "../components/brand-mark";
import { AuthEntryPanel } from "../components/auth-entry-panel";
import { getServerAuthToken } from "../lib/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const token = await getServerAuthToken();

  // If user is authenticated, redirect directly to dashboard
  if (token) {
    redirect("/dashboard");
  }

  return (
    <main className="page-shell flex min-h-screen items-center justify-center">
      <section className="glass-panel soft-grid overflow-hidden rounded-[36px] w-full max-w-5xl p-6 shadow-glow md:p-10 animate-slide-up">
        <nav className="mb-10 flex flex-col items-center justify-center">
          <BrandMark />
        </nav>

        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex rounded-full bg-teal/10 px-3 py-1 text-sm font-medium text-teal">
            The Modern Student Tracking Platform
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Never miss a deadline again.
          </h1>
          <p className="mt-5 text-base leading-8 text-slate">
            Sign in to discover premium internships, save opportunities, get personalized matches, and manage your applications in one centralized dashboard.
          </p>

          <div className="mt-10 mx-auto max-w-xl text-left">
            <AuthEntryPanel redirectTo="/dashboard" />
          </div>
        </div>

      </section>
    </main>
  );
}
