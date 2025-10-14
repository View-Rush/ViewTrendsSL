from fastapi import APIRouter

from app.api.v1 import auth, users, channels, videos, predictions

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])

api_router.include_router(channels.router, prefix="/channels", tags=["channels"])

api_router.include_router(videos.router, prefix="/videos", tags=["videos"])

api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
