import Link from "next/link";

import { AppHeader } from "../../components/app-header";
import { DemoLoginButton } from "../../components/demo-login-button";
import { ProfileForm } from "../../components/profile-form";
import { getProfile } from "../../lib/api";
import { getServerDemoToken } from "../../lib/session";
import type { UserProfile } from "../../lib/types";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const token = await getServerDemoToken();

  if (!token) {
    return (
      <main className="page-shell">
        <section className="glass-panel rounded-[32px] p-8 shadow-glow">
          <p className="text-xs uppercase tracking-[0.3em] text-teal">Profile</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">Start the demo session to edit your profile.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate">
            Profile preferences drive the recommendation score, so this is one of the most important screens in the
            MVP flow.
          </p>
          <div className="mt-6 max-w-sm">
            <DemoLoginButton
              redirectTo="/profile"
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-mist"
            />
          </div>
        </section>
      </main>
    );
  }

  let profile: UserProfile;
  try {
    profile = await getProfile(token);
  } catch {
    return (
      <main className="page-shell">
        <section className="glass-panel rounded-[32px] p-8 shadow-glow">
          <p className="text-xs uppercase tracking-[0.3em] text-teal">Profile</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">Profile data could not load.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate">
            Start the FastAPI backend and refresh this page. Your profile form is ready and will populate as soon as
            the API responds.
          </p>
          <div className="mt-6">
            <Link href="/dashboard" className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-mist">
              Back to dashboard
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="glass-panel rounded-[32px] p-6 shadow-glow md:p-8">
        <AppHeader
          eyebrow="Profile"
          title="Tune your recommendations."
          description="Update domains, locations, opportunity types, and skills. The dashboard recommendations are designed to react to these preferences."
          links={[{ href: "/dashboard", label: "Back to dashboard" }]}
        />

        <div className="mt-8 rounded-[30px] border border-white/60 bg-white/90 p-6">
          <ProfileForm profile={profile} />
        </div>
      </section>
    </main>
  );
}
