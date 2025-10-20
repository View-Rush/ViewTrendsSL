"""Forecasting orchestrator service that combines video creation and prediction generation."""

from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.services import VideoService, PredictionService, ChannelService
from app.services.ml_service import MLService
from app.schemas import VideoCreate, PredictionCreate
from app.models import Video
from app.core.exceptions import ForbiddenException, VideoNotFoundException
from typing import Optional


class ForecastingOrchestratorService:
    """
    Service to handle combined logic for creating videos (if not exist)
    and generating predictions in one flow.
    """

    @staticmethod
    def create_video_and_prediction(
        db: Session,
        video_data: VideoCreate,
        prediction_data: PredictionCreate,
        user_id: int
    ) -> dict:
        # Verify channel ownership first
        channel = ChannelService.get_channel(db, video_data.channel_id, user_id)
        if not channel:
            raise ForbiddenException("Channel not found or access denied")

        existing_video: Optional[Video] = None

        # Try finding existing video
        if video_data.video_id:
            # By YouTube video_id (if supplied)
            existing_video = VideoService.get_video_by_youtube_id(
                db, video_data.video_id, user_id
            )
        else:
            # Otherwise, check if a video by same title + channel exists
            existing_video = (
                db.query(Video)
                .filter(
                    and_(
                        Video.user_id == user_id,
                        Video.channel_id == video_data.channel_id,
                        Video.title == video_data.title,
                    )
                )
                .first()
            )

        # Create video if it doesn't exist
        if not existing_video:
            video = VideoService.create_video(db, video_data, user_id)
        else:
            video = existing_video
        # Generate prediction using ML model
        prediction_result = MLService.predict_views(
            db, video, channel, prediction_data.days_after_upload or 0
        )
        prediction_data.video_id = video.id  # Link to created/found video

        # Create prediction record
        prediction = PredictionService.create_prediction(
            db, prediction_data, prediction_result, user_id
        )

        return {"video": video, "prediction": prediction}
