import { NextResponse } from "next/server";

import { createApplication } from "../../../lib/api";
import { getServerAuthToken } from "../../../lib/session";

export async function POST(request: Request) {
  const token = await getServerAuthToken();
  if (!token) {
    return NextResponse.json({ detail: "Authentication required" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const application = await createApplication(token, payload);
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Application update failed";
    return NextResponse.json({ detail: message }, { status: 400 });
  }
}
