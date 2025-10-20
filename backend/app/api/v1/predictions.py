"""Prediction API endpoints."""
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.dependencies import get_db, get_current_active_user
from app.models import User, PredictionStatus
from app.schemas import (
    PredictionCreate,
    PredictionResult,
    PredictionResponse,
    PredictionListResponse,
    PredictionPerformanceResponse,
    UpdateActualViews,
)
from app.services import PredictionService, VideoService, ChannelService
from app.services.ml_service import MLService
from app.schemas.orchestrator import VideoPredictionResponse, VideoPredictionRequest
from app.services.forecasting_orchestrator_service import ForecastingOrchestratorService

router = APIRouter(tags=["predictions"])


@router.post("/", response_model=PredictionResponse, status_code=status.HTTP_201_CREATED)
def create_prediction(
    prediction_data: PredictionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Create a new prediction for a video.
    Uses the ML forecasting model to predict 30-day view count.
    """
    # Get video and channel
    video = VideoService.get_video(db, prediction_data.video_id, current_user.id)
    channel = ChannelService.get_channel(db, prediction_data.channel_id, current_user.id)

    # Generate prediction using ML model
    prediction_result = MLService.predict_views(
        db, video, channel, prediction_data.days_after_upload or 0
    )

    # Create prediction record
    prediction = PredictionService.create_prediction(
        db, prediction_data, prediction_result, current_user.id
    )
    return prediction


@router.get("/", response_model=PredictionListResponse)
def list_predictions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    channel_id: Optional[int] = Query(None),
    video_id: Optional[int] = Query(None),
    status: Optional[PredictionStatus] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all predictions for the current user with optional filters."""
    predictions, total = PredictionService.get_user_predictions(
        db, current_user.id, skip, limit, channel_id, video_id, status
    )
    return PredictionListResponse(predictions=predictions, total=total)


@router.get("/performance", response_model=PredictionPerformanceResponse)
def get_prediction_performance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get prediction performance metrics for the current user."""
    performance = PredictionService.get_performance_metrics(db, current_user.id)
    if not performance:
        # Return default metrics if no predictions yet
        return PredictionPerformanceResponse(
            user_id=current_user.id,
            total_predictions=0,
            completed_predictions=0,
            pending_predictions=0,
            average_accuracy=None,
            average_absolute_error=None,
            average_percentage_error=None,
            best_prediction_id=None,
            worst_prediction_id=None,
            last_calculated_at=None,
        )
    return performance


@router.get("/{prediction_id}", response_model=PredictionResponse)
def get_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get a specific prediction."""
    prediction = PredictionService.get_prediction(db, prediction_id, current_user.id)
    return prediction


@router.patch("/{prediction_id}/actual-views", response_model=PredictionResponse)
def update_prediction_actual_views(
    prediction_id: int,
    data: UpdateActualViews,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Update actual views for a prediction and calculate accuracy metrics.
    """
    # Call the service to update the actual views and recalculate metrics
    prediction = PredictionService.update_actual_views(
        db, prediction_id, data.actual_views, current_user.id
    )

    # The returned 'prediction' should already contain updated daily views, factors, etc.
    return prediction

@router.post(
    "/create-combined",
    response_model=VideoPredictionResponse,
    status_code=status.HTTP_201_CREATED
)
def create_video_and_prediction(
    payload: VideoPredictionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    result = ForecastingOrchestratorService.create_video_and_prediction(
        db=db,
        video_data=payload.video,
        prediction_data=payload.prediction,
        user_id=current_user.id
    )
    return VideoPredictionResponse(video=result["video"], prediction=result["prediction"])
