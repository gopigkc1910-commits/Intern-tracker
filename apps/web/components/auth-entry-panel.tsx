"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAuthProviders, requestOtp } from "../lib/api";
import { clientJsonFetch } from "../lib/client-json";
import { useApiMutation } from "../lib/use-api-mutation";
import type { AuthProvider } from "../lib/types";
import { Button } from "./ui/button";

type AuthEntryPanelProps = {
  redirectTo?: string;
  className?: string;
};

type Mode = "email" | "phone";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^(\+\d{1,3})?\d{10,}$/.test(phone.replace(/\s/g, ""));
}

export function AuthEntryPanel({ redirectTo = "/dashboard", className = "" }: AuthEntryPanelProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("email");
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [developmentCode, setDevelopmentCode] = useState<string | null>(null);
  const [providers, setProviders] = useState<AuthProvider[]>([]);
  
  const { mutate, isPending, message, setMessage } = useApiMutation();

  useEffect(() => {
    getAuthProviders()
      .then(setProviders)
      .catch(() => setProviders([]));
  }, []);

  const payload = mode === "email" ? { email: identifier.trim().toLowerCase() } : { phone: identifier.trim() };

  return (
    <div className={`rounded-[28px] border border-teal/15 bg-white/90 p-5 shadow-glow ${className}`}>
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
              mode === item ? "bg-ink text-mist" : "bg-mist text-slate"
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
        <label className="grid gap-2 text-sm font-medium text-ink">
          Full name
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Your name"
            className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 text-sm text-ink outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          {mode === "email" ? "Email address" : "Phone number"}
          <input
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder={mode === "email" ? "you@example.com" : "+91 98765 43210"}
            className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 text-sm text-ink outline-none"
          />
        </label>
        {challengeId ? (
          <label className="grid gap-2 text-sm font-medium text-ink">
            One-time code
            <input
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="Enter the 6-digit code"
              className="rounded-2xl border border-teal/15 bg-mist px-4 py-3 text-sm text-ink outline-none"
            />
          </label>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {!challengeId ? (
          <Button
            type="button"
            variant="primary"
            disabled={!identifier.trim() || isPending}
            loading={isPending}
            onClick={() => {
              const isValid = mode === "email" ? isValidEmail(identifier) : isValidPhone(identifier);
              if (!isValid) {
                setMessage(mode === "email" ? "Error: Please enter a valid email address." : "Error: Please enter a valid phone number.");
                return;
              }
              
              mutate(async () => {
                const response = await requestOtp(payload);
                setChallengeId(response.challenge_id);
                setDevelopmentCode(response.development_code);
                setMessage(`${response.message} Target: ${response.target_hint}`);
              }, "Code sent.");
            }}
          >
            Send code
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            disabled={otp.trim().length < 6 || isPending}
            loading={isPending}
            onClick={() => {
              mutate(async () => {
                await clientJsonFetch<{ user: unknown }>("/api/auth/session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    challenge_id: challengeId,
                    otp: otp.trim(),
                    full_name: fullName.trim() || undefined,
                    ...payload
                  })
                });
                router.push(redirectTo);
                router.refresh();
              }, "Signing in...");
            }}
          >
            Verify and continue
          </Button>
        )}
      </div>

      {developmentCode ? (
        <p className="mt-3 text-xs leading-5 text-coral">
          Debug code: <span className="font-semibold">{developmentCode}</span>
        </p>
      ) : null}
      {message && !message.startsWith("Error:") && !message.startsWith("Code sent.") && !message.startsWith("Signing") ? (
        <p className="mt-3 text-sm text-slate">{message}</p>
      ) : message?.startsWith("Error:") ? (
        <p className="mt-3 text-sm text-coral">{message}</p>
      ) : null}

      <div className="mt-6 border-t border-teal/10 pt-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate">Social sign-in</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api/v1"}/auth/google/login`}
            className="flex items-center gap-2 rounded-full border border-teal/20 px-4 py-2 text-sm font-medium text-teal transition-colors hover:bg-teal/5"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api/v1"}/auth/github/login`}
            className="flex items-center gap-2 rounded-full border border-slate/20 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-slate/5"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.45-1.15-1.11-1.46-1.11-1.46c-.9-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
            </svg>
            Continue with GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
