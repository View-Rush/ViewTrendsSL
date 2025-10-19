"""Video service for business logic."""
import re

from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional
from datetime import datetime
from app.models import Video, Channel, VideoSourceType
from app.schemas import VideoCreate, VideoUpdate
from app.core.exceptions import VideoNotFoundException, ForbiddenException
from app.services.youtube_service import YouTubeService
from app.schemas import ChannelCreate
from app.services import ChannelService


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
            existing = db.query(Video).filter(Video.video_id == video_data.video_id).first()
            if existing:
                raise ValueError("Video with this YouTube ID already exists")

        # Handle source-related defaults
        source_type = video_data.source_type or VideoSourceType.YOUTUBE
        source_metadata = video_data.source_metadata
        is_synthetic = video_data.is_synthetic or False

        video = Video(
            user_id=user_id,
            source_type=source_type,
            source_metadata=source_metadata,
            is_synthetic=is_synthetic,
            **video_data.model_dump(exclude={"source_type", "source_metadata", "is_synthetic"})
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
        is_uploaded: Optional[bool] = None,
        source_type: Optional[VideoSourceType] = None,
        is_synthetic: Optional[bool] = None
    ) -> tuple[list[Video], int]:
        """Get all videos for a user with optional filters."""
        query = db.query(Video).filter(Video.user_id == user_id)

        if channel_id is not None:
            query = query.filter(Video.channel_id == channel_id)
        if is_draft is not None:
            query = query.filter(Video.is_draft == is_draft)
        if is_uploaded is not None:
            query = query.filter(Video.is_uploaded == is_uploaded)
        if source_type is not None:
            query = query.filter(Video.source_type == source_type)
        if is_synthetic is not None:
            query = query.filter(Video.is_synthetic == is_synthetic)

        total = query.count()
        videos = query.order_by(Video.created_at.desc()).offset(skip).limit(limit).all()
        return videos, total

    @staticmethod
    def update_video(db: Session, video_id: int, video_data: VideoUpdate, user_id: int) -> Video:
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

        # Skip syncing for non-YouTube or synthetic videos
        if video.source_type != VideoSourceType.YOUTUBE or video.is_synthetic:
            raise ForbiddenException("Cannot sync non-YouTube or synthetic videos")

        video.view_count = view_count
        video.like_count = like_count
        video.comment_count = comment_count
        video.last_synced_at = datetime.utcnow()

        db.commit()
        db.refresh(video)
        return video

    @staticmethod
    def import_from_youtube(db: Session, input_value: str, user_id: int) -> Video:
        """Import a video from YouTube by URL or video ID, and store it in the database."""
        youtube_video_id = VideoService._extract_video_id(input_value)
        if not youtube_video_id:
            raise ValueError("Invalid YouTube URL or video ID")

        yt = YouTubeService()
        video_data = yt.get_video_details(youtube_video_id)
        if not video_data:
            raise VideoNotFoundException("YouTube video not found")

        # Extract the channel ID from the video data
        youtube_channel_id = video_data.get("channel_id")
        if not youtube_channel_id:
            raise ValueError("Missing channel ID in YouTube video data")

        # Try to get existing channel for this user
        channel = ChannelService.get_channel_by_youtube_id(db, youtube_channel_id, user_id)

        # If not found, fetch and create it using ChannelService
        if not channel:
            channel_data = yt.get_channel_details(youtube_channel_id)
            if not channel_data:
                raise VideoNotFoundException("Channel not found in YouTube API")

            channel_create = ChannelCreate(
                channel_id=channel_data["channel_id"],
                channel_title=channel_data["name"],
                channel_description=channel_data.get("description"),
                country=channel_data.get("country"),
                published_at=channel_data.get("published_at"),
                subscriber_count=channel_data.get("subscriber_count", 0),
                video_count=channel_data.get("video_count", 0),
                view_count=channel_data.get("view_count", 0),
                thumbnail_url=None,  # Add if mapper supports it later
                type="real",
                is_connected=True,
            )
            channel = ChannelService.create_channel(db, channel_create, user_id)

        # Add YouTube video defaults
        video_data["is_uploaded"] = True
        video_data["is_draft"] = False
        video_data["source_type"] = VideoSourceType.YOUTUBE

        video_data.pop("channel_id", None)

        # Create the video record
        video = Video(
            user_id=user_id,
            channel_id=channel.id,
            **video_data
        )
        db.add(video)
        db.commit()
        db.refresh(video)
        return video

    @staticmethod
    def _extract_video_id(value: str) -> Optional[str]:
        """Extract YouTube video ID from a URL or return it directly if already an ID."""
        if re.fullmatch(r"^[a-zA-Z0-9_-]{11}$", value):
            return value

        patterns = [
            r"(?:v=|\/)([0-9A-Za-z_-]{11}).*",
            r"youtu\.be\/([0-9A-Za-z_-]{11})",
        ]
        for pattern in patterns:
            match = re.search(pattern, value)
            if match:
                return match.group(1)
        return None
