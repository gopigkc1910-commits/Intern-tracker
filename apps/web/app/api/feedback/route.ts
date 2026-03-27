import { NextResponse } from "next/server";

import { submitFeedback } from "../../../lib/api";
import { getServerAuthToken } from "../../../lib/session";

export async function POST(request: Request) {
  const token = await getServerAuthToken();

  try {
    const payload = await request.json();
    const response = await submitFeedback(payload, token);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Feedback submission failed";
    return NextResponse.json({ detail: message }, { status: 400 });
  }
}
