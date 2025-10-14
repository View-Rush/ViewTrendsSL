from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, BigInteger, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class Channel(Base):
    """YouTube Channel model."""

    __tablename__ = "channels"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # YouTube channel data
    channel_id = Column(String(255), unique=True, index=True, nullable=False)
    channel_title = Column(String(255), nullable=False)
    channel_description = Column(Text, nullable=True)
    custom_url = Column(String(255), nullable=True)

    # Channel statistics
    subscriber_count = Column(BigInteger, default=0)
    video_count = Column(Integer, default=0)
    view_count = Column(BigInteger, default=0)

    # Channel metadata
    thumbnail_url = Column(String(500), nullable=True)
    country = Column(String(100), nullable=True)
    published_at = Column(DateTime, nullable=True)

    # Connection status
    is_connected = Column(Boolean, default=True)
    last_synced_at = Column(DateTime, nullable=True)

    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="channels")
    videos = relationship("Video", back_populates="channel", cascade="all, delete-orphan")
    # predictions = relationship("Prediction", back_populates="channel", cascade="all, delete-orphan")
