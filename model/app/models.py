"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, List
from datetime import datetime
from enum import Enum


class VideoType(str, Enum):
    ALL = "all"
    SHORT = "short"
    LONG = "long"


class Horizon(str, Enum):
    SEVEN_DAY = "7d"
    THIRTY_DAY = "30d"


class DailyMetrics(BaseModel):
    """Daily cumulative metrics"""
    views: int = Field(..., ge=0, description="Cumulative views")
    likes: int = Field(..., ge=0, description="Cumulative likes")
    comments: int = Field(..., ge=0, description="Cumulative comments")


class ChannelInfo(BaseModel):
    """Channel metadata"""
    channel_id: str
    subscribers: int = Field(..., ge=0)
    total_views: int = Field(..., ge=0)
    total_videos: int = Field(..., ge=1)
    created_at: datetime

    @validator('created_at', pre=True)
    def parse_datetime(cls, v):
        if isinstance(v, str):
            return datetime.fromisoformat(v.replace('Z', '+00:00'))
        return v


class VideoMetadata(BaseModel):
    """Video technical metadata"""
    duration_seconds: int = Field(..., ge=0)
    width: int = Field(..., ge=1)
    height: int = Field(..., ge=1)
    fps: float = Field(..., ge=0)
    bitrate_kbps: Optional[float] = Field(None, ge=0)
    orientation: str = Field(..., description="portrait or landscape")
    resolution: str = Field(..., description="e.g., 1080p, 720p")

    @validator('orientation')
    def validate_orientation(cls, v):
        if v not in ['portrait', 'landscape']:
            raise ValueError('Orientation must be portrait or landscape')
        return v


class TextFeatures(BaseModel):
    """Precomputed text features"""
    title: str = Field(..., min_length=1)
    title_pca2: Optional[float] = Field(None, description="2nd PCA component of title embedding")


class ThumbnailFeatures(BaseModel):
    """Precomputed thumbnail features"""
    sharpness: Optional[float] = Field(None, description="Variance of Laplacian")
    colorfulness: Optional[float] = Field(None, description="Color vibrancy metric")


class CategoryLeader(BaseModel):
    """Category leader statistics"""
    subscribers: int = Field(..., ge=0)
    total_views: int = Field(..., ge=0)
    total_videos: int = Field(..., ge=1)
    age_days: float = Field(..., ge=0)
    avg_views_per_video_per_day: float = Field(..., ge=0)


class PredictionRequest(BaseModel):
    """Main prediction request model"""
    # Identifiers
    video_id: str = Field(..., description="YouTube video ID")
    category_id: int = Field(..., ge=1, le=44, description="YouTube category ID")

    # Video metadata
    video_metadata: VideoMetadata
    published_at: datetime

    # Channel info
    channel_info: ChannelInfo

    # Daily metrics (days 1 to current_day)
    daily_metrics: Dict[int, DailyMetrics] = Field(
        ...,
        description="Daily metrics keyed by day number (1-indexed)"
    )

    # Optional enrichment features
    text_features: Optional[TextFeatures] = None
    thumbnail_features: Optional[ThumbnailFeatures] = None

    # Category leader info (optional, will use defaults if not provided)
    category_leader: Optional[CategoryLeader] = None

    # Prediction parameters
    current_day: int = Field(..., ge=1, le=30, description="Current day index")
    horizon: Horizon = Field(..., description="7d or 30d prediction horizon")
    video_type: VideoType = Field(VideoType.ALL, description="Video type classification")

    @validator('published_at', pre=True)
    def parse_published_at(cls, v):
        if isinstance(v, str):
            return datetime.fromisoformat(v.replace('Z', '+00:00'))
        return v

    @validator('daily_metrics')
    def validate_daily_metrics(cls, v, values):
        if 'current_day' in values:
            current_day = values['current_day']
            if not all(1 <= day <= current_day for day in v.keys()):
                raise ValueError(f'Daily metrics must be for days 1 to {current_day}')
        return v

    @validator('video_type', pre=True, always=True)
    def determine_video_type(cls, v, values):
        """Auto-determine video type if not provided"""
        if v is not None:
            return v

        if 'video_metadata' in values:
            meta = values['video_metadata']
            is_short = (
                    meta.duration_seconds <= 180 and
                    meta.orientation == 'portrait'
            )
            return VideoType.SHORT if is_short else VideoType.LONG

        return VideoType.ALL


class PredictionResult(BaseModel):
    """Single day prediction result"""
    day: int
    predicted_views: float
    confidence_interval_lower: Optional[float] = None
    confidence_interval_upper: Optional[float] = None


class PredictionResponse(BaseModel):
    """Prediction response"""
    video_id: str
    horizon: str
    video_type: str
    current_day: int
    predictions: List[PredictionResult]

    # Model diagnostics
    model_used: str
    lgb_prediction: Optional[float] = None
    xgb_prediction: Optional[float] = None
    hybrid_weights: Optional[Dict[str, float]] = None

    # Metadata
    predicted_at: datetime = Field(default_factory=datetime.utcnow)
    processing_time_ms: Optional[float] = None


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    message: str
    timestamp: datetime
    models_status: Optional[Dict[str, bool]] = None