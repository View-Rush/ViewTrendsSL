from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Literal


# Shared Enum (sync with SQLAlchemy Enum)
ChannelType = Literal["real", "dummy"]


class ChannelBase(BaseModel):
    """Base schema for a channel (both YouTube and dummy)."""

    channel_title: str = Field(..., description="Channel title")
    channel_description: Optional[str] = Field(None, description="Channel description")
    thumbnail_url: Optional[str] = Field(None, description="Thumbnail image URL")
    country: Optional[str] = Field(None, description="Country of the channel")
    published_at: Optional[datetime] = Field(None, description="Channel creation date")

    # Distinguish between real and dummy
    type: ChannelType = Field("real", description="Type of channel: real or dummy")


class ChannelCreate(ChannelBase):
    """Schema for creating a channel."""

    # Real YouTube channels might include these
    channel_id: Optional[str] = Field(None, description="YouTube channel ID")
    custom_url: Optional[str] = None
    subscriber_count: Optional[int] = 0
    video_count: Optional[int] = 0
    view_count: Optional[int] = 0
    likes: Optional[int] = 0
    is_connected: Optional[bool] = True


class ChannelUpdate(BaseModel):
    """Schema for updating a channel."""

    channel_title: Optional[str] = None
    channel_description: Optional[str] = None
    custom_url: Optional[str] = None
    subscriber_count: Optional[int] = None
    video_count: Optional[int] = None
    view_count: Optional[int] = None
    likes: Optional[int] = None
    thumbnail_url: Optional[str] = None
    country: Optional[str] = None
    is_connected: Optional[bool] = None
    type: Optional[ChannelType] = None


class ChannelInDB(ChannelBase):
    """Schema for channel as stored in the database."""

    id: int
    user_id: int
    channel_id: Optional[str]
    custom_url: Optional[str]
    subscriber_count: int
    video_count: int
    view_count: int
    likes: int
    is_connected: bool
    last_synced_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True  # For SQLAlchemy ORM integration


class ChannelResponse(ChannelInDB):
    """Schema returned in API responses."""
    pass


class ChannelListResponse(BaseModel):
    """Schema for a paginated list of channels."""
    channels: list[ChannelResponse]
    total: int
