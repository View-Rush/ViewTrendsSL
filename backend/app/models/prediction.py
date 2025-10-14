"""Prediction model for storing video view predictions."""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, BigInteger, Float, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base
import enum


class PredictionStatus(str, enum.Enum):
    """Prediction status enum."""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"


class Prediction(Base):
    """Prediction model for storing 30-day view count predictions."""

    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    channel_id = Column(Integer, ForeignKey("channels.id", ondelete="CASCADE"), nullable=False)
    video_id = Column(Integer, ForeignKey("videos.id", ondelete="CASCADE"), nullable=False)

    # Prediction metadata
    prediction_date = Column(DateTime, nullable=False, index=True)  # When prediction was made
    target_date = Column(DateTime, nullable=False)  # 30 days from video upload or prediction date
    days_after_upload = Column(Integer, default=0)  # Days since video was uploaded when prediction was made

    # Prediction results
    predicted_views = Column(BigInteger, nullable=False)
    confidence_score = Column(Float, nullable=True)  # Model confidence (0-1)
    prediction_breakdown = Column(JSON, nullable=True)  # Daily predictions if available

    # Model information
    model_version = Column(String(50), nullable=True)
    model_features = Column(JSON, nullable=True)  # Features used for prediction

    # Actual results (for performance tracking)
    actual_views = Column(BigInteger, nullable=True)  # Actual views after 30 days
    accuracy_score = Column(Float, nullable=True)  # Calculated when actual views are known
    absolute_error = Column(BigInteger, nullable=True)
    percentage_error = Column(Float, nullable=True)

    # Status
    status = Column(SQLEnum(PredictionStatus), default=PredictionStatus.PENDING)

    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    completed_at = Column(DateTime, nullable=True)  # When actual views were recorded

    # Relationships
    user = relationship("User", back_populates="predictions")
    channel = relationship("Channel", back_populates="predictions")
    video = relationship("Video", back_populates="predictions")


class PredictionPerformance(Base):
    """Aggregated prediction performance metrics by user."""

    __tablename__ = "prediction_performance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)

    # Overall metrics
    total_predictions = Column(Integer, default=0)
    completed_predictions = Column(Integer, default=0)
    pending_predictions = Column(Integer, default=0)

    # Accuracy metrics
    average_accuracy = Column(Float, nullable=True)
    average_absolute_error = Column(BigInteger, nullable=True)
    average_percentage_error = Column(Float, nullable=True)

    # Best/worst predictions
    best_prediction_id = Column(Integer, nullable=True)
    worst_prediction_id = Column(Integer, nullable=True)

    # Timestamps
    last_calculated_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="prediction_performance")
