"""Tests for prediction endpoints."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime

from app.models import User, Channel, Video, Prediction, PredictionStatus


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


@pytest.fixture
def test_video(db: Session, test_user: User, test_channel: Channel):
    """Create a test video."""
    video = Video(
        user_id=test_user.id,
        channel_id=test_channel.id,
        title="Test Video",
        description="Test description",
        is_draft=True,
        is_uploaded=False
    )
    db.add(video)
    db.commit()
    db.refresh(video)
    return video


def test_create_prediction(
        client: TestClient,
        auth_headers: dict,
        db: Session,
        test_video: Video,
        test_channel: Channel
):
    """Test creating a new prediction."""
    prediction_data = {
        "video_id": test_video.id,
        "channel_id": test_channel.id,
        "days_after_upload": 0,
        "model_version": "v1.0.0"
    }

    response = client.post(
        "/api/v1/predictions/",
        json=prediction_data,
        headers=auth_headers
    )

    assert response.status_code == 201
    data = response.json()
    assert data["video_id"] == test_video.id
    assert data["channel_id"] == test_channel.id
    assert "predicted_views" in data
    assert data["status"] == "pending"


def test_list_predictions(
        client: TestClient,
        auth_headers: dict,
        db: Session,
        test_user: User,
        test_video: Video,
        test_channel: Channel
):
    """Test listing predictions."""
    # Create test predictions
    prediction1 = Prediction(
        user_id=test_user.id,
        channel_id=test_channel.id,
        video_id=test_video.id,
        prediction_date=datetime.utcnow(),
        target_date=datetime.utcnow(),
        predicted_views=100000,
        status=PredictionStatus.PENDING
    )
    prediction2 = Prediction(
        user_id=test_user.id,
        channel_id=test_channel.id,
        video_id=test_video.id,
        prediction_date=datetime.utcnow(),
        target_date=datetime.utcnow(),
        predicted_views=200000,
        status=PredictionStatus.COMPLETED,
        actual_views=180000
    )
    db.add_all([prediction1, prediction2])
    db.commit()

    response = client.get("/api/v1/predictions/", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["predictions"]) == 2


def test_get_prediction(
        client: TestClient,
        auth_headers: dict,
        db: Session,
        test_user: User,
        test_video: Video,
        test_channel: Channel
):
    """Test getting a specific prediction."""
    prediction = Prediction(
        user_id=test_user.id,
        channel_id=test_channel.id,
        video_id=test_video.id,
        prediction_date=datetime.utcnow(),
        target_date=datetime.utcnow(),
        predicted_views=150000,
        status=PredictionStatus.PENDING
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    response = client.get(f"/api/v1/predictions/{prediction.id}", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == prediction.id
    assert data["predicted_views"] == 150000


def test_update_actual_views(
        client: TestClient,
        auth_headers: dict,
        db: Session,
        test_user: User,
        test_video: Video,
        test_channel: Channel
):
    """Test updating actual views for a prediction."""
    prediction = Prediction(
        user_id=test_user.id,
        channel_id=test_channel.id,
        video_id=test_video.id,
        prediction_date=datetime.utcnow(),
        target_date=datetime.utcnow(),
        predicted_views=100000,
        status=PredictionStatus.PENDING
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    update_data = {"actual_views": 95000}

    response = client.patch(
        f"/api/v1/predictions/{prediction.id}/actual-views",
        json=update_data,
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["actual_views"] == 95000
    assert data["status"] == "completed"
    assert data["absolute_error"] == 5000
    assert data["accuracy_score"] is not None


def test_get_prediction_performance(
    client: TestClient,
    auth_headers: dict,
    db: Session,
    test_user: User,
    test_video: Video,
    test_channel: Channel
):
    """Test getting prediction performance metrics."""

    from app.services import PredictionService
    from app.models import Prediction, PredictionStatus

    # Create completed predictions
    prediction1 = Prediction(
        user_id=test_user.id,
        channel_id=test_channel.id,
        video_id=test_video.id,
        prediction_date=datetime.utcnow(),
        target_date=datetime.utcnow(),
        predicted_views=100000,
        actual_views=95000,
        status=PredictionStatus.COMPLETED,
        accuracy_score=95.0,
        absolute_error=5000,
        percentage_error=5.0
    )
    prediction2 = Prediction(
        user_id=test_user.id,
        channel_id=test_channel.id,
        video_id=test_video.id,
        prediction_date=datetime.utcnow(),
        target_date=datetime.utcnow(),
        predicted_views=200000,
        actual_views=180000,
        status=PredictionStatus.COMPLETED,
        accuracy_score=90.0,
        absolute_error=20000,
        percentage_error=10.0
    )

    db.add_all([prediction1, prediction2])
    db.commit()

    # Recalculate the user's prediction performance
    PredictionService._update_performance_metrics(db, test_user.id)

    # Call the API endpoint
    response = client.get("/api/v1/predictions/performance", headers=auth_headers)
    assert response.status_code == 200

    data = response.json()
    assert data["user_id"] == test_user.id
    assert data["total_predictions"] >= 2
    assert data["completed_predictions"] >= 2
    assert data["average_accuracy"] is not None
    assert data["average_absolute_error"] is not None
    assert data["average_percentage_error"] is not None
    assert data["best_prediction_id"] is not None
    assert data["worst_prediction_id"] is not None


def test_filter_predictions_by_status(
        client: TestClient,
        auth_headers: dict,
        db: Session,
        test_user: User,
        test_video: Video,
        test_channel: Channel
):
    """Test filtering predictions by status."""
    # Create predictions with different statuses
    prediction1 = Prediction(
        user_id=test_user.id,
        channel_id=test_channel.id,
        video_id=test_video.id,
        prediction_date=datetime.utcnow(),
        target_date=datetime.utcnow(),
        predicted_views=100000,
        status=PredictionStatus.PENDING
    )
    prediction2 = Prediction(
        user_id=test_user.id,
        channel_id=test_channel.id,
        video_id=test_video.id,
        prediction_date=datetime.utcnow(),
        target_date=datetime.utcnow(),
        predicted_views=200000,
        status=PredictionStatus.COMPLETED,
        actual_views=180000
    )
    db.add_all([prediction1, prediction2])
    db.commit()

    # Filter by pending status
    response = client.get(
        "/api/v1/predictions/?status=pending",
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert all(p["status"] == "pending" for p in data["predictions"])

    # Filter by completed status
    response = client.get(
        "/api/v1/predictions/?status=completed",
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert all(p["status"] == "completed" for p in data["predictions"])