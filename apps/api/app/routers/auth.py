import secrets
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.demo_store import DEMO_STORE
from app.db import get_db
from app.models import AuthChallenge
from app.schemas import (
    AuthProvider,
    AuthProvidersResponse,
    AuthResponse,
    RequestOtpRequest,
    RequestOtpResponse,
    VerifyOtpRequest,
)
from app.services import (
    create_session,
    create_user_with_profile,
    get_user_by_identifier,
    hash_otp,
    mask_identifier,
    to_user_profile_response,
    use_demo_store,
)

router = APIRouter(tags=["auth"])


@router.get("/auth/providers", response_model=AuthProvidersResponse)
def list_auth_providers() -> AuthProvidersResponse:
    return AuthProvidersResponse(
        items=[
            AuthProvider(
                id="google",
                label="Google",
                auth_url=settings.google_oauth_url,
                configured=bool(settings.google_oauth_url),
            ),
            AuthProvider(
                id="github",
                label="GitHub",
                auth_url=settings.github_oauth_url,
                configured=bool(settings.github_oauth_url),
            ),
            AuthProvider(
                id="linkedin",
                label="LinkedIn",
                auth_url=settings.linkedin_oauth_url,
                configured=bool(settings.linkedin_oauth_url),
            ),
        ]
    )


@router.post("/auth/request-otp", response_model=RequestOtpResponse)
def request_otp(payload: RequestOtpRequest, db: Session = Depends(get_db)) -> RequestOtpResponse:
    if use_demo_store():
        email = payload.email.strip().lower() if payload.email else settings.demo_email
        phone = payload.phone.strip() if payload.phone else settings.demo_phone
        return RequestOtpResponse(
            challenge_id=DEMO_STORE.user.id,
            message="Demo OTP generated. Use 000000 to continue.",
            channel="email" if email else "phone",
            target_hint=mask_identifier(email=email, phone=phone),
            development_code="000000",
        )

    email = payload.email.strip().lower() if payload.email else None
    phone = payload.phone.strip() if payload.phone else None
    if not email and not phone:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email or phone is required")

    channel = "email" if email else "phone"
    code = "000000" if settings.auth_debug else f"{secrets.randbelow(1000000):06d}"
    challenge = AuthChallenge(
        email=email,
        phone=phone,
        code_hash=hash_otp(code),
        expires_at=datetime.now(UTC) + timedelta(minutes=settings.auth_otp_ttl_minutes),
    )
    db.add(challenge)
    db.commit()
    db.refresh(challenge)

    return RequestOtpResponse(
        challenge_id=challenge.id,
        message=f"A one-time code has been prepared for your {channel}.",
        channel=channel,
        target_hint=mask_identifier(email=email, phone=phone),
        development_code=code if settings.auth_debug else None,
    )


@router.post("/auth/verify-otp", response_model=AuthResponse)
def verify_otp(payload: VerifyOtpRequest, db: Session = Depends(get_db)) -> AuthResponse:
    if use_demo_store():
        return AuthResponse(
            access_token=settings.demo_token,
            refresh_token=f"{settings.demo_token}-refresh",
            user=DEMO_STORE.user,
        )

    challenge = db.get(AuthChallenge, payload.challenge_id)
    if challenge is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="OTP challenge not found")
    if challenge.consumed_at is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP already used")
    if challenge.expires_at <= datetime.now(UTC):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired")
    if challenge.code_hash != hash_otp(payload.otp):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid OTP")
    if payload.email and challenge.email and payload.email.strip().lower() != challenge.email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email does not match this OTP")
    if payload.phone and challenge.phone and payload.phone.strip() != challenge.phone:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phone does not match this OTP")

    user = get_user_by_identifier(db, email=challenge.email, phone=challenge.phone)
    if user is None:
        user = create_user_with_profile(
            db,
            email=challenge.email,
            phone=challenge.phone,
            full_name=payload.full_name,
        )

    session = create_session(db, user, provider="otp")
    challenge.consumed_at = datetime.now(UTC)
    db.add(challenge)
    db.commit()

    return AuthResponse(
        access_token=session.token,
        refresh_token=session.token,
        user=to_user_profile_response(user),
    )
