import { NextResponse } from "next/server";

import { updateAdminFeedbackStatus } from "../../../../../lib/admin";

type RouteProps = {
  params: {
    feedbackId: string;
  };
};

const ALLOWED_STATUSES = ["new", "reviewing", "planned", "resolved"];

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    // Authentication check
    const adminToken = request.headers.get("x-admin-token");
    const expectedToken = process.env.INTERN_TRACKER_ADMIN_TOKEN;
    
    if (!expectedToken || adminToken !== expectedToken) {
      return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }
    
    const payload = await request.json();
    
    // Validate status enum
    if (!ALLOWED_STATUSES.includes(payload.status)) {
      return NextResponse.json(
        { detail: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }
    
    const response = await updateAdminFeedbackStatus(params.feedbackId, payload.status);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Feedback update failed";
    return NextResponse.json({ detail: message }, { status: 400 });
  }
}
