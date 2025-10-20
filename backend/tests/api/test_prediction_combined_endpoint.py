"""Tests for the combined video + prediction creation endpoint."""
import pytest
from datetime import datetime
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import User, Channel, Video, Prediction, PredictionStatus


@pytest.fixture
def test_channel(db: Session, test_user: User):
    """Create a test channel."""
    channel = Channel(
        user_id=test_user.id,
        channel_id="UC_combined_test",
        channel_title="Combined Test Channel",
        subscriber_count=5000,
        video_count=10,
        view_count=250000
    )
    db.add(channel)
    db.commit()
    db.refresh(channel)
    return channel


def test_create_combined_video_and_prediction(
    client: TestClient,
    auth_headers: dict,
    db: Session,
    test_user: User,
    test_channel: Channel
):
    """Test creating a video and prediction in a single request."""
    video_data = {
        "title": "Combined Endpoint Test Video",
        "description": "Testing video creation + prediction",
        "channel_id": test_channel.id,
        "duration": "PT5M30S",
        "category_id": "education",
        "default_language": "en",
        "tags": ["ai", "forecasting"],
        "published_at": datetime.utcnow().isoformat(),
        "is_uploaded": False,
        "is_draft": True,
        "source_type": "manual",
        "user_id": test_user.id
    }

    prediction_data = {
        "video_id": 0,  # ignored; backend links created video
        "channel_id": test_channel.id,
        "days_after_upload": 0,
        "model_version": "v1.0.0"
    }

    payload = {"video": video_data, "prediction": prediction_data}
    response = client.post(
        "/api/v1/predictions/create-combined",
        json=payload,
        headers=auth_headers
    )

    assert response.status_code == 201, response.text
    data = response.json()

    # --- Validate structure ---
    assert "video" in data and "prediction" in data
    video = data["video"]
    prediction = data["prediction"]

    # --- Validate video creation ---
    assert video["title"] == video_data["title"]
    assert video["channel_id"] == test_channel.id
    assert video["is_draft"] is True

    # --- Validate prediction creation ---
    assert prediction["channel_id"] == test_channel.id
    assert prediction["video_id"] == video["id"]
    assert prediction["status"] == "pending"
    assert "predicted_views" in prediction

    # --- Verify persisted in DB ---
    db_video = db.query(Video).filter(Video.id == video["id"]).first()
    db_prediction = db.query(Prediction).filter(Prediction.id == prediction["id"]).first()
    assert db_video is not None
    assert db_prediction is not None
    assert db_prediction.video_id == db_video.id


def test_combined_endpoint_uses_existing_video(
    client: TestClient,
    auth_headers: dict,
    db: Session,
    test_user: User,
    test_channel: Channel
):
    """Test that if the video already exists, the endpoint reuses it."""
    # Pre-create a video
    existing_video = Video(
        user_id=test_user.id,
        channel_id=test_channel.id,
        title="Existing Video",
        description="Already in DB",
        duration="PT4M0S",
        category_id="education",
        default_language="en",
        is_draft=True,
        is_uploaded=False
    )
    db.add(existing_video)
    db.commit()
    db.refresh(existing_video)

    # Combined payload with same channel, new prediction
    video_data = {
        "title": existing_video.title,
        "description": existing_video.description,
        "channel_id": test_channel.id,
        "duration": "PT4M0S",
        "category_id": "education",
        "default_language": "en",
        "tags": ["reuse"],
        "is_uploaded": False,
        "is_draft": True,
        "source_type": "manual",
    }

    prediction_data = {
        "video_id": 0,
        "channel_id": test_channel.id,
        "days_after_upload": 0,
        "model_version": "v1.0.0"
    }

    payload = {"video": video_data, "prediction": prediction_data}

    response = client.post(
        "/api/v1/predictions/create-combined",
        json=payload,
        headers=auth_headers
    )

    assert response.status_code == 201, response.text
    data = response.json()

    video = data["video"]
    prediction = data["prediction"]

    # Ensure existing video reused (not duplicated)
    assert video["id"] == existing_video.id
    assert prediction["video_id"] == existing_video.id

    # Only one video in DB for this channel/title
    count = db.query(Video).filter(
        Video.user_id == test_user.id,
        Video.title == existing_video.title
    ).count()
    assert count == 1


def test_combined_endpoint_missing_channel(
    client: TestClient,
    auth_headers: dict,
):
    """Test combined creation fails if channel is missing."""
    video_data = {
        "title": "Missing Channel Video",
        "description": "This should fail",
        "channel_id": 99999,  # nonexistent
        "duration": "PT3M10S",
        "category_id": "music",
        "default_language": "en",
    }

    prediction_data = {
        "video_id": 0,
        "channel_id": 99999,
        "days_after_upload": 0,
    }

    payload = {"video": video_data, "prediction": prediction_data}

    response = client.post(
        "/api/v1/predictions/create-combined",
        json=payload,
        headers=auth_headers
    )

    assert response.status_code in (400, 403, 404)
