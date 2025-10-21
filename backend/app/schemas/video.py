"""Video schemas for API requests/responses."""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Any
from app.models import VideoSourceType


class VideoBase(BaseModel):
    """Base video schema."""
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = None
    channel_id: int = Field(..., description="Channel ID (internal)")


class VideoCreate(VideoBase):
    """Schema for creating a video (draft, uploaded, or synthetic)."""
    video_id: Optional[str] = None  # YouTube video ID if already uploaded
    thumbnail_url: Optional[str] = None
    thumbnail_analysis: Optional[dict[str, Any]] = None
    duration: Optional[str] = None
    category_id: Optional[str] = None
    default_language: Optional[str] = None
    default_audio_language: Optional[str] = None
    tags: Optional[list[str]] = None
    topics: Optional[list[str]] = None
    published_at: Optional[datetime] = None
    privacy_status: Optional[str] = "private"
    is_uploaded: bool = False
    is_draft: bool = True
    is_synthetic: bool = False  # For model-generated or test data
    source_type: VideoSourceType = Field(
        default=VideoSourceType.YOUTUBE,
        description="Source of the video (youtube, manual, or test)"
    )
    source_metadata: Optional[dict[str, Any]] = Field(
        default=None,
        description="Additional metadata related to the video source"
    )


class VideoUpdate(BaseModel):
    """Schema for updating a video."""
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    video_id: Optional[str] = None
    thumbnail_url: Optional[str] = None
    thumbnail_analysis: Optional[dict[str, Any]] = None
    duration: Optional[str] = None
    category_id: Optional[str] = None
    default_language: Optional[str] = None
    default_audio_language: Optional[str] = None
    view_count: Optional[int] = None
    like_count: Optional[int] = None
    comment_count: Optional[int] = None
    tags: Optional[list[str]] = None
    topics: Optional[list[str]] = None
    published_at: Optional[datetime] = None
    privacy_status: Optional[str] = None
    is_uploaded: Optional[bool] = None
    is_draft: Optional[bool] = None
    is_synthetic: Optional[bool] = None
    source_type: Optional[VideoSourceType] = None
    source_metadata: Optional[dict[str, Any]] = None


class VideoInDB(VideoBase):
    """Schema for video in database."""
    id: int
    user_id: int
    video_id: Optional[str]
    thumbnail_url: Optional[str]
    thumbnail_analysis: Optional[dict[str, Any]]
    duration: Optional[str]
    category_id: Optional[str]
    default_language: Optional[str]
    default_audio_language: Optional[str]
    view_count: int
    like_count: int
    comment_count: int
    tags: Optional[list[str]]
    topics: Optional[list[str]]
    published_at: Optional[datetime]
    privacy_status: str
    is_uploaded: bool
    is_draft: bool
    is_synthetic: bool
    source_type: VideoSourceType
    source_metadata: Optional[dict[str, Any]]
    created_at: datetime
    updated_at: Optional[datetime]
    last_synced_at: Optional[datetime]

    class Config:
        from_attributes = True


class VideoResponse(VideoInDB):
    """Schema for video response."""
    pass


class VideoListResponse(BaseModel):
    """Schema for list of videos."""
    videos: list[VideoResponse]
    total: int


class ThumbnailAnalysisRequest(BaseModel):
    """Schema for thumbnail analysis request."""
    thumbnail_url: str = Field(..., description="URL of the thumbnail to analyze")


class ThumbnailAnalysisResponse(BaseModel):
    """Schema for thumbnail analysis response."""
    analysis: dict[str, Any] = Field(..., description="Analysis results")


class ThumbnailUploadResponse(BaseModel):
    """Response schema for thumbnail upload."""
    public_url: str = Field(..., description="Public URL of the uploaded thumbnail")
    path: str = Field(..., description="Path of the file in Supabase Storage")

class ThumbnailUploadRequest(BaseModel):
    """Optional request schema (if sending metadata in addition to file)."""
    user_id: Optional[str] = Field(default="public", description="Uploader user ID or folder name")
