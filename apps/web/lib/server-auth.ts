import { AUTH_TOKEN_COOKIE, AUTH_TOKEN_COOKIE_MAX_AGE } from "./api";

const isProduction = process.env.NODE_ENV === "production";

export function getAuthCookieName() {
  return AUTH_TOKEN_COOKIE;
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    maxAge: AUTH_TOKEN_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
    secure: isProduction
  };
}

export function getExpiredAuthCookieOptions() {
  return {
    ...getAuthCookieOptions(),
    maxAge: 0
  };
}
