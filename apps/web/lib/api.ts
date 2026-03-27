import type {
  AnalyticsOverview,
  ApplicationRecord,
  AuthProvider,
  AuthResponse,
  NotificationItem,
  OpportunityDetail,
  OpportunitySummary,
  RequestOtpResponse,
  ThreadItem,
  UserProfile
} from "./types";

const API_ROOT =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api/v1";
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
}): Promise<OpportunitySummary[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.type) query.set("type", params.type);
  if (params?.mode) query.set("mode", params.mode);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  const response = await apiFetch<{ items: OpportunitySummary[] }>(`/opportunities${suffix}`);
  return response.items;
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

export async function getNotifications(): Promise<NotificationItem[]> {
  const response = await apiFetch<{ items: NotificationItem[] }>("/notifications");
  return response.items;
}

export async function getThreads(): Promise<ThreadItem[]> {
  const response = await apiFetch<{ items: ThreadItem[] }>("/threads");
  return response.items;
}

export async function getAnalytics(): Promise<AnalyticsOverview> {
  return apiFetch<AnalyticsOverview>("/admin/analytics/overview");
}
