"""Simple HTTP client for YouTube Data API."""
import requests
from app.core.config import settings

class YouTubeClient:
    BASE_URL = "https://www.googleapis.com/youtube/v3"

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or settings.YOUTUBE_API_KEY

    def get(self, endpoint: str, params: dict) -> dict:
        params["key"] = self.api_key
        response = requests.get(f"{self.BASE_URL}/{endpoint}", params=params)
        response.raise_for_status()
        return response.json()
