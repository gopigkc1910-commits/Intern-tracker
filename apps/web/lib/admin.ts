import type { AdminFeedbackItem, AdminUserSummary, AnalyticsOverview } from "./types";

const API_ROOT =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api/v1";

function getAdminToken() {
  return process.env.INTERN_TRACKER_ADMIN_TOKEN ?? null;
}

async function adminFetch<T>(path: string): Promise<T> {
  const adminToken = getAdminToken();
  if (!adminToken) {
    throw new Error("Admin token is not configured for the web app.");
  }

  const response = await fetch(`${API_ROOT}${path}`, {
    headers: {
      "X-Admin-Token": adminToken
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Admin request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getAdminOverview() {
  return adminFetch<AnalyticsOverview>("/admin/analytics/overview");
}

export async function getAdminUsers() {
  return adminFetch<{ items: AdminUserSummary[] }>("/admin/users");
}

export async function getAdminFeedback() {
  return adminFetch<{ items: AdminFeedbackItem[] }>("/admin/feedback");
}
