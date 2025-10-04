# coding: utf-8

from fastapi.testclient import TestClient


from openapi_server.models.inline_object import InlineObject  # noqa: F401
from openapi_server.models.inline_object1 import InlineObject1  # noqa: F401
from openapi_server.models.notification_settings import NotificationSettings  # noqa: F401
from openapi_server.models.users_me_get200_response import UsersMeGet200Response  # noqa: F401
from openapi_server.models.users_me_notifications_settings_get200_response import UsersMeNotificationsSettingsGet200Response  # noqa: F401
from openapi_server.models.users_me_password_put200_response import UsersMePasswordPut200Response  # noqa: F401
from openapi_server.models.users_me_password_put_request import UsersMePasswordPutRequest  # noqa: F401
from openapi_server.models.users_me_patch_request import UsersMePatchRequest  # noqa: F401
from openapi_server.models.users_me_stats_get200_response import UsersMeStatsGet200Response  # noqa: F401


def test_users_me_get(client: TestClient):
    """Test case for users_me_get

    Get current user profile
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/users/me",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_users_me_notifications_settings_get(client: TestClient):
    """Test case for users_me_notifications_settings_get

    Get notification settings
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/users/me/notifications/settings",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_users_me_notifications_settings_put(client: TestClient):
    """Test case for users_me_notifications_settings_put

    Update notification settings
    """
    notification_settings = {"in_app":{"prediction_complete":1,"accuracy_milestones":1,"system_announcements":1},"email":{"prediction_complete":1,"accuracy_milestones":1,"marketing":0,"weekly_summary":1,"product_updates":0}}

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "PUT",
    #    "/users/me/notifications/settings",
    #    headers=headers,
    #    json=notification_settings,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_users_me_password_put(client: TestClient):
    """Test case for users_me_password_put

    Change password
    """
    users_me_password_put_request = openapi_server.UsersMePasswordPutRequest()

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "PUT",
    #    "/users/me/password",
    #    headers=headers,
    #    json=users_me_password_put_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_users_me_patch(client: TestClient):
    """Test case for users_me_patch

    Update user profile
    """
    users_me_patch_request = openapi_server.UsersMePatchRequest()

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "PATCH",
    #    "/users/me",
    #    headers=headers,
    #    json=users_me_patch_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_users_me_stats_get(client: TestClient):
    """Test case for users_me_stats_get

    Get user statistics
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/users/me/stats",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

