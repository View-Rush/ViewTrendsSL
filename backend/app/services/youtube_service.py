"""High-level service for YouTube API communication."""
from typing import Optional, Any
from app.services.youtube_client import YouTubeClient
from app.mappers.youtube_mapper import map_youtube_video, map_youtube_channel

class YouTubeService:
    def __init__(self):
        self.client = YouTubeClient()

    def get_video_details(self, video_id: str) -> Optional[dict[str, Any]]:
        """Fetch video metadata."""
        data = self.client.get("videos", {
            "part": "snippet,contentDetails,statistics",
            "id": video_id
        })
        items = data.get("items", [])
        if not items:
            return None
        return map_youtube_video(items[0])

    def get_channel_details(self, channel_id: str) -> Optional[dict[str, Any]]:
        """Fetch channel metadata."""
        data = self.client.get("channels", {
            "part": "snippet,statistics,contentDetails",
            "id": channel_id
        })
        items = data.get("items", [])
        if not items:
            return None
        return map_youtube_channel(items[0])
