from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    BigInteger,
    Text,
    Enum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base
import enum


class ChannelType(str, enum.Enum):
    REAL = "real"
    DUMMY = "dummy"


class Channel(Base):
    """Represents both YouTube and dummy channels."""

    __tablename__ = "channels"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Distinguish between real and dummy
    type = Column(Enum(ChannelType), default=ChannelType.REAL, nullable=False)

    # Common fields (for both)
    channel_title = Column(String(255), nullable=False)
    channel_description = Column(Text, nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    country = Column(String(100), nullable=True)
    published_at = Column(DateTime, nullable=True)

    # Real channel–specific
    channel_id = Column(String(255), unique=True, index=True, nullable=True)
    custom_url = Column(String(255), nullable=True)
    is_connected = Column(Boolean, default=True)
    last_synced_at = Column(DateTime, nullable=True)

    # Stats (used by both)
    subscriber_count = Column(BigInteger, default=0)
    video_count = Column(Integer, default=0)
    view_count = Column(BigInteger, default=0)
    likes = Column(BigInteger, default=0)

    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="channels")
    videos = relationship("Video", back_populates="channel", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="channel", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Channel(id={self.id}, type={self.type}, title={self.channel_title})>"
