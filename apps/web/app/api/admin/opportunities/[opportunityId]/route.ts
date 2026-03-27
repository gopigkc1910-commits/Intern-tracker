import { NextResponse } from "next/server";

import { deleteAdminOpportunity, updateAdminOpportunity } from "../../../../../lib/admin";

type RouteProps = {
  params: {
    opportunityId: string;
  };
};

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const payload = await request.json();
    const response = await updateAdminOpportunity(params.opportunityId, payload);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Opportunity update failed";
    return NextResponse.json({ detail: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteProps) {
  try {
    const response = await deleteAdminOpportunity(params.opportunityId);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Opportunity delete failed";
    return NextResponse.json({ detail: message }, { status: 400 });
  }
}
