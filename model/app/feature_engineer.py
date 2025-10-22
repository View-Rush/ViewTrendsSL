import numpy as np
from datetime import datetime
from app.models import PredictionRequest

class FeatureEngineer:
    @staticmethod
    def compute_features(req: PredictionRequest) -> dict:
        dm = req.daily_metrics
        cm = req.channel_info
        vm = req.video_metadata
        cl = req.category_leader

        current_day = req.current_day
        views_today = dm[current_day].views
        views_yesterday = dm.get(current_day - 1, dm[current_day]).views

        # --- Derived metrics ---
        views_dif_last1 = views_today - views_yesterday
        likes_t = dm[current_day].likes
        comments_t = dm[current_day].comments
        day1_views = dm[1].views

        growth_ratio_t = (views_today + 1) / (day1_views + 1)
        likes_comments_views_t = (likes_t + comments_t) / max(views_today, 1)

        # --- Temporal ---
        weekday = req.published_at.weekday()
        hour_bin = req.published_at.hour // 6

        # --- Virality factor ---
        leader_stats = cl or None
        if leader_stats:
            subs_factor = ((cm.subscribers + 1) / (cm.total_views + 1)) / (
                (leader_stats.subscribers + 1) / (leader_stats.total_views + 1)
            )
            video_factor = cm.total_videos / leader_stats.total_videos
        else:
            subs_factor = 1.0
            video_factor = 1.0

        virality_t = np.log1p(subs_factor ** 4 * video_factor ** -3)

        # --- Combine ---
        return {
            "t": current_day,
            "views_cml_t": np.log1p(views_today),
            "likes_cml_t": np.log1p(likes_t),
            "comments_cml_t": np.log1p(comments_t),
            "views_dif_last1": np.log1p(views_dif_last1 + 1e-9),
            "growth_ratio_t": np.log1p(growth_ratio_t),
            "likes_comments_views_t": np.log1p(likes_comments_views_t + 1e-9),
            "weekday": weekday,
            "hour_bin": hour_bin,
            "is_short": int(req.video_type == "short"),
            "virality_t": virality_t,
            "video_duration_sec": np.log1p(vm.duration_seconds),
            "sharpness": (req.thumbnail_features.sharpness if req.thumbnail_features else 0),
            "colorfulness": (req.thumbnail_features.colorfulness if req.thumbnail_features else 0),
            "title_pca2": (req.text_features.title_pca2 if req.text_features else 0),
        }
