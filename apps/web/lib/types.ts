export type OpportunitySummary = {
  id: string;
  slug: string;
  title: string;
  organization: string;
  type: string;
  domain: string;
  mode: string;
  location_text: string | null;
  tags: string[];
  deadline_at: string | null;
  is_verified: boolean;
  status: string;
  description: string;
};

export type OpportunityDetail = OpportunitySummary & {
  application_url: string;
  eligibility_text: string | null;
  required_skills: string[];
  stipend_min: number | null;
  stipend_max: number | null;
  currency: string | null;
};

export type ApplicationRecord = {
  id: string;
  status: "saved" | "applied" | "shortlisted" | "rejected" | "accepted";
  applied_at: string | null;
  next_follow_up_at: string | null;
  note: string | null;
  opportunity: OpportunitySummary;
};

export type UserProfile = {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string;
  college_name: string | null;
  degree: string | null;
  branch: string | null;
  graduation_year: number | null;
  city: string | null;
  country: string | null;
  bio: string | null;
  goals: string | null;
  preferred_domains: string[];
  preferred_locations: string[];
  preferred_opportunity_types: string[];
  skills: string[];
  github_url: string | null;
  linkedin_url: string | null;
  resume_url: string | null;
  onboarding_completed: boolean;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  user: UserProfile;
};

export type RequestOtpResponse = {
  challenge_id: string;
  message: string;
  channel: string;
  target_hint: string;
  development_code: string | null;
};

export type AuthProvider = {
  id: string;
  label: string;
  auth_url: string | null;
  configured: boolean;
};

export type NotificationItem = {
  id: string;
  title: string;
  detail: string;
};

export type ThreadItem = {
  id: string;
  title: string;
  category: string;
  author_name: string;
};

export type AnalyticsOverview = {
  active_users: number;
  new_opportunities: number;
  saved_applications: number;
  applied_applications: number;
};

export type AdminUserSummary = {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string;
  college_name: string | null;
  degree: string | null;
  branch: string | null;
  graduation_year: number | null;
  city: string | null;
  country: string | null;
  onboarding_completed: boolean;
  applications_count: number;
  created_at: string;
  updated_at: string | null;
};

export type FeedbackSubmission = {
  id: string;
  category: string;
  message: string;
  name: string | null;
  email: string | null;
  status: string;
  created_at: string;
};

export type AdminFeedbackItem = FeedbackSubmission & {
  user_id: string | null;
  user_name: string | null;
};

export type SavedSearch = {
  id: string;
  label: string;
  search: string | null;
  type: string | null;
  mode: string | null;
  verified: boolean;
  deadline_days: number | null;
  paid_only: boolean;
  min_stipend: number | null;
  created_at: string;
};
