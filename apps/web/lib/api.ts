import type {
  AdminFeedbackItem,
  AnalyticsOverview,
  ApplicationRecord,
  AuthProvider,
  AuthResponse,
  FeedbackSubmission,
  NotificationItem,
  OpportunityDetail,
  OpportunitySummary,
  OpportunityListResponse,
  RequestOtpResponse,
  SavedSearch,
  ThreadItem,
  UserProfile
} from "./types";

const API_ROOT =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api/v1";
/**
 * API request timeout in milliseconds
 * Requests that exceed this duration will be aborted
 * Current: 4 seconds - adjust if your API is slow
 */
const API_TIMEOUT_MS = 4000;

export const AUTH_TOKEN_COOKIE = "intern_tracker_auth_token";
export const AUTH_TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

type FetchOptions = RequestInit & {
  token?: string | null;
};

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_ROOT}${path}`, {
      ...options,
      headers,
      cache: options.cache ?? "no-store",
      signal: controller.signal
    });
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`API request timed out after ${API_TIMEOUT_MS}ms: ${path}`);
    }
    throw error;
  }
  clearTimeout(timeout);

  if (!response.ok) {
    const rawDetail = await response.text();
    let detail = rawDetail;
    try {
      const parsed = JSON.parse(rawDetail) as { detail?: string };
      detail = parsed.detail ?? rawDetail;
    } catch {
      detail = rawDetail;
    }
    throw new Error(detail || `API request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getAuthProviders(): Promise<AuthProvider[]> {
  const response = await apiFetch<{ items: AuthProvider[] }>("/auth/providers");
  return response.items;
}

export async function requestOtp(payload: {
  email?: string;
  phone?: string;
}): Promise<RequestOtpResponse> {
  return apiFetch<RequestOtpResponse>("/auth/request-otp", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function verifyOtp(payload: {
  challenge_id: string;
  email?: string;
  phone?: string;
  otp: string;
  full_name?: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function listOpportunities(params?: {
  search?: string;
  type?: string;
  mode?: string;
  verified?: string;
  deadline_days?: string;
  paid_only?: string;
  min_stipend?: string;
  skip?: number;
  limit?: number;
}): Promise<OpportunityListResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.type) query.set("type", params.type);
  if (params?.mode) query.set("mode", params.mode);
  if (params?.verified) query.set("verified", params.verified);
  if (params?.deadline_days) query.set("deadline_days", params.deadline_days);
  if (params?.paid_only) query.set("paid_only", params.paid_only);
  if (params?.min_stipend) query.set("min_stipend", params.min_stipend);
  if (params?.skip !== undefined) query.set("skip", params.skip.toString());
  if (params?.limit !== undefined) query.set("limit", params.limit.toString());
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<OpportunityListResponse>(`/opportunities${suffix}`);
}

export async function getOpportunity(slug: string): Promise<OpportunityDetail> {
  return apiFetch<OpportunityDetail>(`/opportunities/${slug}`);
}

export async function getRecommendedOpportunities(token: string): Promise<OpportunitySummary[]> {
  const response = await apiFetch<{ items: OpportunitySummary[] }>("/opportunities/recommended", { token });
  return response.items;
}

export async function getApplications(token: string): Promise<ApplicationRecord[]> {
  const response = await apiFetch<{ items: ApplicationRecord[] }>("/applications", { token });
  return response.items;
}

export async function createApplication(token: string, payload: { opportunity_id: string; status: string; note?: string }) {
  return apiFetch<ApplicationRecord>("/applications", {
    method: "POST",
    token,
    body: JSON.stringify(payload)
  });
}

export async function updateApplication(
  token: string,
  applicationId: string,
  payload: { status?: string; note?: string; next_follow_up_at?: string | null }
) {
  return apiFetch<ApplicationRecord>(`/applications/${applicationId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload)
  });
}

export async function deleteApplication(token: string, applicationId: string) {
  return apiFetch<{ message: string }>(`/applications/${applicationId}`, {
    method: "DELETE",
    token
  });
}

export async function getProfile(token: string): Promise<UserProfile> {
  return apiFetch<UserProfile>("/me", { token });
}

export async function updateProfile(token: string, payload: Partial<UserProfile>) {
  return apiFetch<UserProfile>("/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(payload)
  });
}

export async function getNotifications(token: string): Promise<NotificationItem[]> {
  const response = await apiFetch<{ items: NotificationItem[] }>("/notifications", { token });
  return response.items;
}

export async function getThreads(): Promise<ThreadItem[]> {
  const response = await apiFetch<{ items: ThreadItem[] }>("/threads");
  return response.items;
}

export async function getAnalytics(): Promise<AnalyticsOverview> {
  return apiFetch<AnalyticsOverview>("/admin/analytics/overview");
}

export async function submitFeedback(
  payload: { category: string; message: string; name?: string; email?: string },
  token?: string | null
) {
  return apiFetch<FeedbackSubmission>("/feedback", {
    method: "POST",
    token,
    body: JSON.stringify(payload)
  });
}

export async function getSavedSearches(token: string): Promise<SavedSearch[]> {
  const response = await apiFetch<{ items: SavedSearch[] }>("/saved-searches", { token });
  return response.items;
}

export async function createSavedSearch(
  token: string,
  payload: {
    label: string;
    search?: string;
    type?: string;
    mode?: string;
    verified?: boolean;
    deadline_days?: number;
    paid_only?: boolean;
    min_stipend?: number;
  }
) {
  return apiFetch<SavedSearch>("/saved-searches", {
    method: "POST",
    token,
    body: JSON.stringify(payload)
  });
}

export async function deleteSavedSearch(token: string, savedSearchId: string) {
  return apiFetch<{ message: string }>(`/saved-searches/${savedSearchId}`, {
    method: "DELETE",
    token
  });
}
