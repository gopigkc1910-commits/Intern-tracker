import { NextResponse } from "next/server";

import { deleteSavedSearch } from "../../../../lib/api";
import { getServerAuthToken } from "../../../../lib/session";

type RouteContext = {
  params: {
    savedSearchId: string;
  };
};

export async function DELETE(_: Request, { params }: RouteContext) {
  const token = await getServerAuthToken();
  if (!token) {
    return NextResponse.json({ detail: "Authentication required" }, { status: 401 });
  }

  try {
    const result = await deleteSavedSearch(token, params.savedSearchId);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not remove saved search";
    return NextResponse.json({ detail: message }, { status: 400 });
  }
}
