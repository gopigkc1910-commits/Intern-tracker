"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { getAuthProviders, requestOtp } from "../lib/api";
import { clientJsonFetch } from "../lib/client-json";
import type { AuthProvider } from "../lib/types";

type AuthEntryPanelProps = {
  redirectTo?: string;
  className?: string;
};

type Mode = "email" | "phone";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  // Basic phone validation: +XX or 10+ digits
  return /^(\+\d{1,3})?\d{10,}$/.test(phone.replace(/\s/g, ""));
}

export function AuthEntryPanel({ redirectTo = "/dashboard", className = "" }: AuthEntryPanelProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("email");
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [developmentCode, setDevelopmentCode] = useState<string | null>(null);
  const [providers, setProviders] = useState<AuthProvider[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getAuthProviders()
      .then(setProviders)
      .catch(() => setProviders([]));
  }, []);

  const payload = mode === "email" ? { email: identifier.trim().toLowerCase() } : { phone: identifier.trim() };

  return (
    <div className={`rounded-[28px] border border-teal/15 [data-theme='dark']:bg-slate-900 [data-theme='dark']:bg-slate-900 bg-white/90 p-5 shadow-glow ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        {(["email", "phone"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setMode(item);
              setMessage(null);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              mode === item ? "bg-ink text-mist" : "[data-theme='dark']:bg-slate-800 [data-theme='dark']:text-white adaptive-bg-surface text-slate"
            }`}
          >
            Continue with {item}
          </button>
        ))}
        <Link href="/opportunities" className="rounded-full border border-teal/20 px-4 py-2 text-sm text-teal">
          Continue as guest
        </Link>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-ink [data-theme='dark']:text-white">
          Full name
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Your name"
            className="rounded-2xl border border-teal/15 [data-theme='dark']:bg-slate-800 [data-theme='dark']:text-white adaptive-bg-surface px-4 py-3 text-sm text-ink outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink [data-theme='dark']:text-white">
          {mode === "email" ? "Email address" : "Phone number"}
          <input
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder={mode === "email" ? "you@example.com" : "+91 98765 43210"}
            className="rounded-2xl border border-teal/15 [data-theme='dark']:bg-slate-800 [data-theme='dark']:text-white adaptive-bg-surface px-4 py-3 text-sm text-ink outline-none"
          />
        </label>
        {challengeId ? (
          <label className="grid gap-2 text-sm font-medium text-ink [data-theme='dark']:text-white">
            One-time code
            <input
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="Enter the 6-digit code"
              className="rounded-2xl border border-teal/15 [data-theme='dark']:bg-slate-800 [data-theme='dark']:text-white adaptive-bg-surface px-4 py-3 text-sm text-ink outline-none"
            />
          </label>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {!challengeId ? (
          <button
            type="button"
            disabled={isPending || !identifier.trim()}
            onClick={() => {
              // Validate email or phone format
              const isValid = mode === "email" ? isValidEmail(identifier) : isValidPhone(identifier);
              if (!isValid) {
                setMessage(mode === "email" ? "Please enter a valid email address." : "Please enter a valid phone number.");
                return;
              }
              
              startTransition(async () => {
                try {
                  const response = await requestOtp(payload);
                  setChallengeId(response.challenge_id);
                  setDevelopmentCode(response.development_code);
                  setMessage(`${response.message} Target: ${response.target_hint}`);
                } catch {
                  setMessage("We could not prepare the code yet. Check the API and try again.");
                }
              });
            }}
            className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-mist"
          >
            {isPending ? "Preparing..." : "Send code"}
          </button>
        ) : (
          <button
            type="button"
            disabled={isPending || otp.trim().length < 6}
            onClick={() => {
              startTransition(async () => {
                try {
                  await clientJsonFetch<{ user: unknown }>("/api/auth/session", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      challenge_id: challengeId,
                      otp: otp.trim(),
                      full_name: fullName.trim() || undefined,
                      ...payload
                    })
                  });
                  router.push(redirectTo);
                  router.refresh();
                } catch {
                  setMessage("Verification failed. Double-check the code and try again.");
                }
              });
            }}
            className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-mist"
          >
            {isPending ? "Signing in..." : "Verify and continue"}
          </button>
        )}
      </div>

      {developmentCode ? (
        <p className="mt-3 text-xs leading-5 text-coral">
          Debug code: <span className="font-semibold">{developmentCode}</span>
        </p>
      ) : null}
      {message ? <p className="mt-3 text-sm text-slate">{message}</p> : null}

      <div className="mt-6 border-t border-teal/10 pt-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate">Social sign-in</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {providers.map((provider) =>
            provider.configured && provider.auth_url ? (
              <a
                key={provider.id}
                href={provider.auth_url}
                className="rounded-full border border-teal/20 px-4 py-2 text-sm text-teal"
              >
                Continue with {provider.label}
              </a>
            ) : (
              <button
                key={provider.id}
                type="button"
                disabled
                className="rounded-full border border-slate/10 px-4 py-2 text-sm text-slate"
              >
                {provider.label} setup needed
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
