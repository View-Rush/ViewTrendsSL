# coding: utf-8

from fastapi.testclient import TestClient


from pydantic import StrictStr, field_validator  # noqa: F401
from typing import Optional  # noqa: F401
from openapi_server.models.analytics_accuracy_over_time_get200_response import AnalyticsAccuracyOverTimeGet200Response  # noqa: F401
from openapi_server.models.analytics_category_performance_get200_response import AnalyticsCategoryPerformanceGet200Response  # noqa: F401
from openapi_server.models.analytics_dashboard_get200_response import AnalyticsDashboardGet200Response  # noqa: F401
from openapi_server.models.analytics_factor_importance_get200_response import AnalyticsFactorImportanceGet200Response  # noqa: F401
from openapi_server.models.analytics_insights_get200_response import AnalyticsInsightsGet200Response  # noqa: F401
from openapi_server.models.analytics_predicted_vs_actual_get200_response import AnalyticsPredictedVsActualGet200Response  # noqa: F401
from openapi_server.models.analytics_upload_time_heatmap_get200_response import AnalyticsUploadTimeHeatmapGet200Response  # noqa: F401


def test_analytics_accuracy_over_time_get(client: TestClient):
    """Test case for analytics_accuracy_over_time_get

    Get accuracy over time
    """
    params = [("period", "30d"), ("group_by", "day")]
    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/analytics/accuracy-over-time",
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_analytics_category_performance_get(client: TestClient):
    """Test case for analytics_category_performance_get

    Get category performance
    """
    params = [("period", "30d")]
    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/analytics/category-performance",
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_analytics_dashboard_get(client: TestClient):
    """Test case for analytics_dashboard_get

    Get dashboard analytics
    """
    params = [("period", "30d")]
    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/analytics/dashboard",
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_analytics_factor_importance_get(client: TestClient):
    """Test case for analytics_factor_importance_get

    Get factor importance
    """
    params = [("period", "30d")]
    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/analytics/factor-importance",
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_analytics_insights_get(client: TestClient):
    """Test case for analytics_insights_get

    Get personalized insights
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/analytics/insights",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_analytics_predicted_vs_actual_get(client: TestClient):
    """Test case for analytics_predicted_vs_actual_get

    Get predicted vs actual comparison
    """
    params = [("period", "30d"),     ("category", 'Gaming')]
    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/analytics/predicted-vs-actual",
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_analytics_upload_time_heatmap_get(client: TestClient):
    """Test case for analytics_upload_time_heatmap_get

    Get upload time heatmap
    """
    params = [("period", "30d"),     ("timezone", 'America/New_York')]
    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/analytics/upload-time-heatmap",
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

