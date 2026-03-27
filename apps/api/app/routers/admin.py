from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

from app.demo_store import DEMO_STORE
from app.db import get_db
from app.models import Application, Opportunity, User
from app.schemas import AnalyticsOverviewResponse
from app.services import use_demo_store

router = APIRouter(tags=["admin"])


@router.get("/admin/analytics/overview", response_model=AnalyticsOverviewResponse)
def analytics_overview(db: Session = Depends(get_db)) -> AnalyticsOverviewResponse:
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
