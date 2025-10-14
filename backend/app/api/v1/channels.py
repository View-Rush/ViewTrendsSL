"""Channel API endpoints."""
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.dependencies import get_db, get_current_active_user
from app.models import User
from app.schemas import (
    ChannelCreate,
    ChannelUpdate,
    ChannelResponse,
    ChannelListResponse,
)
from app.services import ChannelService

router = APIRouter(
    tags=["channels"]
)


@router.post("/", response_model=ChannelResponse, status_code=status.HTTP_201_CREATED)
def create_channel(
    channel_data: ChannelCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Create a new channel or update if exists."""
    channel = ChannelService.create_channel(db, channel_data, current_user.id)
    return channel


@router.get("/", response_model=ChannelListResponse)
def list_channels(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    connected_only: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all channels for the current user."""
    channels, total = ChannelService.get_user_channels(
        db, current_user.id, skip, limit, connected_only
    )
    return ChannelListResponse(channels=channels, total=total)


@router.get("/{channel_id}", response_model=ChannelResponse)
def get_channel(
    channel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get a specific channel."""
    channel = ChannelService.get_channel(db, channel_id, current_user.id)
    return channel


@router.patch("/{channel_id}", response_model=ChannelResponse)
def update_channel(
    channel_id: int,
    channel_data: ChannelUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update a channel."""
    channel = ChannelService.update_channel(db, channel_id, channel_data, current_user.id)
    return channel


@router.delete("/{channel_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_channel(
    channel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete a channel."""
    ChannelService.delete_channel(db, channel_id, current_user.id)
    return None
