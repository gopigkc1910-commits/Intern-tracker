from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="INTERN_TRACKER_", extra="ignore")

    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/intern_tracker"
    demo_token: str = "demo-student-token"
    demo_email: str = "demo@student.edu"
    demo_phone: str = "+910000000000"
    demo_mode: str = "database"
    cors_allowed_origins: str = "http://localhost:3000"
    auth_debug: bool = False
    auth_otp_ttl_minutes: int = 10
    auth_session_ttl_days: int = 30
    google_oauth_url: str | None = None
    github_oauth_url: str | None = None
    linkedin_oauth_url: str | None = None


settings = Settings()
