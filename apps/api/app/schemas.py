from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class OpportunitySummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    title: str
    organization: str
    type: str
    domain: str
    mode: str
    location_text: str | None = None
    tags: list[str]
    deadline_at: datetime | None = None
    is_verified: bool
    description: str


class OpportunityDetail(OpportunitySummary):
    application_url: str
    eligibility_text: str | None = None
    required_skills: list[str]
    stipend_min: float | None = None
    stipend_max: float | None = None
    currency: str | None = None


class OpportunityListResponse(BaseModel):
    items: list[OpportunitySummary]


class ApplicationRecord(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    status: str
    applied_at: datetime | None = None
    next_follow_up_at: datetime | None = None
    note: str | None = None
    opportunity: OpportunitySummary


class ApplicationsResponse(BaseModel):
    items: list[ApplicationRecord]


class CreateApplicationRequest(BaseModel):
    opportunity_id: UUID
    status: str = Field(default="saved")
    note: str | None = None


class UpdateApplicationRequest(BaseModel):
    status: str | None = None
    note: str | None = None
    next_follow_up_at: datetime | None = None


class UserProfileResponse(BaseModel):
    id: UUID
    email: str | None = None
    phone: str | None = None
    full_name: str
    college_name: str | None = None
    degree: str | None = None
    branch: str | None = None
    graduation_year: int | None = None
    city: str | None = None
    country: str | None = None
    bio: str | None = None
    goals: str | None = None
    preferred_domains: list[str]
    preferred_locations: list[str]
    preferred_opportunity_types: list[str]
    skills: list[str]
    github_url: str | None = None
    linkedin_url: str | None = None
    resume_url: str | None = None
    onboarding_completed: bool


class UpdateProfileRequest(BaseModel):
    full_name: str | None = None
    college_name: str | None = None
    degree: str | None = None
    branch: str | None = None
    graduation_year: int | None = None
    city: str | None = None
    country: str | None = None
    bio: str | None = None
    goals: str | None = None
    preferred_domains: list[str] | None = None
    preferred_locations: list[str] | None = None
    preferred_opportunity_types: list[str] | None = None
    skills: list[str] | None = None
    github_url: str | None = None
    linkedin_url: str | None = None
    resume_url: str | None = None
    onboarding_completed: bool | None = None


class RequestOtpRequest(BaseModel):
    email: str | None = None
    phone: str | None = None


class RequestOtpResponse(BaseModel):
    challenge_id: UUID
    message: str
    channel: str
    target_hint: str
    development_code: str | None = None


class VerifyOtpRequest(BaseModel):
    challenge_id: UUID
    email: str | None = None
    phone: str | None = None
    otp: str = "000000"
    full_name: str | None = None


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserProfileResponse


class LogoutResponse(BaseModel):
    message: str


class MessageResponse(BaseModel):
    message: str


class AuthProvider(BaseModel):
    id: str
    label: str
    auth_url: str | None = None
    configured: bool


class AuthProvidersResponse(BaseModel):
    items: list[AuthProvider]


class NotificationItem(BaseModel):
    id: str
    title: str
    detail: str


class NotificationsResponse(BaseModel):
    items: list[NotificationItem]


class ThreadItem(BaseModel):
    id: str
    title: str
    category: str
    author_name: str


class ThreadsResponse(BaseModel):
    items: list[ThreadItem]


class AnalyticsOverviewResponse(BaseModel):
    active_users: int
    new_opportunities: int
    saved_applications: int
    applied_applications: int


class AdminUserSummary(BaseModel):
    id: UUID
    email: str | None = None
    phone: str | None = None
    full_name: str
    college_name: str | None = None
    degree: str | None = None
    branch: str | None = None
    graduation_year: int | None = None
    city: str | None = None
    country: str | None = None
    onboarding_completed: bool
    applications_count: int
    created_at: datetime
    updated_at: datetime | None = None


class AdminUsersResponse(BaseModel):
    items: list[AdminUserSummary]


class ResumeAnalyzeRequest(BaseModel):
    opportunity_slug: str | None = None
    resume_text: str | None = None


class ResumeAnalyzeResponse(BaseModel):
    summary: str
    highlights: list[str]


class CoverLetterRequest(BaseModel):
    opportunity_slug: str


class CoverLetterResponse(BaseModel):
    content: str
