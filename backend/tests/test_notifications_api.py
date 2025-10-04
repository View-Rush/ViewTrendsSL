# coding: utf-8

from fastapi.testclient import TestClient


from pydantic import Field, StrictStr, field_validator  # noqa: F401
from typing import Optional  # noqa: F401
from typing_extensions import Annotated  # noqa: F401
from openapi_server.models.notifications_get200_response import NotificationsGet200Response  # noqa: F401
from openapi_server.models.notifications_mark_all_read_patch200_response import NotificationsMarkAllReadPatch200Response  # noqa: F401
from openapi_server.models.predictions_drafts_id_delete200_response import PredictionsDraftsIdDelete200Response  # noqa: F401


def test_notifications_get(client: TestClient):
    """Test case for notifications_get

    Get notifications
    """
    params = [("page", 1),     ("limit", 20),     ("status", all),     ("type", 'type_example')]
    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/notifications",
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_notifications_id_delete(client: TestClient):
    """Test case for notifications_id_delete

    Delete notification
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "DELETE",
    #    "/notifications/{id}".format(id='notif_abc123'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_notifications_id_mark_read_patch(client: TestClient):
    """Test case for notifications_id_mark_read_patch

    Mark notification as read
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "PATCH",
    #    "/notifications/{id}/mark-read".format(id='notif_abc123'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_notifications_mark_all_read_patch(client: TestClient):
    """Test case for notifications_mark_all_read_patch

    Mark all notifications as read
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "PATCH",
    #    "/notifications/mark-all-read",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

