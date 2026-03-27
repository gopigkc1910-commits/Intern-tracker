from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from fastapi import APIRouter, Depends

from app.demo_store import DEMO_STORE
from app.db import get_db
from app.deps import require_admin
from app.models import Application, Opportunity, User
from app.schemas import AdminUserSummary, AdminUsersResponse, AnalyticsOverviewResponse
from app.services import use_demo_store

router = APIRouter(tags=["admin"])


@router.get("/admin/analytics/overview", response_model=AnalyticsOverviewResponse)
def analytics_overview(_: None = Depends(require_admin), db: Session = Depends(get_db)) -> AnalyticsOverviewResponse:
    if use_demo_store():
        return DEMO_STORE.analytics()
    active_users = db.query(func.count(User.id)).scalar() or 0
    new_opportunities = db.query(func.count(Opportunity.id)).scalar() or 0
    saved_applications = db.query(func.count(Application.id)).filter(Application.status == "saved").scalar() or 0
    applied_applications = (
        db.query(func.count(Application.id)).filter(Application.status != "saved").scalar() or 0
    )
    return AnalyticsOverviewResponse(
        active_users=active_users,
        new_opportunities=new_opportunities,
        saved_applications=saved_applications,
        applied_applications=applied_applications,
    )


@router.get("/admin/users", response_model=AdminUsersResponse)
def list_users(_: None = Depends(require_admin), db: Session = Depends(get_db)) -> AdminUsersResponse:
    users = db.query(User).options(joinedload(User.profile)).order_by(User.created_at.desc()).all()
    items: list[AdminUserSummary] = []

    for user in users:
        profile = user.profile
        applications_count = db.query(func.count(Application.id)).filter(Application.user_id == user.id).scalar() or 0
        items.append(
            AdminUserSummary(
                id=user.id,
                email=user.email,
                phone=user.phone,
                full_name=user.full_name,
                college_name=user.college_name,
                degree=user.degree,
                branch=user.branch,
                graduation_year=user.graduation_year,
                city=user.city,
                country=user.country,
                onboarding_completed=profile.onboarding_completed if profile else False,
                applications_count=applications_count,
                created_at=user.created_at,
                updated_at=user.updated_at,
            )
        )

    return AdminUsersResponse(items=items)
