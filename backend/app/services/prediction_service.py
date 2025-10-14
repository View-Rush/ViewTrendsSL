"""Prediction service for business logic."""
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from typing import Optional
from datetime import datetime, timedelta
from app.models import Prediction, PredictionPerformance, Video, Channel, PredictionStatus
from app.schemas import PredictionCreate, PredictionResult
from app.core.exceptions import PredictionNotFoundException, ForbiddenException


class PredictionService:
    """Service for prediction operations."""

    @staticmethod
    def create_prediction(
            db: Session,
            prediction_data: PredictionCreate,
            prediction_result: PredictionResult,
            user_id: int
    ) -> Prediction:
        """Create a new prediction."""
        # Verify video and channel ownership
        video = db.query(Video).filter(
            and_(
                Video.id == prediction_data.video_id,
                Video.user_id == user_id
            )
        ).first()

        if not video:
            raise ForbiddenException("Video not found or access denied")

        channel = db.query(Channel).filter(
            and_(
                Channel.id == prediction_data.channel_id,
                Channel.user_id == user_id
            )
        ).first()

        if not channel:
            raise ForbiddenException("Channel not found or access denied")

        # Calculate target date (30 days from now or from upload date)
        prediction_date = datetime.utcnow()
        target_date = prediction_date + timedelta(days=30)

        prediction = Prediction(
            user_id=user_id,
            channel_id=prediction_data.channel_id,
            video_id=prediction_data.video_id,
            prediction_date=prediction_date,
            target_date=target_date,
            days_after_upload=prediction_data.days_after_upload or 0,
            predicted_views=prediction_result.predicted_views,
            confidence_score=prediction_result.confidence_score,
            prediction_breakdown=prediction_result.prediction_breakdown,
            model_version=prediction_data.model_version,
            model_features=prediction_result.model_features,
            status=PredictionStatus.PENDING
        )

        db.add(prediction)
        db.commit()
        db.refresh(prediction)

        # Update performance metrics
        PredictionService._update_performance_metrics(db, user_id)

        return prediction

    @staticmethod
    def get_prediction(db: Session, prediction_id: int, user_id: int) -> Prediction:
        """Get a prediction by ID."""
        prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
        if not prediction:
            raise PredictionNotFoundException("Prediction not found")
        if prediction.user_id != user_id:
            raise ForbiddenException("Access denied to this prediction")
        return prediction

    @staticmethod
    def get_user_predictions(
            db: Session,
            user_id: int,
            skip: int = 0,
            limit: int = 100,
            channel_id: Optional[int] = None,
            video_id: Optional[int] = None,
            status: Optional[PredictionStatus] = None
    ) -> tuple[list[Prediction], int]:
        """Get all predictions for a user with optional filters."""
        query = db.query(Prediction).filter(Prediction.user_id == user_id)

        if channel_id is not None:
            query = query.filter(Prediction.channel_id == channel_id)

        if video_id is not None:
            query = query.filter(Prediction.video_id == video_id)

        if status is not None:
            query = query.filter(Prediction.status == status)

        total = query.count()
        predictions = query.order_by(Prediction.prediction_date.desc()).offset(skip).limit(limit).all()
        return predictions, total

    @staticmethod
    def update_actual_views(
            db: Session,
            prediction_id: int,
            actual_views: int,
            user_id: int
    ) -> Prediction:
        """Update actual views and calculate accuracy metrics."""
        prediction = PredictionService.get_prediction(db, prediction_id, user_id)

        prediction.actual_views = actual_views
        prediction.status = PredictionStatus.COMPLETED
        prediction.completed_at = datetime.utcnow()

        # Calculate accuracy metrics
        predicted = prediction.predicted_views
        actual = actual_views

        # Absolute error
        prediction.absolute_error = abs(predicted - actual)

        # Percentage error
        if actual > 0:
            prediction.percentage_error = (abs(predicted - actual) / actual) * 100
        else:
            prediction.percentage_error = 100.0 if predicted > 0 else 0.0

        # Accuracy score (inverse of percentage error, capped at 100%)
        if prediction.percentage_error is not None:
            prediction.accuracy_score = max(0, 100 - prediction.percentage_error)

        db.commit()
        db.refresh(prediction)

        # Update performance metrics
        PredictionService._update_performance_metrics(db, user_id)

        return prediction

    @staticmethod
    def get_performance_metrics(db: Session, user_id: int) -> Optional[PredictionPerformance]:
        """Get prediction performance metrics for a user."""
        x=  db.query(PredictionPerformance).filter(
            PredictionPerformance.user_id == user_id
        ).first()
        return x

    @staticmethod
    def _update_performance_metrics(db: Session, user_id: int) -> None:
        """Update aggregated performance metrics for a user."""
        # Get or create performance record
        performance = db.query(PredictionPerformance).filter(
            PredictionPerformance.user_id == user_id
        ).first()

        if not performance:
            performance = PredictionPerformance(user_id=user_id)
            db.add(performance)

        # Calculate metrics
        all_predictions = db.query(Prediction).filter(
            Prediction.user_id == user_id
        ).all()

        performance.total_predictions = len(all_predictions)
        performance.completed_predictions = sum(
            1 for p in all_predictions if p.status == PredictionStatus.COMPLETED
        )
        performance.pending_predictions = sum(
            1 for p in all_predictions if p.status == PredictionStatus.PENDING
        )

        # Calculate average metrics for completed predictions
        completed = [p for p in all_predictions if p.status == PredictionStatus.COMPLETED]

        if completed:
            accuracy_scores = [p.accuracy_score for p in completed if p.accuracy_score is not None]
            if accuracy_scores:
                performance.average_accuracy = sum(accuracy_scores) / len(accuracy_scores)

            absolute_errors = [p.absolute_error for p in completed if p.absolute_error is not None]
            if absolute_errors:
                performance.average_absolute_error = int(sum(absolute_errors) / len(absolute_errors))

            percentage_errors = [p.percentage_error for p in completed if p.percentage_error is not None]
            if percentage_errors:
                performance.average_percentage_error = sum(percentage_errors) / len(percentage_errors)

            # Find best and worst predictions
            if accuracy_scores:
                best = max(completed, key=lambda p: p.accuracy_score or 0)
                worst = min(completed, key=lambda p: p.accuracy_score or 100)
                performance.best_prediction_id = best.id
                performance.worst_prediction_id = worst.id

        performance.last_calculated_at = datetime.utcnow()
        db.commit()