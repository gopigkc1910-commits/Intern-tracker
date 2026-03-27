import type { AdminFeedbackItem, AdminUserSummary, AnalyticsOverview, OpportunityDetail } from "./types";

const API_ROOT =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api/v1";

function getAdminToken() {
  return process.env.INTERN_TRACKER_ADMIN_TOKEN ?? null;
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const adminToken = getAdminToken();
  if (!adminToken) {
    throw new Error("Admin token is not configured for the web app.");
  }

  const response = await fetch(`${API_ROOT}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      "Content-Type": "application/json",
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

export async function getAdminOpportunities() {
  return adminFetch<{ items: OpportunityDetail[] }>("/admin/opportunities");
}

export async function createAdminOpportunity(payload: {
  title: string;
  organization: string;
  type: string;
  domain: string;
  mode: string;
  location_text?: string | null;
  description: string;
  application_url: string;
  eligibility_text?: string | null;
  required_skills: string[];
  tags: string[];
  stipend_min?: number | null;
  stipend_max?: number | null;
  currency?: string | null;
  deadline_at?: string | null;
  is_verified: boolean;
  status: string;
}) {
  return adminFetch<OpportunityDetail>("/admin/opportunities", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateAdminOpportunity(
  opportunityId: string,
  payload: {
    title: string;
    organization: string;
    type: string;
    domain: string;
    mode: string;
    location_text?: string | null;
    description: string;
    application_url: string;
    eligibility_text?: string | null;
    required_skills: string[];
    tags: string[];
    stipend_min?: number | null;
    stipend_max?: number | null;
    currency?: string | null;
    deadline_at?: string | null;
    is_verified: boolean;
    status: string;
  }
) {
  return adminFetch<OpportunityDetail>(`/admin/opportunities/${opportunityId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function deleteAdminOpportunity(opportunityId: string) {
  return adminFetch<{ message: string }>(`/admin/opportunities/${opportunityId}`, {
    method: "DELETE"
  });
}

export async function updateAdminFeedbackStatus(feedbackId: string, status: string) {
  return adminFetch<AdminFeedbackItem>(`/admin/feedback/${feedbackId}`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}
