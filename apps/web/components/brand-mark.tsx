import Link from "next/link";

import { siteConfig } from "../lib/site-config";

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <span className="brand-orb">
        <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12">
          <circle cx="24" cy="24" r="20" fill="rgba(255,255,255,0.18)" />
          <circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.45" />
          <circle cx="24" cy="24" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.65" />
          <path d="M24 6v18l12 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="36" cy="30" r="4" fill="currentColor" />
        </svg>
      </span>
      <span>
        <span className="block text-sm font-semibold uppercase tracking-[0.32em] text-teal">{siteConfig.name}</span>
        {!compact ? <span className="mt-1 block text-sm text-slate">{siteConfig.tagline}</span> : null}
      </span>
    </Link>
  );
}
