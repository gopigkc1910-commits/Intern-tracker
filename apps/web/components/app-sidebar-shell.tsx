"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { siteConfig } from "../lib/site-config";
import { BrandMark } from "./brand-mark";
import { SessionActionButton } from "./session-action-button";

type AppSidebarShellProps = {
  children: ReactNode;
  isAuthenticated: boolean;
  showAdminLink?: boolean;
};

type SidebarLink = {
  href: string;
  label: string;
  match: "exact" | "type" | "opportunities";
  type?: string;
};

const primaryLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Overview", match: "exact" as const },
  { href: "/opportunities?type=internship", label: "Internships", match: "type", type: "internship" },
  { href: "/opportunities?type=hackathon", label: "Hackathons", match: "type", type: "hackathon" },
  { href: "/opportunities?type=scholarship", label: "Scholarships", match: "type", type: "scholarship" },
  { href: "/opportunities", label: "All opportunities", match: "opportunities" as const }
];

const secondaryLinks: SidebarLink[] = [
  { href: "/profile", label: "Profile settings", match: "exact" as const },
  { href: "/feedback", label: "Feedback", match: "exact" as const },
  { href: "/help", label: "Help", match: "exact" as const }
];

function isLinkActive(pathname: string, currentType: string | null, link: SidebarLink) {
  if (link.match === "exact") {
    return pathname === link.href;
  }
  if (link.match === "type") {
    return pathname === "/opportunities" && currentType === link.type;
  }
  return pathname === "/opportunities" && currentType === null;
}

export function AppSidebarShell({
  children,
  isAuthenticated,
  showAdminLink = false
}: AppSidebarShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type");

  return (
    <main className="page-shell">
      <div className="app-shell-grid gap-6">
        <aside className="glass-panel app-shell-sidebar soft-grid rounded-[32px] p-5 shadow-glow">
          <div className="rounded-[28px] bg-ink px-5 py-6 text-mist">
            <BrandMark compact />
            <h2 className="mt-3 text-2xl font-semibold">Student control center</h2>
            <p className="mt-3 text-sm leading-6 text-mint/80">
              Track opportunities, stay organized, and move faster across applications.
            </p>
          </div>

          <nav className="mt-6 space-y-6">
            <div>
              <p className="px-2 text-xs font-semibold uppercase tracking-[0.28em] text-teal">Discover</p>
              <div className="mt-3 space-y-2">
                {primaryLinks.map((link) => {
                  const active = isLinkActive(pathname, currentType, link);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`app-shell-link ${active ? "app-shell-link-active" : ""}`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {isAuthenticated ? (
              <div>
                <p className="px-2 text-xs font-semibold uppercase tracking-[0.28em] text-teal">Manage</p>
                <div className="mt-3 space-y-2">
                  {secondaryLinks.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={`${link.href}-${link.label}`}
                        href={link.href}
                        className={`app-shell-link ${active ? "app-shell-link-active" : ""}`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                  {showAdminLink ? (
                    <Link
                      href="/admin"
                      className={`app-shell-link ${pathname === "/admin" ? "app-shell-link-active" : ""}`}
                    >
                      Admin panel
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </nav>

          <div className="mt-6 rounded-[28px] border border-white/60 bg-white/80 p-5">
            <p className="text-sm font-semibold text-ink">Quick actions</p>
            <div className="mt-4 space-y-3">
              <Link href="/opportunities" className="app-shell-utility">
                Browse fresh opportunities
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/feedback" className="app-shell-utility">
                    Leave feedback
                  </Link>
                  <Link href="/profile" className="app-shell-utility">
                    Update your profile
                  </Link>
                </>
              ) : null}
              <Link href="/help" className="app-shell-utility">
                Open help center
              </Link>
              <SessionActionButton
                isAuthenticated={isAuthenticated}
                className="app-shell-utility w-full text-left"
              />
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-teal/10 bg-white/80 p-5 text-sm text-slate">
            <p className="font-semibold text-ink">Connect with me</p>
            <div className="mt-4 space-y-3">
              <a href={`mailto:${siteConfig.supportEmail}`} className="app-shell-utility">
                Email
              </a>
              <a href={siteConfig.linkedinUrl} target="_blank" rel="noreferrer" className="app-shell-utility">
                LinkedIn
              </a>
              <a href={siteConfig.githubUrl} target="_blank" rel="noreferrer" className="app-shell-utility">
                GitHub
              </a>
            </div>
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}
