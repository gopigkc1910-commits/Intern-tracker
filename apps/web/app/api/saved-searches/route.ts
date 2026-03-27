import { NextResponse } from "next/server";

import { createSavedSearch } from "../../../lib/api";
import { getServerAuthToken } from "../../../lib/session";

export async function POST(request: Request) {
  const token = await getServerAuthToken();
  if (!token) {
    return NextResponse.json({ detail: "Authentication required" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const result = await createSavedSearch(token, payload);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save this search";
    return NextResponse.json({ detail: message }, { status: 400 });
  }
}
