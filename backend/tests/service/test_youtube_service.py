"""Tests for YouTubeService."""
import pytest
from app.services.youtube_service import YouTubeService

@pytest.fixture
def youtube_service():
    return YouTubeService()

def test_get_video_details(monkeypatch, youtube_service):
    """Test YouTubeService.get_video_details with mock response."""
    mock_response = {
        "items": [
            {
                "id": "abc123",
                "snippet": {
                    "title": "Mock Video",
                    "description": "Mock Description",
                    "publishedAt": "2024-01-01T00:00:00Z",
                    "thumbnails": {"high": {"url": "http://mock/thumbnail.jpg"}},
                    "tags": ["mock", "test"],
                    "categoryId": "22"
                },
                "contentDetails": {"duration": "PT5M10S"},
                "statistics": {"viewCount": "100", "likeCount": "10", "commentCount": "5"}
            }
        ]
    }

    def mock_get(endpoint, params):
        assert endpoint == "videos"
        return mock_response

    monkeypatch.setattr(youtube_service.client, "get", mock_get)
    video_data = youtube_service.get_video_details("abc123")

    assert video_data["title"] == "Mock Video"
    assert video_data["view_count"] == 100
    assert video_data["duration"] == "PT5M10S"
