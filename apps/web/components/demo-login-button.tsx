"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { DEMO_TOKEN_COOKIE, verifyDemoOtp } from "../lib/api";

type DemoLoginButtonProps = {
  redirectTo?: string;
  className?: string;
};

export function DemoLoginButton({ redirectTo = "/dashboard", className = "" }: DemoLoginButtonProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className={className}
        onClick={() => {
          startTransition(async () => {
            try {
              const response = await verifyDemoOtp();
              document.cookie = `${DEMO_TOKEN_COOKIE}=${encodeURIComponent(response.access_token)}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
              router.push(redirectTo);
              router.refresh();
            } catch {
              setMessage("Could not start the demo session. Make sure the API is running.");
            }
          });
        }}
        disabled={isPending}
      >
        {isPending ? "Starting Demo..." : "Start Demo Session"}
      </button>
      <p className="text-xs leading-5 text-slate">
        Uses the built-in demo account and sample data, so you can explore everything immediately.
      </p>
      {message ? <p className="text-sm text-coral">{message}</p> : null}
    </div>
  );
}
