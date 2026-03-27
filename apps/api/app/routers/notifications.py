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
                detail="A saved opportunity on your board closes in the next few days.",
            ),
            NotificationItem(
                id="notif-2",
                title="Profile tip",
                detail="Complete your skills and location preferences to improve recommendations.",
            ),
        ]
    )
