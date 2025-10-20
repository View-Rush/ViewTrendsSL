"""Combined schemas for video + prediction creation flow."""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from app.schemas.video import VideoCreate, VideoResponse
from app.schemas.prediction import PredictionCreate, PredictionResponse


class VideoPredictionRequest(BaseModel):
    """
    Combined request payload for creating a video (if not exists)
    and generating a prediction.
    """
    video: VideoCreate = Field(..., description="Video creation payload")
    prediction: PredictionCreate = Field(..., description="Prediction creation payload")


class VideoPredictionResponse(BaseModel):
    """
    Combined response payload for video creation + prediction generation.
    """
    video: VideoResponse = Field(..., description="Created or existing video object")
    prediction: PredictionResponse = Field(..., description="Created prediction object")

    class Config:
        from_attributes = True
