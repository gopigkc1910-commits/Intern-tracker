from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db import SessionLocal
from app.services import configure_storage_mode, create_schema_and_seed

from app.routers import admin, ai, applications, auth, community, notifications, opportunities, profile


@asynccontextmanager
async def lifespan(_: FastAPI):
    if settings.demo_mode == "demo":
        configure_storage_mode("demo")
        yield
        return

    db = SessionLocal()
    try:
        create_schema_and_seed(db)
        configure_storage_mode("database")
    except Exception:
        if settings.demo_mode == "auto":
            configure_storage_mode("demo")
        else:
            raise
    finally:
        db.close()
    yield


app = FastAPI(
    title="Intern Tracker API",
    version="0.1.0",
    description="API for discovering and tracking student opportunities.",
    lifespan=lifespan,
)

allowed_origins = [origin.strip() for origin in settings.cors_allowed_origins.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(profile.router, prefix="/api/v1")
app.include_router(opportunities.router, prefix="/api/v1")
app.include_router(applications.router, prefix="/api/v1")
app.include_router(ai.router, prefix="/api/v1")
app.include_router(community.router, prefix="/api/v1")
app.include_router(notifications.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
