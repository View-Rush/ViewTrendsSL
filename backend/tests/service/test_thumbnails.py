"""Tests for thumbnail upload and analysis endpoints within the video router."""

import io
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from app.models import Video, User, Channel


@pytest.fixture
def mock_image_file():
    """Create a fake image file for testing."""
    return io.BytesIO(b"fake_image_data")


def test_upload_thumbnail_success(client: TestClient, auth_headers: dict, mock_image_file):
    """Test successful thumbnail upload (mocked Supabase)."""

    mock_response = {
        "public_url": "https://mock-supabase-url.com/thumbnails/demo-user/test.png",
        "path": "demo-user/test.png",
    }

    with patch("app.api.v1.videos.upload_thumbnail_to_supabase", return_value=mock_response):
        files = {"file": ("test.png", mock_image_file, "image/png")}
        data = {"user_id": "demo-user"}

        response = client.post(
            "/api/v1/videos/upload-thumbnail",
            files=files,
            data=data,
            headers=auth_headers,
        )

    assert response.status_code == 200
    data = response.json()
    assert "public_url" in data
    assert data["public_url"].startswith("https://mock-supabase-url.com/")
    assert data["path"].endswith(".png")


def test_upload_thumbnail_invalid_file_type(client: TestClient, auth_headers: dict):
    """Test thumbnail upload fails with invalid file type."""
    fake_file = io.BytesIO(b"notanimage")
    files = {"file": ("test.txt", fake_file, "text/plain")}
    data = {"user_id": "demo-user"}

    response = client.post(
        "/api/v1/videos/upload-thumbnail",  # ✅ fixed path
        files=files,
        data=data,
        headers=auth_headers,
    )

    assert response.status_code in (400, 422)


def test_upload_thumbnail_too_large(client: TestClient, auth_headers: dict):
    """Test thumbnail upload fails for files over 5 MB."""
    big_data = b"x" * (5 * 1024 * 1024 + 1)  # 5MB + 1 byte
    big_file = io.BytesIO(big_data)
    files = {"file": ("large.png", big_file, "image/png")}
    data = {"user_id": "demo-user"}

    response = client.post(
        "/api/v1/videos/upload-thumbnail",  # ✅ fixed path
        files=files,
        data=data,
        headers=auth_headers,
    )

    assert response.status_code in (400, 413)


def test_analyze_thumbnail(client: TestClient, auth_headers: dict):
    """Test thumbnail analysis endpoint returns mock data."""
    request_data = {"thumbnail_url": "https://example.com/test_thumbnail.png"}

    response = client.post(
        "/api/v1/videos/analyze-thumbnail",  # ✅ still correct
        json=request_data,
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert "analysis" in data
    assert "quality_score" in data["analysis"]
    assert isinstance(data["analysis"]["quality_score"], float)


def test_analyze_thumbnail_missing_url(client: TestClient, auth_headers: dict):
    """Test thumbnail analysis fails if URL missing."""
    response = client.post(
        "/api/v1/videos/analyze-thumbnail",
        json={},  # Missing thumbnail_url
        headers=auth_headers,
    )

    assert response.status_code == 422
