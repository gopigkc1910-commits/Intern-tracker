from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config import settings
from app.demo_store import DEMO_STORE
from app.db import get_db
from app.schemas import AuthResponse, MessageResponse, RequestOtpRequest, VerifyOtpRequest
from app.services import get_demo_user, to_user_profile_response, use_demo_store

router = APIRouter(tags=["auth"])


@router.post("/auth/request-otp", response_model=MessageResponse)
def request_otp(_: RequestOtpRequest) -> MessageResponse:
    return MessageResponse(message="Demo OTP generated. Use 000000 to continue.")


@router.post("/auth/verify-otp", response_model=AuthResponse)
def verify_otp(_: VerifyOtpRequest, db: Session = Depends(get_db)) -> AuthResponse:
    user = DEMO_STORE.user if use_demo_store() else to_user_profile_response(get_demo_user(db))
    return AuthResponse(
        access_token=settings.demo_token,
        refresh_token=f"{settings.demo_token}-refresh",
        user=user,
    )
