"""Tests for channel endpoints."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import User, Channel


def test_create_channel(authenticated_client: TestClient, auth_headers: dict, db: Session):
    """Test creating a new channel."""
    channel_data = {
        "channel_id": "UC_test_channel_id",
        "channel_title": "Test Channel",
        "channel_description": "Test channel description",
        "subscriber_count": 10000,
        "video_count": 50,
        "view_count": 500000,
    }

    response = authenticated_client.post(
        "/api/v1/channels/",
        json=channel_data,
        headers=auth_headers
    )

    assert response.status_code == 201
    data = response.json()
    assert data["channel_id"] == channel_data["channel_id"]
    assert data["channel_title"] == channel_data["channel_title"]
    assert data["subscriber_count"] == channel_data["subscriber_count"]


def test_list_channels(authenticated_client: TestClient, auth_headers: dict, db: Session, test_user: User):
    """Test listing user's channels."""
    # Create test channels
    channel1 = Channel(
        user_id=test_user.id,
        channel_id="UC_channel1",
        channel_title="Channel 1",
        subscriber_count=1000,
        video_count=10,
        view_count=50000
    )
    channel2 = Channel(
        user_id=test_user.id,
        channel_id="UC_channel2",
        channel_title="Channel 2",
        subscriber_count=2000,
        video_count=20,
        view_count=100000
    )
    db.add_all([channel1, channel2])
    db.commit()

    response = authenticated_client.get("/api/v1/channels/", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["channels"]) == 2


def test_get_channel(authenticated_client: TestClient, auth_headers: dict, db: Session, test_user: User):
    """Test getting a specific channel."""
    channel = Channel(
        user_id=test_user.id,
        channel_id="UC_test_channel",
        channel_title="Test Channel",
        subscriber_count=5000,
        video_count=25,
        view_count=250000
    )
    db.add(channel)
    db.commit()
    db.refresh(channel)

    response = authenticated_client.get(f"/api/v1/channels/{channel.id}", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == channel.id
    assert data["channel_id"] == channel.channel_id


def test_update_channel(authenticated_client: TestClient, auth_headers: dict, db: Session, test_user: User):
    """Test updating a channel."""
    channel = Channel(
        user_id=test_user.id,
        channel_id="UC_test_channel",
        channel_title="Test Channel",
        subscriber_count=5000,
        video_count=25,
        view_count=250000
    )
    db.add(channel)
    db.commit()
    db.refresh(channel)

    update_data = {
        "channel_title": "Updated Channel Title",
        "subscriber_count": 6000,
    }

    response = authenticated_client.patch(
        f"/api/v1/channels/{channel.id}",
        json=update_data,
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["channel_title"] == update_data["channel_title"]
    assert data["subscriber_count"] == update_data["subscriber_count"]


def test_delete_channel(authenticated_client: TestClient, auth_headers: dict, db: Session, test_user: User):
    """Test deleting a channel."""
    channel = Channel(
        user_id=test_user.id,
        channel_id="UC_test_channel",
        channel_title="Test Channel",
        subscriber_count=5000,
        video_count=25,
        view_count=250000
    )
    db.add(channel)
    db.commit()
    db.refresh(channel)

    response = authenticated_client.delete(f"/api/v1/channels/{channel.id}", headers=auth_headers)

    assert response.status_code == 204

    # Verify channel is deleted
    deleted_channel = db.query(Channel).filter(Channel.id == channel.id).first()
    assert deleted_channel is None


def test_access_other_user_channel(
        authenticated_client: TestClient,
        auth_headers: dict,
        db: Session,
        test_user: User
):
    """Test that users cannot access other users' channels."""
    # Create another user
    other_user = User(
        email="other@example.com",
        full_name="otheruser",
        hashed_password="hashed",
        is_active=True
    )
    db.add(other_user)
    db.commit()

    # Create channel for other user
    channel = Channel(
        user_id=other_user.id,
        channel_id="UC_other_channel",
        channel_title="Other Channel",
        subscriber_count=1000,
        video_count=10,
        view_count=50000
    )
    db.add(channel)
    db.commit()
    db.refresh(channel)

    response = authenticated_client.get(f"/api/v1/channels/{channel.id}", headers=auth_headers)

    assert response.status_code == 403
