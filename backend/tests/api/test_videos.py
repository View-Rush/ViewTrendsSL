"""Tests for video endpoints."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import User, Channel, Video, VideoSourceType


@pytest.fixture
def test_channel(db: Session, test_user: User):
    """Create a test channel."""
    channel = Channel(
        user_id=test_user.id,
        channel_id="UC_test_channel",
        channel_title="Test Channel",
        subscriber_count=10000,
        video_count=50,
        view_count=500000
    )
    db.add(channel)
    db.commit()
    db.refresh(channel)
    return channel


def test_create_video_draft(
        client: TestClient,
        auth_headers: dict,
        db: Session,
        test_channel: Channel
):
    """Test creating a video draft."""
    video_data = {
        "channel_id": test_channel.id,
        "title": "Test Video",
        "description": "Test video description",
        "tags": ["test", "video"],
        "is_draft": True,
        "is_uploaded": False,
        "source_type": "manual",
        "is_synthetic": False,
        "source_metadata": {"created_via": "ui"}
    }

    response = client.post(
        "/api/v1/videos/",
        json=video_data,
        headers=auth_headers
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == video_data["title"]
    assert data["is_draft"] is True
    assert data["is_uploaded"] is False
    assert data["source_type"] == "manual"
    assert data["is_synthetic"] is False
    assert data["source_metadata"]["created_via"] == "ui"


def test_create_uploaded_video(
        client: TestClient,
        auth_headers: dict,
        db: Session,
        test_channel: Channel
):
    """Test creating an uploaded video."""
    video_data = {
        "channel_id": test_channel.id,
        "video_id": "test_video_id_123",
        "title": "Uploaded Video",
        "description": "Uploaded video description",
        "tags": ["uploaded", "test"],
        "is_draft": False,
        "is_uploaded": True,
        "privacy_status": "public",
        "source_type": "youtube"
    }

    response = client.post(
        "/api/v1/videos/",
        json=video_data,
        headers=auth_headers
    )

    assert response.status_code == 201
    data = response.json()
    assert data["video_id"] == video_data["video_id"]
    assert data["is_uploaded"] is True
    assert data["source_type"] == "youtube"


def test_create_synthetic_video(
        client: TestClient,
        auth_headers: dict,
        db: Session,
        test_channel: Channel
):
    """Test creating a synthetic (test) video."""
    video_data = {
        "channel_id": test_channel.id,
        "title": "Synthetic Video",
        "description": "Model-generated test video",
        "is_draft": False,
        "is_uploaded": True,
        "is_synthetic": True,
        "source_type": "test",
        "source_metadata": {"generated_by": "forecast_model_v1"}
    }

    response = client.post(
        "/api/v1/videos/",
        json=video_data,
        headers=auth_headers
    )

    assert response.status_code == 201
    data = response.json()
    assert data["is_synthetic"] is True
    assert data["source_type"] == "test"
    assert "forecast_model_v1" in data["source_metadata"].values()


def test_list_videos(
        client: TestClient,
        auth_headers: dict,
        db: Session,
        test_user: User,
        test_channel: Channel
):
    """Test listing videos."""
    # Create test videos
    video1 = Video(
        user_id=test_user.id,
        channel_id=test_channel.id,
        title="Video 1",
        is_draft=True,
        is_uploaded=False,
        source_type=VideoSourceType.MANUAL
    )
    video2 = Video(
        user_id=test_user.id,
        channel_id=test_channel.id,
        title="Video 2",
        video_id="video_2_id",
        is_draft=False,
        is_uploaded=True,
        source_type=VideoSourceType.YOUTUBE
    )
    db.add_all([video1, video2])
    db.commit()

    response = client.get("/api/v1/videos/", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["videos"]) == 2


def test_filter_videos_by_draft_status(
        client: TestClient,
        auth_headers: dict,
        db: Session,
        test_user: User,
        test_channel: Channel
):
    """Test filtering videos by draft status."""
    draft_video = Video(
        user_id=test_user.id,
        channel_id=test_channel.id,
        title="Draft Video",
        is_draft=True,
        is_uploaded=False
    )
    uploaded_video = Video(
        user_id=test_user.id,
        channel_id=test_channel.id,
        title="Uploaded Video",
        video_id="uploaded_id",
        is_draft=False,
        is_uploaded=True
    )
    db.add_all([draft_video, uploaded_video])
    db.commit()

    response = client.get("/api/v1/videos/?is_draft=true", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert all(v["is_draft"] for v in data["videos"])


def test_filter_videos_by_source_type(
        client: TestClient,
        auth_headers: dict,
        db: Session,
        test_user: User,
        test_channel: Channel
):
    """Test filtering videos by source type."""
    video1 = Video(
        user_id=test_user.id,
        channel_id=test_channel.id,
        title="Manual Video",
        source_type=VideoSourceType.MANUAL
    )
    video2 = Video(
        user_id=test_user.id,
        channel_id=test_channel.id,
        title="YouTube Video",
        source_type=VideoSourceType.YOUTUBE
    )
    db.add_all([video1, video2])
    db.commit()

    response = client.get("/api/v1/videos/?source_type=manual", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert all(v["source_type"] == "manual" for v in data["videos"])


def test_filter_videos_by_channel(
        client: TestClient,
        auth_headers: dict,
        db: Session,
        test_user: User
):
    """Test filtering videos by channel."""
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

    video1 = Video(
        user_id=test_user.id,
        channel_id=channel1.id,
        title="Video Channel 1",
        is_draft=True
    )
    video2 = Video(
        user_id=test_user.id,
        channel_id=channel2.id,
        title="Video Channel 2",
        is_draft=True
    )
    db.add_all([video1, video2])
    db.commit()

    response = client.get(f"/api/v1/videos/?channel_id={channel1.id}", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert all(v["channel_id"] == channel1.id for v in data["videos"])


def test_get_video(
        client: TestClient,
        auth_headers: dict,
        db: Session,
        test_user: User,
        test_channel: Channel
):
    """Test getting a specific video."""
    video = Video(
        user_id=test_user.id,
        channel_id=test_channel.id,
        title="Test Video",
        description="Test description",
        is_draft=True
    )
    db.add(video)
    db.commit()
    db.refresh(video)

    response = client.get(f"/api/v1/videos/{video.id}", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == video.id
    assert data["title"] == video.title


def test_update_video(
        client: TestClient,
        auth_headers: dict,
        db: Session,
        test_user: User,
        test_channel: Channel
):
    """Test updating a video."""
    video = Video(
        user_id=test_user.id,
        channel_id=test_channel.id,
        title="Original Title",
        is_draft=True
    )
    db.add(video)
    db.commit()
    db.refresh(video)

    update_data = {
        "title": "Updated Title",
        "description": "Updated description",
        "tags": ["updated", "tags"],
        "source_type": "manual",
        "is_synthetic": True
    }

    response = client.patch(f"/api/v1/videos/{video.id}", json=update_data, headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["description"] == "Updated description"
    assert data["is_synthetic"] is True
    assert data["source_type"] == "manual"


def test_delete_video(
        client: TestClient,
        auth_headers: dict,
        db: Session,
        test_user: User,
        test_channel: Channel
):
    """Test deleting a video."""
    video = Video(
        user_id=test_user.id,
        channel_id=test_channel.id,
        title="Test Video",
        is_draft=True
    )
    db.add(video)
    db.commit()
    db.refresh(video)

    response = client.delete(f"/api/v1/videos/{video.id}", headers=auth_headers)

    assert response.status_code == 204

    deleted_video = db.query(Video).filter(Video.id == video.id).first()
    assert deleted_video is None


def test_analyze_thumbnail(client: TestClient, auth_headers: dict):
    """Test thumbnail analysis endpoint."""
    request_data = {"thumbnail_url": "https://example.com/thumbnail.jpg"}

    response = client.post(
        "/api/v1/videos/analyze-thumbnail",
        json=request_data,
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert "analysis" in data
    assert "quality_score" in data["analysis"]
