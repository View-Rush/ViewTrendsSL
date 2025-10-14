"""Video model for storing YouTube video metadata."""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, BigInteger, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class Video(Base):
    """YouTube Video model."""

    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    channel_id = Column(Integer, ForeignKey("channels.id", ondelete="CASCADE"), nullable=False)

    # YouTube video data
    video_id = Column(String(255), unique=True, index=True, nullable=True)  # Nullable for drafts
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)

    # Video metadata
    thumbnail_url = Column(String(500), nullable=True)
    thumbnail_analysis = Column(JSON, nullable=True)  # Store thumbnail analysis results
    duration = Column(String(50), nullable=True)  # ISO 8601 duration format
    category_id = Column(String(50), nullable=True)
    default_language = Column(String(50), nullable=True)
    default_audio_language = Column(String(50), nullable=True)

    # Video statistics (current/actual)
    view_count = Column(BigInteger, default=0)
    like_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)

    # Tags and topics
    tags = Column(JSON, nullable=True)  # Array of tags
    topics = Column(JSON, nullable=True)  # Array of topics

    # Publishing information
    published_at = Column(DateTime, nullable=True)
    privacy_status = Column(String(50), default="private")  # private, unlisted, public

    # Video status
    is_uploaded = Column(Boolean, default=False)
    is_draft = Column(Boolean, default=True)  # For videos in library before upload

    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    last_synced_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="videos")
    channel = relationship("Channel", back_populates="videos")
    predictions = relationship("Prediction", back_populates="video", cascade="all, delete-orphan")
