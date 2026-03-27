import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { apiFetch, verifyOtp } from "../../../../lib/api";
import { getAuthCookieName, getAuthCookieOptions, getExpiredAuthCookieOptions } from "../../../../lib/server-auth";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await verifyOtp(payload);

    cookies().set(getAuthCookieName(), response.access_token, getAuthCookieOptions());
    return NextResponse.json({ user: response.user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json({ detail: message }, { status: 401 });
  }
}

export async function DELETE() {
  const token = cookies().get(getAuthCookieName())?.value;
  if (token) {
    try {
      await apiFetch<{ message: string }>("/auth/logout", {
        method: "POST",
        token
      });
    } catch {
      // Clear the cookie even if the upstream session is already gone.
    }
  }

  cookies().set(getAuthCookieName(), "", getExpiredAuthCookieOptions());
  return NextResponse.json({ ok: true });
}
