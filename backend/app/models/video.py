import enum

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, BigInteger, Text, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class VideoSourceType(str, enum.Enum):
    YOUTUBE = "youtube"
    MANUAL = "manual"
    TEST = "test"


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    channel_id = Column(Integer, ForeignKey("channels.id", ondelete="CASCADE"), nullable=False)

    # Source
    source_type = Column(
        Enum(VideoSourceType, name="video_source_type", native_enum=False),
        default=VideoSourceType.YOUTUBE,
        nullable=False
    )
    source_metadata = Column(JSON, nullable=True)

    # YouTube video data
    video_id = Column(String(255), unique=True, index=True, nullable=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)

    # Metadata
    thumbnail_url = Column(String(500), nullable=True)
    thumbnail_analysis = Column(JSON, nullable=True)
    duration = Column(String(50), nullable=True)
    category_id = Column(String(50), nullable=True)
    default_language = Column(String(50), nullable=True)
    default_audio_language = Column(String(50), nullable=True)

    # Statistics
    view_count = Column(BigInteger, default=0)
    like_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)

    # Tags and topics
    tags = Column(JSON, nullable=True)
    topics = Column(JSON, nullable=True)

    # Publishing info
    published_at = Column(DateTime, nullable=True)
    privacy_status = Column(String(50), default="private")

    # Status
    is_uploaded = Column(Boolean, default=False)
    is_draft = Column(Boolean, default=True)
    is_synthetic = Column(Boolean, default=False)  # For model-generated or test data

    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    last_synced_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="videos")
    channel = relationship("Channel", back_populates="videos")
    predictions = relationship("Prediction", back_populates="video", cascade="all, delete-orphan")
