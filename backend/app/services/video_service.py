"""Video service for business logic."""
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import Optional
from datetime import datetime
from app.models import Video, Channel
from app.schemas import VideoCreate, VideoUpdate
from app.core.exceptions import VideoNotFoundException, ForbiddenException


class VideoService:
    """Service for video operations."""

    @staticmethod
    def create_video(db: Session, video_data: VideoCreate, user_id: int) -> Video:
        """Create a new video."""
        # Verify channel ownership
        channel = db.query(Channel).filter(
            and_(
                Channel.id == video_data.channel_id,
                Channel.user_id == user_id
            )
        ).first()

        if not channel:
            raise ForbiddenException("Channel not found or access denied")

        # Check if video already exists (by YouTube video_id)
        if video_data.video_id:
            existing = db.query(Video).filter(
                Video.video_id == video_data.video_id
            ).first()
            if existing:
                raise ValueError("Video with this YouTube ID already exists")

        video = Video(
            user_id=user_id,
            **video_data.model_dump()
        )
        db.add(video)
        db.commit()
        db.refresh(video)
        return video

    @staticmethod
    def get_video(db: Session, video_id: int, user_id: int) -> Video:
        """Get a video by ID."""
        video = db.query(Video).filter(Video.id == video_id).first()
        if not video:
            raise VideoNotFoundException("Video not found")
        if video.user_id != user_id:
            raise ForbiddenException("Access denied to this video")
        return video

    @staticmethod
    def get_video_by_youtube_id(db: Session, youtube_video_id: str, user_id: int) -> Optional[Video]:
        """Get a video by YouTube video ID."""
        return db.query(Video).filter(
            and_(
                Video.video_id == youtube_video_id,
                Video.user_id == user_id
            )
        ).first()

    @staticmethod
    def get_user_videos(
            db: Session,
            user_id: int,
            skip: int = 0,
            limit: int = 100,
            channel_id: Optional[int] = None,
            is_draft: Optional[bool] = None,
            is_uploaded: Optional[bool] = None
    ) -> tuple[list[Video], int]:
        """Get all videos for a user with optional filters."""
        query = db.query(Video).filter(Video.user_id == user_id)

        if channel_id is not None:
            query = query.filter(Video.channel_id == channel_id)

        if is_draft is not None:
            query = query.filter(Video.is_draft == is_draft)

        if is_uploaded is not None:
            query = query.filter(Video.is_uploaded == is_uploaded)

        total = query.count()
        videos = query.order_by(Video.created_at.desc()).offset(skip).limit(limit).all()
        return videos, total

    @staticmethod
    def update_video(
            db: Session,
            video_id: int,
            video_data: VideoUpdate,
            user_id: int
    ) -> Video:
        """Update a video."""
        video = VideoService.get_video(db, video_id, user_id)

        update_data = video_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(video, field, value)

        video.last_synced_at = datetime.utcnow()
        db.commit()
        db.refresh(video)
        return video

    @staticmethod
    def delete_video(db: Session, video_id: int, user_id: int) -> None:
        """Delete a video."""
        video = VideoService.get_video(db, video_id, user_id)
        db.delete(video)
        db.commit()

    @staticmethod
    def mark_as_uploaded(
            db: Session,
            video_id: int,
            user_id: int,
            youtube_video_id: str,
            published_at: datetime
    ) -> Video:
        """Mark a draft video as uploaded."""
        video = VideoService.get_video(db, video_id, user_id)

        video.video_id = youtube_video_id
        video.is_uploaded = True
        video.is_draft = False
        video.published_at = published_at
        video.last_synced_at = datetime.utcnow()

        db.commit()
        db.refresh(video)
        return video

    @staticmethod
    def sync_video_stats(
            db: Session,
            video_id: int,
            user_id: int,
            view_count: int,
            like_count: int,
            comment_count: int
    ) -> Video:
        """Sync video statistics from YouTube API."""
        video = VideoService.get_video(db, video_id, user_id)

        video.view_count = view_count
        video.like_count = like_count
        video.comment_count = comment_count
        video.last_synced_at = datetime.utcnow()

        db.commit()
        db.refresh(video)
        return video