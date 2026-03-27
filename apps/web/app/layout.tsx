import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Intern Tracker",
  description: "Discover, track, and act on internships, hackathons, scholarships, and student opportunities."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-mist text-ink antialiased">{children}</body>
    </html>
  );
}
