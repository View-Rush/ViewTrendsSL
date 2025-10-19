"""Channel service for business logic."""
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional
from datetime import datetime

from app.models import Channel
from app.schemas import ChannelCreate, ChannelUpdate
from app.core.exceptions import ChannelNotFoundException, ForbiddenException


class ChannelService:
    """Service for channel operations."""

    # -------------------------------------------------------
    # CREATE
    # -------------------------------------------------------
    @staticmethod
    def create_channel(db: Session, channel_data: ChannelCreate, user_id: int) -> Channel:
        """Create a new channel (real or dummy)."""

        # Only check for duplicates if it's a real YouTube channel
        if channel_data.type == "real" and channel_data.channel_id:
            existing = db.query(Channel).filter(
                and_(
                    Channel.channel_id == channel_data.channel_id,
                    Channel.user_id == user_id
                )
            ).first()
            if existing:
                # Update existing channel instead
                return ChannelService.update_channel(
                    db, existing.id, ChannelUpdate(**channel_data.model_dump()), user_id
                )

        # Create new channel
        channel = Channel(
            user_id=user_id,
            **channel_data.model_dump(),
            last_synced_at=datetime.utcnow() if channel_data.type == "real" else None,
        )
        db.add(channel)
        db.commit()
        db.refresh(channel)
        return channel

    # -------------------------------------------------------
    # READ
    # -------------------------------------------------------
    @staticmethod
    def get_channel(db: Session, channel_id: int, user_id: int) -> Channel:
        """Get a channel by internal ID."""
        channel = db.query(Channel).filter(Channel.id == channel_id).first()
        if not channel:
            raise ChannelNotFoundException("Channel not found")
        if channel.user_id != user_id:
            raise ForbiddenException("Access denied to this channel")
        return channel

    @staticmethod
    def get_channel_by_youtube_id(db: Session, youtube_channel_id: str, user_id: int) -> Optional[Channel]:
        """Get a real YouTube channel by YouTube channel ID."""
        return db.query(Channel).filter(
            and_(
                Channel.channel_id == youtube_channel_id,
                Channel.user_id == user_id
            )
        ).first()

    @staticmethod
    def get_user_channels(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        connected_only: bool = False,
        type_filter: Optional[str] = None
    ) -> tuple[list[Channel], int]:
        """Get all channels for a user, with optional filtering."""
        query = db.query(Channel).filter(Channel.user_id == user_id)

        if connected_only:
            query = query.filter(Channel.is_connected.is_(True))

        if type_filter in {"real", "dummy"}:
            query = query.filter(Channel.type == type_filter)

        total = query.count()
        channels = query.offset(skip).limit(limit).all()
        return channels, total

    # -------------------------------------------------------
    # UPDATE
    # -------------------------------------------------------
    @staticmethod
    def update_channel(
        db: Session,
        channel_id: int,
        channel_data: ChannelUpdate,
        user_id: int
    ) -> Channel:
        """Update a channel."""
        channel = ChannelService.get_channel(db, channel_id, user_id)

        update_data = channel_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(channel, field, value)

        # Only update last_synced_at for real channels
        if channel.type == "real":
            channel.last_synced_at = datetime.utcnow()

        db.commit()
        db.refresh(channel)
        return channel

    # -------------------------------------------------------
    # DELETE
    # -------------------------------------------------------
    @staticmethod
    def delete_channel(db: Session, channel_id: int, user_id: int) -> None:
        """Delete a channel."""
        channel = ChannelService.get_channel(db, channel_id, user_id)
        db.delete(channel)
        db.commit()

    # -------------------------------------------------------
    # SYNC
    # -------------------------------------------------------
    @staticmethod
    def sync_channel_stats(
        db: Session,
        channel_id: int,
        user_id: int,
        subscriber_count: int,
        video_count: int,
        view_count: int,
        likes: Optional[int] = None,
    ) -> Channel:
        """Sync statistics for real channels (from YouTube API)."""
        channel = ChannelService.get_channel(db, channel_id, user_id)

        if channel.type != "real":
            raise ForbiddenException("Cannot sync stats for dummy channels")

        channel.subscriber_count = subscriber_count
        channel.video_count = video_count
        channel.view_count = view_count
        if likes is not None:
            channel.likes = likes
        channel.last_synced_at = datetime.utcnow()

        db.commit()
        db.refresh(channel)
        return channel
