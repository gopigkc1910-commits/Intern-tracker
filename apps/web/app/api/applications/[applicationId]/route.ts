import { NextResponse } from "next/server";

import { deleteApplication, updateApplication } from "../../../../lib/api";
import { getServerAuthToken } from "../../../../lib/session";

type RouteContext = {
  params: {
    applicationId: string;
  };
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const token = await getServerAuthToken();
  if (!token) {
    return NextResponse.json({ detail: "Authentication required" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const application = await updateApplication(token, params.applicationId, payload);
    return NextResponse.json(application);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Application update failed";
    return NextResponse.json({ detail: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const token = await getServerAuthToken();
  if (!token) {
    return NextResponse.json({ detail: "Authentication required" }, { status: 401 });
  }

  try {
    const result = await deleteApplication(token, params.applicationId);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Application delete failed";
    return NextResponse.json({ detail: message }, { status: 400 });
  }
}
