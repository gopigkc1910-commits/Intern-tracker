from fastapi import APIRouter

from app.demo_store import DEMO_STORE
from app.schemas import ThreadItem, ThreadsResponse
from app.services import use_demo_store

router = APIRouter(tags=["community"])


@router.get("/threads", response_model=ThreadsResponse)
def list_threads() -> ThreadsResponse:
    if use_demo_store():
        return ThreadsResponse(items=DEMO_STORE.threads())
    return ThreadsResponse(
        items=[
            ThreadItem(
                id="thread-1",
                title="Best AI hackathons to apply for this semester?",
                category="hackathons",
                author_name="Priya Sharma",
            ),
            ThreadItem(
                id="thread-2",
                title="Looking for a backend teammate for MLH Global Hack Week",
                category="general",
                author_name="Arjun Patel",
            ),
        ]
    )
