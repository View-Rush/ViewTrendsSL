import joblib
import numpy as np
import os
from time import perf_counter
import xgboost as xgb

class HybridPredictor:
    def __init__(self, model_dir: str = "models/"):
        self.models = {}
        for horizon in ["7d", "30d"]:
            for vtype in ["all", "short", "long"]:
                name = f"hybrid_{horizon}_{vtype}.joblib"
                path = os.path.join(model_dir, name)
                if os.path.exists(path):
                    try:
                        self.models[(horizon, vtype)] = joblib.load(path)
                        print(f"✅ Loaded {name}")
                    except Exception as e:
                        print(f"⚠️ Failed to load {name}: {e}")
        print(f"✅ Total {len(self.models)} hybrid models loaded")

    def _unwrap_model(self, bundle, key):
        obj = bundle.get(key)
        if isinstance(obj, dict):
            if "booster" in obj:
                return obj["booster"], obj.get("features")
            if "model" in obj:
                return obj["model"], obj.get("features")
        return obj, None

    def _prepare_input(self, features_dict, expected_features):
        if not expected_features:
            expected_features = sorted(features_dict.keys())
        row = [features_dict.get(f, 0) for f in expected_features]
        return np.array(row).reshape(1, -1)

    def predict_series(self, daily_features_list, horizon: str, video_type: str, current_day: int):
        """
        Predicts the next (future) days beyond `current_day` up to horizon.

        Args:
            daily_features_list: list of dicts, each containing features up to that day (1..current_day)
            horizon: '7d' or '30d'
            video_type: 'all', 'short', or 'long'
            current_day: last observed day (e.g., 3 means we have data till day 3)

        Returns:
            list of dicts [{day, predicted, lgb_pred, xgb_pred, weights, elapsed_ms}, ...]
        """
        model_bundle = self.models.get((horizon, video_type))
        if model_bundle is None:
            raise ValueError(f"No model found for {horizon}/{video_type}")

        lgb_model, lgb_features = self._unwrap_model(model_bundle, "lightgbm")
        xgb_model, xgb_features = self._unwrap_model(model_bundle, "xgboost")
        blend_weights = model_bundle.get("blend", {"lightgbm": 0.5, "xgboost": 0.5})
        w_lgb = blend_weights.get("lightgbm", 0.5)
        w_xgb = blend_weights.get("xgboost", 0.5)

        # Identify base features (latest day we have)
        if current_day > len(daily_features_list):
            raise ValueError("current_day exceeds available feature days")

        base_feats = daily_features_list[current_day - 1].copy()

        results = []
        # Predict future days (simulate progression)
        for offset in range(1, int(horizon.replace("d", "")) + 1):
            future_day = current_day + offset
            feats = base_feats.copy()
            feats["t"] = future_day

            # (Optional) naive extrapolation for cumulative fields
            for key in ["views_cml_t", "likes_cml_t", "comments_cml_t"]:
                if key in feats:
                    growth = feats[key] * (1.02 ** offset)  # +2% daily compounding
                    feats[key] = float(growth)

            start = perf_counter()
            lgb_pred = xgb_pred = None

            # --- LightGBM prediction ---
            if lgb_model is not None:
                try:
                    X_lgb = self._prepare_input(feats, lgb_features)
                    lgb_pred = lgb_model.predict(X_lgb)[0]
                except Exception as e:
                    print(f"⚠️ LightGBM failed on day {future_day}: {e}")

            # --- XGBoost prediction ---
            if xgb_model is not None:
                try:
                    X_xgb = self._prepare_input(feats, xgb_features)
                    dmatrix = xgb.DMatrix(X_xgb, feature_names=xgb_features)
                    xgb_pred = xgb_model.predict(dmatrix)[0]
                except Exception as e:
                    print(f"⚠️ XGBoost failed on day {future_day}: {e}")

            if lgb_pred is None and xgb_pred is None:
                continue

            if lgb_pred is None:
                final_log_pred = xgb_pred
            elif xgb_pred is None:
                final_log_pred = lgb_pred
            else:
                final_log_pred = w_lgb * lgb_pred + w_xgb * xgb_pred

            final_pred = float(np.expm1(final_log_pred))
            elapsed = (perf_counter() - start) * 1000

            results.append({
                "day": future_day,
                "predicted": final_pred,
                "lgb_pred": float(np.expm1(lgb_pred)) if lgb_pred is not None else None,
                "xgb_pred": float(np.expm1(xgb_pred)) if xgb_pred is not None else None,
                "weights": {"lightgbm": w_lgb, "xgboost": w_xgb},
                "elapsed_ms": elapsed
            })

        return results
