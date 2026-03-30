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
    <div className={`rounded-[32px] border border-teal/20 bg-surface-strong/80 backdrop-blur-xl p-8 shadow-glow animate-slide-up ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Welcome back.</h2>
        <Link href="/opportunities" className="rounded-full border border-teal/20 bg-mist px-4 py-2 text-sm text-teal shadow-sm hover:bg-teal/10 transition-colors">
          Continue as guest
        </Link>
      </div>

      <div className="flex bg-mist/50 p-1 rounded-full mb-8 border border-slate/10 backdrop-blur-md">
        {(["email", "phone"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setMode(item);
              setMessage(null);
            }}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              mode === item 
                ? "bg-ink text-surface-strong shadow-md scale-100" 
                : "bg-transparent text-slate hover:bg-slate/10 scale-95"
            }`}
          >
            {item === "email" ? "Email" : "Phone"}
          </button>
        ))}
      </div>

      <div className="grid gap-5">
        {!challengeId ? (
          <>
            <div className="grid gap-1.5 opacity-0 animate-slide-up" style={{ animationDelay: '50ms' }}>
              <label className="text-sm font-medium text-slate ml-1">Full Name</label>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="What should we call you?"
                className="input-focus-ring rounded-2xl border border-teal/15 bg-mist/50 px-4 py-3.5 text-base text-ink placeholder:text-slate/50 outline-none backdrop-blur-md"
              />
            </div>
            <div className="grid gap-1.5 opacity-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <label className="text-sm font-medium text-slate ml-1">
                {mode === "email" ? "Email Address" : "Phone Number"}
              </label>
              <input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder={mode === "email" ? "you@example.com" : "+91 98765 43210"}
                className="input-focus-ring rounded-2xl border border-teal/15 bg-mist/50 px-4 py-3.5 text-base text-ink placeholder:text-slate/50 outline-none backdrop-blur-md"
              />
            </div>
            
            <div className="mt-4 opacity-0 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <Button
                type="button"
                variant="primary"
                className="w-full rounded-2xl py-6 text-base shadow-glow hover:shadow-lg transition-all"
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
                    setMessage(`Code dispatched via ${response.channel}.`);
                  }, "Generating secure code...");
                }}
              >
                Send secure code
              </Button>
            </div>
          </>
        ) : (
          <div className="grid gap-5 opacity-0 animate-slide-up">
             <div className="grid gap-1.5">
              <label className="text-sm font-medium text-slate ml-1 flex justify-between">
                <span>Verification Code</span>
                <button type="button" onClick={() => { setChallengeId(null); setOtp(""); }} className="text-teal hover:underline text-xs">
                  Change {mode}
                </button>
              </label>
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="Enter the 6-digit code sent to you"
                className="input-focus-ring text-center tracking-[0.5em] font-semibold rounded-2xl border border-teal/30 bg-mist/80 px-4 py-4 text-xl text-ink placeholder:text-slate/50 placeholder:tracking-normal outline-none backdrop-blur-md"
                autoFocus
              />
            </div>
            
            {developmentCode ? (
              <div className="p-4 rounded-xl border-2 border-dashed border-teal/40 bg-teal/5 animate-pulse-glow flex flex-col items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-teal">Dev Mode / Demo Fallback</span>
                <span className="text-sm text-slate text-center">We noticed the email API may not be working.</span>
                <button 
                  onClick={() => setOtp(developmentCode)}
                  className="mt-1 bg-ink text-surface-strong px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-transform"
                >
                  Auto-fill code: {developmentCode}
                </button>
              </div>
            ) : null}

            <Button
              type="button"
              variant="primary"
              className="w-full rounded-2xl py-6 text-base shadow-glow hover:shadow-lg transition-all mt-2"
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
                }, "Authenticating...");
              }}
            >
              Verify and sign in
            </Button>
          </div>
        )}
      </div>

      {message && !message.startsWith("Error:") && !message.startsWith("Code sent.") && !message.startsWith("Generating") && !message.startsWith("Authenticating") ? (
        <div className="mt-4 p-3 rounded-xl bg-teal/10 border border-teal/20 text-sm text-teal font-medium text-center animate-slide-up">
          {message}
        </div>
      ) : message?.startsWith("Error:") ? (
        <div className="mt-4 p-3 rounded-xl bg-coral/10 border border-coral/20 text-sm text-coral font-medium text-center animate-slide-up">
          {message.replace("Error: ", "")}
        </div>
      ) : null}

      <div className="mt-8 border-t border-slate/10 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate/60 text-center mb-4">Or continue with</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api/v1"}/auth/google/login`}
            className="flex items-center justify-center gap-3 w-full rounded-2xl border border-slate/15 bg-surface px-4 py-3 text-sm font-medium text-ink transition-all hover:bg-mist/80 hover:border-slate/30"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api/v1"}/auth/github/login`}
            className="flex items-center justify-center gap-3 w-full rounded-2xl border border-slate/15 bg-surface px-4 py-3 text-sm font-medium text-ink transition-all hover:bg-mist/80 hover:border-slate/30"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.45-1.15-1.11-1.46-1.11-1.46c-.9-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
