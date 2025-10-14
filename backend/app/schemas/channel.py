from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ChannelBase(BaseModel):
    """Base channel schema."""
    channel_id: str = Field(..., description="YouTube channel ID")
    channel_title: str = Field(..., description="Channel title")
    channel_description: Optional[str] = None
    custom_url: Optional[str] = None


class ChannelCreate(ChannelBase):
    """Schema for creating a channel."""
    subscriber_count: Optional[int] = 0
    video_count: Optional[int] = 0
    view_count: Optional[int] = 0
    thumbnail_url: Optional[str] = None
    country: Optional[str] = None
    published_at: Optional[datetime] = None


class ChannelUpdate(BaseModel):
    """Schema for updating a channel."""
    channel_title: Optional[str] = None
    channel_description: Optional[str] = None
    custom_url: Optional[str] = None
    subscriber_count: Optional[int] = None
    video_count: Optional[int] = None
    view_count: Optional[int] = None
    thumbnail_url: Optional[str] = None
    country: Optional[str] = None
    is_connected: Optional[bool] = None


class ChannelInDB(ChannelBase):
    """Schema for channel in database."""
    id: int
    user_id: int
    subscriber_count: int
    video_count: int
    view_count: int
    thumbnail_url: Optional[str]
    country: Optional[str]
    published_at: Optional[datetime]
    is_connected: bool
    last_synced_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class ChannelResponse(ChannelInDB):
    """Schema for channel response."""
    pass


class ChannelListResponse(BaseModel):
    """Schema for list of channels."""
    channels: list[ChannelResponse]
    total: int