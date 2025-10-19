import os
import pytest
from app.services.youtube_service import YouTubeService

@pytest.mark.integration
@pytest.mark.skipif(
    not os.getenv("YOUTUBE_API_KEY"),
    reason="No YouTube API key set — skipping real API test."
)
def test_youtube_service_real_api():
    """Integration test that checks YouTube API with real key."""
    service = YouTubeService()
    video_id = "wwt67b-LxgQ"

    data = service.get_video_details(video_id)
    assert data is not None
    assert "title" in data
    assert data["video_id"] == video_id
    assert data["view_count"] >= 0
