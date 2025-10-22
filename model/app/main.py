from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from app.models import (
    PredictionRequest, PredictionResponse, PredictionResult,
    HealthResponse
)
from app.feature_engineer import FeatureEngineer
from app.predictor import HybridPredictor
import numpy as np

app = FastAPI(title="ViewTrendSL - Forecast API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = HybridPredictor()

@app.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(
        status="ok",
        message="Service is running",
        timestamp=datetime.utcnow(),
        models_status={f"{k[0]}_{k[1]}": True for k in predictor.models.keys()}
    )

@app.post("/predict", response_model=PredictionResponse)
def predict_views(request: PredictionRequest):
    predictor = HybridPredictor("models/")

    # Convert your request.daily_metrics (dict of day → DailyMetrics)
    # into a list of feature dictionaries (one per day)
    daily_features_list = build_features_series(request)

    preds = predictor.predict_series(
        daily_features_list,
        horizon=request.horizon.value,
        video_type=request.video_type.value,
        current_day=request.current_day
    )

    return PredictionResponse(
        video_id=request.video_id,
        horizon=request.horizon.value,
        video_type=request.video_type.value,
        current_day=request.current_day,
        predictions=[
            PredictionResult(day=p["day"], predicted_views=p["predicted"])
            for p in preds
        ],
        model_used=f"hybrid_{request.horizon.value}_{request.video_type.value}",
        hybrid_weights=preds[-1]["weights"] if preds else None,
        processing_time_ms=sum(p["elapsed_ms"] for p in preds)
    )

def build_features_series(request: PredictionRequest):
    """
    Convert Pydantic request into a list of per-day feature dicts (ordered by day).
    - Handles JSON keys (strings) by coercing to int.
    - Computes diffs / last-3-mean robustly.
    - Uses hour_bin = hour // 6 (4 bins). Change divisor to 3 if you want 3-hour bins.
    """
    # normalize daily_metrics keys to int (some clients send JSON keys as strings)
    raw_daily = request.daily_metrics or {}
    daily_metrics = {}
    for k, v in raw_daily.items():
        try:
            dk = int(k)
        except Exception:
            # if the key is not coercible, skip it
            continue
        daily_metrics[dk] = v

    if not daily_metrics:
        return []

    # ensure we have day 1 baseline if possible
    day1_views = daily_metrics.get(1).views if 1 in daily_metrics else None

    features_list = []
    days_sorted = sorted(daily_metrics.keys())

    for day in days_sorted:
        metrics = daily_metrics[day]
        views_t = int(metrics.views or 0)
        likes_t = int(metrics.likes or 0)
        comments_t = int(metrics.comments or 0)

        # views_dif_last1
        if day > 1 and (day - 1) in daily_metrics:
            prev_views = int(daily_metrics[day - 1].views or 0)
            views_dif_last1 = max(views_t - prev_views, 0)
        else:
            views_dif_last1 = 0

        # views_dif_last3_mean: mean of up to last-3 diffs ending at 'day'
        diffs = []
        start = max(2, day - 2)  # start day for diffs (day 2..day)
        for d in range(start, day + 1):
            if d in daily_metrics and (d - 1) in daily_metrics:
                cur = int(daily_metrics[d].views or 0)
                prev = int(daily_metrics[d - 1].views or 0)
                diffs.append(max(cur - prev, 0))
        views_dif_last3_mean = float(np.mean(diffs)) if diffs else 0.0

        # growth_ratio_t: views_cml_t / max(day1_views, 1)
        denom = max(day1_views or 1, 1)
        growth_ratio_t = float(views_t) / float(denom)

        # time context (published_at should already be parsed to datetime)
        pub = request.published_at
        weekday = pub.weekday() if pub is not None else 0

        # hour_bin: 4 bins (0..3) by 6-hour blocks. Change to //3 for 3-hour bins.
        hour_bin = int(pub.hour // 6) if pub is not None else 0

        # is_short: infer or use provided
        is_short_flag = 1 if request.video_type.value == "short" else 0

        feats = {
            "t": day,
            "views_cml_t": views_t,
            "likes_cml_t": likes_t,
            "comments_cml_t": comments_t,
            "views_dif_last1": views_dif_last1,
            "views_dif_last3_mean": views_dif_last3_mean,
            "growth_ratio_t": growth_ratio_t,
            "weekday": weekday,
            "hour_bin": hour_bin,
            "is_short": is_short_flag,
            # optional/enrichment features (safely default)
            "video_duration_seconds": getattr(request.video_metadata, "duration_seconds", 0),
            "title_pca2": getattr(request.text_features, "title_pca2", 0) if request.text_features else 0,
            "sharpness": getattr(request.thumbnail_features, "sharpness", 0) if request.thumbnail_features else 0,
            "colorfulness": getattr(request.thumbnail_features, "colorfulness", 0) if request.thumbnail_features else 0,
            # channel/context fields (if you want to include them; safe defaults)
            "channel_subs": getattr(request.channel_info, "subscribers", 0),
            "channel_total_views": getattr(request.channel_info, "total_views", 0),
            "channel_no_of_videos": getattr(request.channel_info, "total_videos", 0),
        }

        features_list.append(feats)

    return features_list
