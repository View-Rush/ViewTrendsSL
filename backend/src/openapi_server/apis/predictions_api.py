# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.predictions_api_base import BasePredictionsApi
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
from datetime import date
from pydantic import Field, StrictBytes, StrictStr, field_validator
from typing import Optional, Tuple, Union
from typing_extensions import Annotated
from openapi_server.models.categories_get200_response import CategoriesGet200Response
from openapi_server.models.inline_object import InlineObject
from openapi_server.models.inline_object3 import InlineObject3
from openapi_server.models.inline_object5 import InlineObject5
from openapi_server.models.languages_get200_response import LanguagesGet200Response
from openapi_server.models.prediction_request import PredictionRequest
from openapi_server.models.predictions_bulk_delete_delete200_response import PredictionsBulkDeleteDelete200Response
from openapi_server.models.predictions_bulk_delete_delete_request import PredictionsBulkDeleteDeleteRequest
from openapi_server.models.predictions_drafts_get200_response import PredictionsDraftsGet200Response
from openapi_server.models.predictions_drafts_id_delete200_response import PredictionsDraftsIdDelete200Response
from openapi_server.models.predictions_drafts_post201_response import PredictionsDraftsPost201Response
from openapi_server.models.predictions_drafts_post_request import PredictionsDraftsPostRequest
from openapi_server.models.predictions_get200_response import PredictionsGet200Response
from openapi_server.models.predictions_id_delete200_response import PredictionsIdDelete200Response
from openapi_server.models.predictions_id_get200_response import PredictionsIdGet200Response
from openapi_server.models.predictions_id_patch_request import PredictionsIdPatchRequest
from openapi_server.models.predictions_id_repredict_post_request import PredictionsIdRepredictPostRequest
from openapi_server.models.predictions_post201_response import PredictionsPost201Response
from openapi_server.models.predictions_post402_response import PredictionsPost402Response
from openapi_server.security_api import get_token_BearerAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.get(
    "/categories",
    responses={
        200: {"model": CategoriesGet200Response, "description": "Categories retrieved successfully"},
    },
    tags=["Predictions"],
    summary="Get video categories",
    response_model_by_alias=True,
)
async def categories_get(
) -> CategoriesGet200Response:
    """Retrieve list of available video categories"""
    if not BasePredictionsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePredictionsApi.subclasses[0]().categories_get()


@router.get(
    "/languages",
    responses={
        200: {"model": LanguagesGet200Response, "description": "Languages retrieved successfully"},
    },
    tags=["Predictions"],
    summary="Get supported languages",
    response_model_by_alias=True,
)
async def languages_get(
) -> LanguagesGet200Response:
    """Retrieve list of supported video languages"""
    if not BasePredictionsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePredictionsApi.subclasses[0]().languages_get()


@router.delete(
    "/predictions/bulk-delete",
    responses={
        200: {"model": PredictionsBulkDeleteDelete200Response, "description": "Predictions deleted successfully"},
    },
    tags=["Predictions"],
    summary="Delete multiple predictions",
    response_model_by_alias=True,
)
async def predictions_bulk_delete_delete(
    predictions_bulk_delete_delete_request: PredictionsBulkDeleteDeleteRequest = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PredictionsBulkDeleteDelete200Response:
    """Delete multiple predictions at once"""
    if not BasePredictionsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePredictionsApi.subclasses[0]().predictions_bulk_delete_delete(predictions_bulk_delete_delete_request)


@router.get(
    "/predictions/drafts",
    responses={
        200: {"model": PredictionsDraftsGet200Response, "description": "Drafts retrieved successfully"},
    },
    tags=["Predictions"],
    summary="List saved drafts",
    response_model_by_alias=True,
)
async def predictions_drafts_get(
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PredictionsDraftsGet200Response:
    """Retrieve user&#39;s saved prediction drafts"""
    if not BasePredictionsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePredictionsApi.subclasses[0]().predictions_drafts_get()


@router.delete(
    "/predictions/drafts/{id}",
    responses={
        200: {"model": PredictionsDraftsIdDelete200Response, "description": "Draft deleted successfully"},
    },
    tags=["Predictions"],
    summary="Delete draft",
    response_model_by_alias=True,
)
async def predictions_drafts_id_delete(
    id: StrictStr = Path(..., description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PredictionsDraftsIdDelete200Response:
    """Delete a saved prediction draft"""
    if not BasePredictionsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePredictionsApi.subclasses[0]().predictions_drafts_id_delete(id)


@router.post(
    "/predictions/drafts",
    responses={
        201: {"model": PredictionsDraftsPost201Response, "description": "Draft saved successfully"},
    },
    tags=["Predictions"],
    summary="Save prediction draft",
    response_model_by_alias=True,
)
async def predictions_drafts_post(
    predictions_drafts_post_request: PredictionsDraftsPostRequest = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PredictionsDraftsPost201Response:
    """Save prediction form data as draft"""
    if not BasePredictionsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePredictionsApi.subclasses[0]().predictions_drafts_post(predictions_drafts_post_request)


@router.get(
    "/predictions/export",
    summary="Export predictions",
    tags=["Predictions"],
    response_model=None,  # <-- important
)
async def predictions_export_get(
        format: Optional[str] = Query("csv", alias="format"),
        date_from: Optional[date] = Query(None, alias="dateFrom"),
        date_to: Optional[date] = Query(None, alias="dateTo"),
        token_BearerAuth: TokenModel = Security(get_token_BearerAuth),
) -> Response:
    """Export user's predictions as CSV"""
    if not BasePredictionsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")

    csv_data: str = await BasePredictionsApi.subclasses[0]().predictions_export_get(format, date_from, date_to)

    return Response(content=csv_data, media_type="text/csv")


@router.get(
    "/predictions",
    responses={
        200: {"model": PredictionsGet200Response, "description": "Predictions retrieved successfully"},
    },
    tags=["Predictions"],
    summary="List user predictions",
    response_model_by_alias=True,
)
async def predictions_get(
    page: Optional[Annotated[int, Field(strict=True, ge=1)]] = Query(1, description="", alias="page", ge=1),
    limit: Optional[Annotated[int, Field(le=100, strict=True, ge=1)]] = Query(20, description="", alias="limit", ge=1, le=100),
    sort_by: Optional[StrictStr] = Query("createdAt", description="", alias="sortBy"),
    order: Optional[StrictStr] = Query("desc", description="", alias="order"),
    category: Optional[StrictStr] = Query(None, description="", alias="category"),
    status: Optional[StrictStr] = Query(None, description="", alias="status"),
    date_from: Optional[date] = Query(None, description="", alias="dateFrom"),
    date_to: Optional[date] = Query(None, description="", alias="dateTo"),
    search: Annotated[Optional[StrictStr], Field(description="Search in video titles")] = Query(None, description="Search in video titles", alias="search"),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PredictionsGet200Response:
    """Retrieve paginated list of user&#39;s predictions"""
    if not BasePredictionsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePredictionsApi.subclasses[0]().predictions_get(page, limit, sort_by, order, category, status, date_from, date_to, search)


@router.delete(
    "/predictions/{id}",
    responses={
        200: {"model": PredictionsIdDelete200Response, "description": "Prediction deleted successfully"},
        404: {"model": InlineObject3, "description": "Resource not found"},
    },
    tags=["Predictions"],
    summary="Delete prediction",
    response_model_by_alias=True,
)
async def predictions_id_delete(
    id: StrictStr = Path(..., description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PredictionsIdDelete200Response:
    """Delete a specific prediction from history"""
    if not BasePredictionsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePredictionsApi.subclasses[0]().predictions_id_delete(id)


@router.get(
    "/predictions/{id}",
    responses={
        200: {"model": PredictionsIdGet200Response, "description": "Prediction retrieved successfully"},
        404: {"model": InlineObject3, "description": "Resource not found"},
    },
    tags=["Predictions"],
    summary="Get prediction details",
    response_model_by_alias=True,
)
async def predictions_id_get(
    id: StrictStr = Path(..., description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PredictionsIdGet200Response:
    """Retrieve detailed information about a specific prediction"""
    if not BasePredictionsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePredictionsApi.subclasses[0]().predictions_id_get(id)


@router.patch(
    "/predictions/{id}",
    responses={
        200: {"model": PredictionsIdGet200Response, "description": "Prediction updated successfully"},
    },
    tags=["Predictions"],
    summary="Update prediction",
    response_model_by_alias=True,
)
async def predictions_id_patch(
    id: StrictStr = Path(..., description=""),
    predictions_id_patch_request: PredictionsIdPatchRequest = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PredictionsIdGet200Response:
    """Update prediction with actual view count for tracking"""
    if not BasePredictionsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePredictionsApi.subclasses[0]().predictions_id_patch(id, predictions_id_patch_request)


@router.post(
    "/predictions/{id}/repredict",
    responses={
        201: {"model": PredictionsPost201Response, "description": "New prediction created"},
    },
    tags=["Predictions"],
    summary="Rerun prediction",
    response_model_by_alias=True,
)
async def predictions_id_repredict_post(
    id: StrictStr = Path(..., description=""),
    predictions_id_repredict_post_request: Optional[PredictionsIdRepredictPostRequest] = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PredictionsPost201Response:
    """Create a new prediction based on previous prediction&#39;s data"""
    if not BasePredictionsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePredictionsApi.subclasses[0]().predictions_id_repredict_post(id, predictions_id_repredict_post_request)


@router.post(
    "/predictions",
    responses={
        201: {"model": PredictionsPost201Response, "description": "Prediction created successfully"},
        400: {"model": InlineObject, "description": "Bad request - validation error"},
        402: {"model": PredictionsPost402Response, "description": "Insufficient credits"},
        429: {"model": InlineObject5, "description": "Rate limit exceeded"},
    },
    tags=["Predictions"],
    summary="Create new prediction",
    response_model_by_alias=True,
)
async def predictions_post(
    prediction_request: PredictionRequest = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PredictionsPost201Response:
    """Submit video metadata to predict view count"""
    if not BasePredictionsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePredictionsApi.subclasses[0]().predictions_post(prediction_request)
