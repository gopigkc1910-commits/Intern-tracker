import Link from "next/link";

import { BrandMark } from "../components/brand-mark";

export default function NotFound() {
  return (
    <main className="page-shell">
      <section className="glass-panel soft-grid overflow-hidden rounded-[36px] p-10 shadow-glow">
        <div className="mx-auto max-w-2xl text-center">
          <BrandMark />
          
          <div className="mt-8">
            <p className="text-6xl font-bold text-ink">404</p>
            <h1 className="mt-3 text-3xl font-semibold text-ink">Page not found</h1>
            <p className="mt-4 text-slate">
              We couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-mist">
              Back to home
            </Link>
            <Link href="/opportunities" className="rounded-full border border-teal/20 px-6 py-3 text-sm font-medium text-teal">
              Browse opportunities
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              ["Dashboard", "/dashboard"],
              ["Profile", "/profile"],
              ["Help", "/help"]
            ].map(([label, href]) => (
              <Link key={href} href={href} className="rounded-2xl border border-white/60 bg-white/50 px-4 py-3 text-sm font-medium text-ink transition hover:bg-white/70">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
