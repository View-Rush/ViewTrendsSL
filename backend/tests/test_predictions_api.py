# coding: utf-8

from fastapi.testclient import TestClient


from datetime import date  # noqa: F401
from pydantic import Field, StrictBytes, StrictStr, field_validator  # noqa: F401
from typing import Optional, Tuple, Union  # noqa: F401
from typing_extensions import Annotated  # noqa: F401
from openapi_server.models.categories_get200_response import CategoriesGet200Response  # noqa: F401
from openapi_server.models.inline_object import InlineObject  # noqa: F401
from openapi_server.models.inline_object3 import InlineObject3  # noqa: F401
from openapi_server.models.inline_object5 import InlineObject5  # noqa: F401
from openapi_server.models.languages_get200_response import LanguagesGet200Response  # noqa: F401
from openapi_server.models.prediction_request import PredictionRequest  # noqa: F401
from openapi_server.models.predictions_bulk_delete_delete200_response import PredictionsBulkDeleteDelete200Response  # noqa: F401
from openapi_server.models.predictions_bulk_delete_delete_request import PredictionsBulkDeleteDeleteRequest  # noqa: F401
from openapi_server.models.predictions_drafts_get200_response import PredictionsDraftsGet200Response  # noqa: F401
from openapi_server.models.predictions_drafts_id_delete200_response import PredictionsDraftsIdDelete200Response  # noqa: F401
from openapi_server.models.predictions_drafts_post201_response import PredictionsDraftsPost201Response  # noqa: F401
from openapi_server.models.predictions_drafts_post_request import PredictionsDraftsPostRequest  # noqa: F401
from openapi_server.models.predictions_get200_response import PredictionsGet200Response  # noqa: F401
from openapi_server.models.predictions_id_delete200_response import PredictionsIdDelete200Response  # noqa: F401
from openapi_server.models.predictions_id_get200_response import PredictionsIdGet200Response  # noqa: F401
from openapi_server.models.predictions_id_patch_request import PredictionsIdPatchRequest  # noqa: F401
from openapi_server.models.predictions_id_repredict_post_request import PredictionsIdRepredictPostRequest  # noqa: F401
from openapi_server.models.predictions_post201_response import PredictionsPost201Response  # noqa: F401
from openapi_server.models.predictions_post402_response import PredictionsPost402Response  # noqa: F401


def test_categories_get(client: TestClient):
    """Test case for categories_get

    Get video categories
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/categories",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_languages_get(client: TestClient):
    """Test case for languages_get

    Get supported languages
    """

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/languages",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_predictions_bulk_delete_delete(client: TestClient):
    """Test case for predictions_bulk_delete_delete

    Delete multiple predictions
    """
    predictions_bulk_delete_delete_request = openapi_server.PredictionsBulkDeleteDeleteRequest()

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "DELETE",
    #    "/predictions/bulk-delete",
    #    headers=headers,
    #    json=predictions_bulk_delete_delete_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_predictions_drafts_get(client: TestClient):
    """Test case for predictions_drafts_get

    List saved drafts
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/predictions/drafts",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_predictions_drafts_id_delete(client: TestClient):
    """Test case for predictions_drafts_id_delete

    Delete draft
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "DELETE",
    #    "/predictions/drafts/{id}".format(id='draft_abc123'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_predictions_drafts_post(client: TestClient):
    """Test case for predictions_drafts_post

    Save prediction draft
    """
    predictions_drafts_post_request = openapi_server.PredictionsDraftsPostRequest()

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/predictions/drafts",
    #    headers=headers,
    #    json=predictions_drafts_post_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_predictions_export_get(client: TestClient):
    """Test case for predictions_export_get

    Export predictions
    """
    params = [("format", csv),     ("date_from", '2025-01-01'),     ("date_to", '2025-12-31')]
    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/predictions/export",
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_predictions_get(client: TestClient):
    """Test case for predictions_get

    List user predictions
    """
    params = [("page", 1),     ("limit", 20),     ("sort_by", createdAt),     ("order", desc),     ("category", 'Gaming'),     ("status", 'completed'),     ("date_from", '2025-01-01'),     ("date_to", '2025-12-31'),     ("search", 'How to code')]
    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/predictions",
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_predictions_id_delete(client: TestClient):
    """Test case for predictions_id_delete

    Delete prediction
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "DELETE",
    #    "/predictions/{id}".format(id='pred_abc123'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_predictions_id_get(client: TestClient):
    """Test case for predictions_id_get

    Get prediction details
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/predictions/{id}".format(id='pred_abc123'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_predictions_id_patch(client: TestClient):
    """Test case for predictions_id_patch

    Update prediction
    """
    predictions_id_patch_request = openapi_server.PredictionsIdPatchRequest()

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "PATCH",
    #    "/predictions/{id}".format(id='pred_abc123'),
    #    headers=headers,
    #    json=predictions_id_patch_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_predictions_id_repredict_post(client: TestClient):
    """Test case for predictions_id_repredict_post

    Rerun prediction
    """
    predictions_id_repredict_post_request = openapi_server.PredictionsIdRepredictPostRequest()

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/predictions/{id}/repredict".format(id='pred_abc123'),
    #    headers=headers,
    #    json=predictions_id_repredict_post_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_predictions_post(client: TestClient):
    """Test case for predictions_post

    Create new prediction
    """
    prediction_request = {"channel_info":{"upload_frequency":"weekly","subscriber_count":50000,"average_views_per_video":10000,"channel_age_months":24},"thumbnail_quality":8,"publish_date_time":"2025-10-10T14:00:00Z","language":"en","video_title":"How to Build a React App in 2025","tags":["react","javascript","tutorial","web development"],"video_duration":720,"is_trending":0,"video_description":"Complete tutorial on building modern React applications","target_audience":"adults","promotional_budget":100.0,"has_custom_thumbnail":1,"is_seasonal":0,"category":"Education","content_type":"tutorial"}

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/predictions",
    #    headers=headers,
    #    json=prediction_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

