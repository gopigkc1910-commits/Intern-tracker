"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Home" },
  { href: "/opportunities", label: "Explore" },
  { href: "/feedback", label: "Feedback" },
  { href: "/profile", label: "Profile" }
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-full border border-white/60 bg-white/90 px-4 py-3 shadow-glow md:hidden">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-3 py-2 text-sm ${active ? "bg-ink text-mist" : "text-slate"}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
