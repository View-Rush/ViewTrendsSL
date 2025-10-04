# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.analytics_api_base import BaseAnalyticsApi
import openapi_server.impl

from fastapi import (  # noqa: F401
    APIRouter,
    Body,
    Cookie,
    Depends,
    Form,
    Header,
    HTTPException,
    Path,
    Query,
    Response,
    Security,
    status,
)

from openapi_server.models.extra_models import TokenModel  # noqa: F401
from pydantic import StrictStr, field_validator
from typing import Optional
from openapi_server.models.analytics_accuracy_over_time_get200_response import AnalyticsAccuracyOverTimeGet200Response
from openapi_server.models.analytics_category_performance_get200_response import AnalyticsCategoryPerformanceGet200Response
from openapi_server.models.analytics_dashboard_get200_response import AnalyticsDashboardGet200Response
from openapi_server.models.analytics_factor_importance_get200_response import AnalyticsFactorImportanceGet200Response
from openapi_server.models.analytics_insights_get200_response import AnalyticsInsightsGet200Response
from openapi_server.models.analytics_predicted_vs_actual_get200_response import AnalyticsPredictedVsActualGet200Response
from openapi_server.models.analytics_upload_time_heatmap_get200_response import AnalyticsUploadTimeHeatmapGet200Response
from openapi_server.security_api import get_token_BearerAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.get(
    "/analytics/accuracy-over-time",
    responses={
        200: {"model": AnalyticsAccuracyOverTimeGet200Response, "description": "Accuracy data retrieved"},
    },
    tags=["Analytics"],
    summary="Get accuracy over time",
    response_model_by_alias=True,
)
async def analytics_accuracy_over_time_get(
    period: Optional[StrictStr] = Query("30d", description="", alias="period"),
    group_by: Optional[StrictStr] = Query("day", description="", alias="groupBy"),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> AnalyticsAccuracyOverTimeGet200Response:
    """Retrieve prediction accuracy trends over time"""
    if not BaseAnalyticsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAnalyticsApi.subclasses[0]().analytics_accuracy_over_time_get(period, group_by)


@router.get(
    "/analytics/category-performance",
    responses={
        200: {"model": AnalyticsCategoryPerformanceGet200Response, "description": "Category performance retrieved"},
    },
    tags=["Analytics"],
    summary="Get category performance",
    response_model_by_alias=True,
)
async def analytics_category_performance_get(
    period: Optional[StrictStr] = Query("30d", description="", alias="period"),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> AnalyticsCategoryPerformanceGet200Response:
    """Retrieve performance metrics by video category"""
    if not BaseAnalyticsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAnalyticsApi.subclasses[0]().analytics_category_performance_get(period)


@router.get(
    "/analytics/dashboard",
    responses={
        200: {"model": AnalyticsDashboardGet200Response, "description": "Analytics retrieved successfully"},
    },
    tags=["Analytics"],
    summary="Get dashboard analytics",
    response_model_by_alias=True,
)
async def analytics_dashboard_get(
    period: Optional[StrictStr] = Query("30d", description="", alias="period"),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> AnalyticsDashboardGet200Response:
    """Retrieve comprehensive analytics for dashboard"""
    if not BaseAnalyticsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAnalyticsApi.subclasses[0]().analytics_dashboard_get(period)


@router.get(
    "/analytics/factor-importance",
    responses={
        200: {"model": AnalyticsFactorImportanceGet200Response, "description": "Factor importance retrieved"},
    },
    tags=["Analytics"],
    summary="Get factor importance",
    response_model_by_alias=True,
)
async def analytics_factor_importance_get(
    period: Optional[StrictStr] = Query("30d", description="", alias="period"),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> AnalyticsFactorImportanceGet200Response:
    """Retrieve importance scores for prediction factors"""
    if not BaseAnalyticsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAnalyticsApi.subclasses[0]().analytics_factor_importance_get(period)


@router.get(
    "/analytics/insights",
    responses={
        200: {"model": AnalyticsInsightsGet200Response, "description": "Insights retrieved successfully"},
    },
    tags=["Analytics"],
    summary="Get personalized insights",
    response_model_by_alias=True,
)
async def analytics_insights_get(
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> AnalyticsInsightsGet200Response:
    """Retrieve AI-generated insights and recommendations"""
    if not BaseAnalyticsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAnalyticsApi.subclasses[0]().analytics_insights_get()


@router.get(
    "/analytics/predicted-vs-actual",
    responses={
        200: {"model": AnalyticsPredictedVsActualGet200Response, "description": "Comparison data retrieved"},
    },
    tags=["Analytics"],
    summary="Get predicted vs actual comparison",
    response_model_by_alias=True,
)
async def analytics_predicted_vs_actual_get(
    period: Optional[StrictStr] = Query("30d", description="", alias="period"),
    category: Optional[StrictStr] = Query(None, description="", alias="category"),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> AnalyticsPredictedVsActualGet200Response:
    """Retrieve scatter plot data comparing predicted and actual views"""
    if not BaseAnalyticsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAnalyticsApi.subclasses[0]().analytics_predicted_vs_actual_get(period, category)


@router.get(
    "/analytics/upload-time-heatmap",
    responses={
        200: {"model": AnalyticsUploadTimeHeatmapGet200Response, "description": "Heatmap data retrieved"},
    },
    tags=["Analytics"],
    summary="Get upload time heatmap",
    response_model_by_alias=True,
)
async def analytics_upload_time_heatmap_get(
    period: Optional[StrictStr] = Query("30d", description="", alias="period"),
    timezone: Optional[StrictStr] = Query(None, description="", alias="timezone"),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> AnalyticsUploadTimeHeatmapGet200Response:
    """Retrieve heatmap data for optimal upload times"""
    if not BaseAnalyticsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAnalyticsApi.subclasses[0]().analytics_upload_time_heatmap_get(period, timezone)
