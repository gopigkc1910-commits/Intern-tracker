from datetime import UTC, datetime

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.demo_store import DEMO_STORE
from app.db import get_db
from app.models import AuthSession, User
from app.services import get_demo_user, use_demo_store


def get_current_user(
    authorization: str | None = Header(default=None),
    x_demo_token: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    token: str | None = None
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization[7:]
    elif x_demo_token:
        token = x_demo_token

    if use_demo_store():
        if token != settings.demo_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or missing demo token")
        return DEMO_STORE.user  # type: ignore[return-value]

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    session = db.scalar(
        select(AuthSession)
        .join(AuthSession.user)
        .where(
            AuthSession.token == token,
            AuthSession.revoked_at.is_(None),
            AuthSession.expires_at > datetime.now(UTC),
        )
    )
    if session is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session")

    return session.user
