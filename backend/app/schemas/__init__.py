"""Schemas package."""
from app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserInDB,
    UserResponse,
    Token,
    TokenData,
)
from app.schemas.channel import (
    ChannelCreate,
    ChannelUpdate,
    ChannelInDB,
    ChannelResponse,
    ChannelListResponse,
)
from app.schemas.video import (
    VideoCreate,
    VideoUpdate,
    VideoInDB,
    VideoResponse,
    VideoListResponse,
    ThumbnailAnalysisRequest,
    ThumbnailAnalysisResponse,
)
from app.schemas.prediction import (
    PredictionCreate,
    PredictionResult,
    PredictionInDB,
    PredictionResponse,
    PredictionListResponse,
    PredictionPerformanceResponse,
    UpdateActualViews,
)

__all__ = [
    "UserCreate",
    "UserUpdate",
    "UserInDB",
    "UserResponse",
    "Token",
    "TokenData",
    "ChannelCreate",
    "ChannelUpdate",
    "ChannelInDB",
    "ChannelResponse",
    "ChannelListResponse",
    "VideoCreate",
    "VideoUpdate",
    "VideoInDB",
    "VideoResponse",
    "VideoListResponse",
    "ThumbnailAnalysisRequest",
    "ThumbnailAnalysisResponse",
    "PredictionCreate",
    "PredictionResult",
    "PredictionInDB",
    "PredictionResponse",
    "PredictionListResponse",
    "PredictionPerformanceResponse",
    "UpdateActualViews",
]
