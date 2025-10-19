"""Video API endpoints."""
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.dependencies import get_db, get_current_active_user
from app.models import User, VideoSourceType
from app.schemas import (
    VideoCreate,
    VideoUpdate,
    VideoResponse,
    VideoListResponse,
    ThumbnailAnalysisRequest,
    ThumbnailAnalysisResponse,
)
from app.services import VideoService

router = APIRouter(tags=["videos"])


@router.post("/", response_model=VideoResponse, status_code=status.HTTP_201_CREATED)
def create_video(
        video_data: VideoCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    """Create a new video (draft, uploaded, or synthetic)."""
    video = VideoService.create_video(db, video_data, current_user.id)
    return video


@router.get("/", response_model=VideoListResponse)
def list_videos(
        skip: int = Query(0, ge=0),
        limit: int = Query(100, ge=1, le=100),
        channel_id: Optional[int] = Query(None),
        is_draft: Optional[bool] = Query(None),
        is_uploaded: Optional[bool] = Query(None),
        source_type: Optional[VideoSourceType] = Query(
            None, description="Filter by source type (youtube, manual, or test)"
        ),
        is_synthetic: Optional[bool] = Query(
            None, description="Filter by whether the video is synthetic"
        ),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    """Get all videos for the current user with optional filters."""
    videos, total = VideoService.get_user_videos(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        channel_id=channel_id,
        is_draft=is_draft,
        is_uploaded=is_uploaded,
        source_type=source_type,
        is_synthetic=is_synthetic,
    )
    return VideoListResponse(videos=videos, total=total)


@router.get("/{video_id}", response_model=VideoResponse)
def get_video(
        video_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    """Get a specific video."""
    video = VideoService.get_video(db, video_id, current_user.id)
    return video


@router.patch("/{video_id}", response_model=VideoResponse)
def update_video(
        video_id: int,
        video_data: VideoUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    """Update a video."""
    video = VideoService.update_video(db, video_id, video_data, current_user.id)
    return video


@router.delete("/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_video(
        video_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    """Delete a video."""
    VideoService.delete_video(db, video_id, current_user.id)
    return None


@router.post("/analyze-thumbnail", response_model=ThumbnailAnalysisResponse)
def analyze_thumbnail(
        request: ThumbnailAnalysisRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    """
    Analyze a thumbnail image.
    TODO: Implement actual thumbnail analysis logic using computer vision.
    This is a placeholder that returns mock data.
    """
    # Placeholder for thumbnail analysis
    # In production, integrate with your ML model for thumbnail analysis
    analysis = {
        "quality_score": 0.85,
        "brightness": 0.7,
        "contrast": 0.8,
        "detected_objects": ["person", "text"],
        "dominant_colors": ["#FF5733", "#33FF57"],
        "has_text": True,
        "text_readability": 0.9,
        "emotional_appeal": 0.75,
    }

    return ThumbnailAnalysisResponse(analysis=analysis)
