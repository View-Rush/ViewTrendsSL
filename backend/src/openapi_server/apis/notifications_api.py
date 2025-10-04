# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.notifications_api_base import BaseNotificationsApi
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
from pydantic import Field, StrictStr, field_validator
from typing import Optional
from typing_extensions import Annotated
from openapi_server.models.notifications_get200_response import NotificationsGet200Response
from openapi_server.models.notifications_mark_all_read_patch200_response import NotificationsMarkAllReadPatch200Response
from openapi_server.models.predictions_drafts_id_delete200_response import PredictionsDraftsIdDelete200Response
from openapi_server.security_api import get_token_BearerAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.get(
    "/notifications",
    responses={
        200: {"model": NotificationsGet200Response, "description": "Notifications retrieved successfully"},
    },
    tags=["Notifications"],
    summary="Get notifications",
    response_model_by_alias=True,
)
async def notifications_get(
    page: Optional[Annotated[int, Field(strict=True, ge=1)]] = Query(1, description="", alias="page", ge=1),
    limit: Optional[Annotated[int, Field(le=50, strict=True, ge=1)]] = Query(20, description="", alias="limit", ge=1, le=50),
    status: Optional[StrictStr] = Query(all, description="", alias="status"),
    type: Optional[StrictStr] = Query(None, description="", alias="type"),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> NotificationsGet200Response:
    """Retrieve user&#39;s notifications"""
    if not BaseNotificationsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseNotificationsApi.subclasses[0]().notifications_get(page, limit, status, type)


@router.delete(
    "/notifications/{id}",
    responses={
        200: {"model": PredictionsDraftsIdDelete200Response, "description": "Notification deleted successfully"},
    },
    tags=["Notifications"],
    summary="Delete notification",
    response_model_by_alias=True,
)
async def notifications_id_delete(
    id: StrictStr = Path(..., description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PredictionsDraftsIdDelete200Response:
    """Delete a specific notification"""
    if not BaseNotificationsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseNotificationsApi.subclasses[0]().notifications_id_delete(id)


@router.patch(
    "/notifications/{id}/mark-read",
    responses={
        200: {"model": PredictionsDraftsIdDelete200Response, "description": "Notification marked as read"},
    },
    tags=["Notifications"],
    summary="Mark notification as read",
    response_model_by_alias=True,
)
async def notifications_id_mark_read_patch(
    id: StrictStr = Path(..., description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PredictionsDraftsIdDelete200Response:
    """Mark a specific notification as read"""
    if not BaseNotificationsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseNotificationsApi.subclasses[0]().notifications_id_mark_read_patch(id)


@router.patch(
    "/notifications/mark-all-read",
    responses={
        200: {"model": NotificationsMarkAllReadPatch200Response, "description": "All notifications marked as read"},
    },
    tags=["Notifications"],
    summary="Mark all notifications as read",
    response_model_by_alias=True,
)
async def notifications_mark_all_read_patch(
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> NotificationsMarkAllReadPatch200Response:
    """Mark all user&#39;s notifications as read"""
    if not BaseNotificationsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseNotificationsApi.subclasses[0]().notifications_mark_all_read_patch()
