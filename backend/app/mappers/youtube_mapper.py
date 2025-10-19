"""Mappers for normalizing YouTube API responses."""
from datetime import datetime, timezone


def map_youtube_video(item: dict) -> dict:
    snippet = item.get("snippet", {})
    stats = item.get("statistics", {})
    content = item.get("contentDetails", {})

    # Handle ISO 8601 timestamp -> Python datetime
    published_at_str = snippet.get("publishedAt")
    published_at = None
    if published_at_str:
        try:
            # YouTube returns e.g. "2021-01-01T00:00:00Z"
            published_at = datetime.fromisoformat(
                published_at_str.replace("Z", "+00:00")
            )
        except Exception:
            published_at = None

    return {
        "video_id": item.get("id"),
        "title": snippet.get("title"),
        "description": snippet.get("description"),
        "thumbnail_url": snippet.get("thumbnails", {}).get("high", {}).get("url"),
        "duration": content.get("duration"),
        "view_count": int(stats.get("viewCount", 0)),
        "like_count": int(stats.get("likeCount", 0)),
        "comment_count": int(stats.get("commentCount", 0)),
        "published_at": published_at,  # ✅ datetime object
        "category_id": snippet.get("categoryId"),
        "tags": snippet.get("tags", []),
    }


def map_youtube_channel(item: dict) -> dict:
    snippet = item.get("snippet", {})
    stats = item.get("statistics", {})
    content = item.get("contentDetails", {})

    # Handle ISO 8601 timestamp -> Python datetime
    published_at_str = snippet.get("publishedAt")
    published_at = None
    if published_at_str:
        try:
            published_at = datetime.fromisoformat(
                published_at_str.replace("Z", "+00:00")
            )
        except Exception:
            published_at = None

    return {
        "channel_id": item.get("id"),
        "name": snippet.get("title"),
        "description": snippet.get("description"),
        "country": snippet.get("country"),
        "published_at": published_at,  # ✅ datetime
        "view_count": int(stats.get("viewCount", 0)),
        "subscriber_count": int(stats.get("subscriberCount", 0)),
        "video_count": int(stats.get("videoCount", 0)),
        "uploads_playlist_id": content.get("relatedPlaylists", {}).get("uploads"),
    }
