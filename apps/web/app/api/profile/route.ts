import { NextResponse } from "next/server";

import { getServerAuthToken } from "../../../lib/session";
import { updateProfile } from "../../../lib/api";

export async function PATCH(request: Request) {
  const token = await getServerAuthToken();
  if (!token) {
    return NextResponse.json({ detail: "Authentication required" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const profile = await updateProfile(token, payload);
    return NextResponse.json(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Profile update failed";
    return NextResponse.json({ detail: message }, { status: 400 });
  }
}
