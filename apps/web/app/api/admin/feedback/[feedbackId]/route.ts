import { NextResponse } from "next/server";

import { updateAdminFeedbackStatus } from "../../../../../lib/admin";

type RouteProps = {
  params: {
    feedbackId: string;
  };
};

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const payload = await request.json();
    const response = await updateAdminFeedbackStatus(params.feedbackId, payload.status);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Feedback update failed";
    return NextResponse.json({ detail: message }, { status: 400 });
  }
}
