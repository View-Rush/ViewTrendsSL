"""Prediction schemas for API requests/responses."""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Any
from app.models.prediction import PredictionStatus


class PredictionBase(BaseModel):
    """Base prediction schema."""
    video_id: int = Field(..., description="Video ID (internal)")
    channel_id: int = Field(..., description="Channel ID (internal)")


class PredictionCreate(PredictionBase):
    """Schema for creating a prediction."""
    days_after_upload: Optional[int] = 0
    model_version: Optional[str] = None


class PredictionResult(BaseModel):
    """Schema for prediction result from ML model."""
    predicted_views: int = Field(..., description="Predicted view count after 30 days")
    confidence_score: Optional[float] = Field(None, ge=0, le=1)
    prediction_breakdown: Optional[dict[str, Any]] = None
    model_features: Optional[dict[str, Any]] = None


class PredictionInDB(PredictionBase):
    """Schema for prediction in database."""
    id: int
    user_id: int
    prediction_date: datetime
    target_date: datetime
    days_after_upload: int
    predicted_views: int
    confidence_score: Optional[float]
    prediction_breakdown: Optional[dict[str, Any]]
    model_version: Optional[str]
    model_features: Optional[dict[str, Any]]
    actual_views: Optional[int]
    accuracy_score: Optional[float]
    absolute_error: Optional[int]
    percentage_error: Optional[float]
    status: PredictionStatus
    created_at: datetime
    updated_at: Optional[datetime]
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class PredictionResponse(PredictionInDB):
    """Schema for prediction response."""
    pass


class PredictionListResponse(BaseModel):
    """Schema for list of predictions."""
    predictions: list[PredictionResponse]
    total: int


class PredictionPerformanceResponse(BaseModel):
    """Schema for prediction performance metrics."""
    user_id: int
    total_predictions: int
    completed_predictions: int
    pending_predictions: int
    average_accuracy: Optional[float]
    average_absolute_error: Optional[int]
    average_percentage_error: Optional[float]
    best_prediction_id: Optional[int]
    worst_prediction_id: Optional[int]
    last_calculated_at: Optional[datetime]

    class Config:
        from_attributes = True


class UpdateActualViews(BaseModel):
    """Schema for updating actual views."""
    actual_views: int = Field(..., ge=0, description="Actual view count after 30 days")