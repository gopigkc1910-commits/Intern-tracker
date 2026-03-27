import { cookies } from "next/headers";

import { DEMO_TOKEN_COOKIE } from "./api";

export async function getServerDemoToken(): Promise<string | null> {
  return cookies().get(DEMO_TOKEN_COOKIE)?.value ?? null;
}
