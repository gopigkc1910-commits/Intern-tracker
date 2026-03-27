import Link from "next/link";

type AppHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  links?: Array<{ href: string; label: string }>;
};

export function AppHeader({ eyebrow, title, description, links = [] }: AppHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="section-heading">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate">{description}</p>
      </div>
      {links.length > 0 ? (
        <div className="pill-nav flex-wrap text-sm text-slate">
          {links.map((link) => (
            <Link key={link.href + link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
