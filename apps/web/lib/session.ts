import { cookies } from "next/headers";

import { AUTH_TOKEN_COOKIE } from "./api";

export async function getServerAuthToken(): Promise<string | null> {
  return cookies().get(AUTH_TOKEN_COOKIE)?.value ?? null;
}
