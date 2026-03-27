from fastapi import APIRouter

from app.demo_store import DEMO_STORE
from app.schemas import NotificationItem, NotificationsResponse
from app.services import use_demo_store

router = APIRouter(tags=["notifications"])


@router.get("/notifications", response_model=NotificationsResponse)
def list_notifications() -> NotificationsResponse:
    if use_demo_store():
        return NotificationsResponse(items=DEMO_STORE.notifications())
    return NotificationsResponse(
        items=[
            NotificationItem(
                id="notif-1",
                title="Deadline reminder",
                detail="Google SWE Internship closes in 3 days.",
            ),
            NotificationItem(
                id="notif-2",
                title="New recommendation",
                detail="A product engineering internship now matches your profile.",
            ),
        ]
    )
