# coding: utf-8

from fastapi.testclient import TestClient


from pydantic import Field, StrictStr, field_validator  # noqa: F401
from typing import List, Optional  # noqa: F401
from typing_extensions import Annotated  # noqa: F401
from openapi_server.models.channel_settings import ChannelSettings  # noqa: F401
from openapi_server.models.channels_callback_get200_response import ChannelsCallbackGet200Response  # noqa: F401
from openapi_server.models.channels_connect_post200_response import ChannelsConnectPost200Response  # noqa: F401
from openapi_server.models.channels_me_analytics_get200_response import ChannelsMeAnalyticsGet200Response  # noqa: F401
from openapi_server.models.channels_me_delete200_response import ChannelsMeDelete200Response  # noqa: F401
from openapi_server.models.channels_me_get404_response import ChannelsMeGet404Response  # noqa: F401
from openapi_server.models.channels_me_settings_get200_response import ChannelsMeSettingsGet200Response  # noqa: F401
from openapi_server.models.channels_me_sync_post200_response import ChannelsMeSyncPost200Response  # noqa: F401
from openapi_server.models.channels_me_videos_get200_response import ChannelsMeVideosGet200Response  # noqa: F401
from openapi_server.models.channels_me_videos_get404_response import ChannelsMeVideosGet404Response  # noqa: F401
from openapi_server.models.inline_object import InlineObject  # noqa: F401


def test_channels_callback_get(client: TestClient):
    """Test case for channels_callback_get

    OAuth callback
    """
    params = [("code", '4/0AY0e-g7...'),     ("state", 'abc123xyz')]
    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/channels/callback",
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_channels_connect_post(client: TestClient):
    """Test case for channels_connect_post

    Connect YouTube channel
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/channels/connect",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_channels_me_analytics_get(client: TestClient):
    """Test case for channels_me_analytics_get

    Get channel analytics
    """
    params = [("period", "30d"),     ("metrics", ['views,subscribers'])]
    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/channels/me/analytics",
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_channels_me_delete(client: TestClient):
    """Test case for channels_me_delete

    Disconnect channel
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "DELETE",
    #    "/channels/me",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_channels_me_get(client: TestClient):
    """Test case for channels_me_get

    Get connected channel
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/channels/me",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_channels_me_settings_get(client: TestClient):
    """Test case for channels_me_settings_get

    Get channel settings
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/channels/me/settings",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_channels_me_settings_put(client: TestClient):
    """Test case for channels_me_settings_put

    Update channel settings
    """
    channel_settings = {"sync_frequency":"daily","auto_create_prediction":0,"auto_tracking":1,"notify_on_new_video":1}

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "PUT",
    #    "/channels/me/settings",
    #    headers=headers,
    #    json=channel_settings,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_channels_me_sync_post(client: TestClient):
    """Test case for channels_me_sync_post

    Sync channel data
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/channels/me/sync",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_channels_me_videos_get(client: TestClient):
    """Test case for channels_me_videos_get

    Get channel videos
    """
    params = [("page", 1),     ("limit", 20),     ("sort_by", "publishedAt"),     ("order", "desc")]
    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/channels/me/videos",
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

