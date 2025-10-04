# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

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

class BaseAnalyticsApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseAnalyticsApi.subclasses = BaseAnalyticsApi.subclasses + (cls,)
    async def analytics_accuracy_over_time_get(
        self,
        period: Optional[StrictStr],
        group_by: Optional[StrictStr],
    ) -> AnalyticsAccuracyOverTimeGet200Response:
        """Retrieve prediction accuracy trends over time"""
        ...


    async def analytics_category_performance_get(
        self,
        period: Optional[StrictStr],
    ) -> AnalyticsCategoryPerformanceGet200Response:
        """Retrieve performance metrics by video category"""
        ...


    async def analytics_dashboard_get(
        self,
        period: Optional[StrictStr],
    ) -> AnalyticsDashboardGet200Response:
        """Retrieve comprehensive analytics for dashboard"""
        ...


    async def analytics_factor_importance_get(
        self,
        period: Optional[StrictStr],
    ) -> AnalyticsFactorImportanceGet200Response:
        """Retrieve importance scores for prediction factors"""
        ...


    async def analytics_insights_get(
        self,
    ) -> AnalyticsInsightsGet200Response:
        """Retrieve AI-generated insights and recommendations"""
        ...


    async def analytics_predicted_vs_actual_get(
        self,
        period: Optional[StrictStr],
        category: Optional[StrictStr],
    ) -> AnalyticsPredictedVsActualGet200Response:
        """Retrieve scatter plot data comparing predicted and actual views"""
        ...


    async def analytics_upload_time_heatmap_get(
        self,
        period: Optional[StrictStr],
        timezone: Optional[StrictStr],
    ) -> AnalyticsUploadTimeHeatmapGet200Response:
        """Retrieve heatmap data for optimal upload times"""
        ...
