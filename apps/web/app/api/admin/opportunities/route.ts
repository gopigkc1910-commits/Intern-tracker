import { NextResponse } from "next/server";

import { createAdminOpportunity } from "../../../../lib/admin";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await createAdminOpportunity(payload);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Opportunity creation failed";
    return NextResponse.json({ detail: message }, { status: 400 });
  }
}
