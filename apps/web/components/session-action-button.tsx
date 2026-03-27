"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { clientJsonFetch } from "../lib/client-json";

type SessionActionButtonProps = {
  isAuthenticated: boolean;
  className?: string;
};

export function SessionActionButton({ isAuthenticated, className = "" }: SessionActionButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!isAuthenticated) {
    return (
      <Link href="/" className={className}>
        Sign in
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await clientJsonFetch<{ ok: boolean }>("/api/auth/session", {
            method: "DELETE"
          });
          router.push("/");
          router.refresh();
        });
      }}
      className={className}
    >
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}
