# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.users_api_base import BaseUsersApi
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
from openapi_server.models.inline_object import InlineObject
from openapi_server.models.inline_object1 import InlineObject1
from openapi_server.models.notification_settings import NotificationSettings
from openapi_server.models.users_me_get200_response import UsersMeGet200Response
from openapi_server.models.users_me_notifications_settings_get200_response import UsersMeNotificationsSettingsGet200Response
from openapi_server.models.users_me_password_put200_response import UsersMePasswordPut200Response
from openapi_server.models.users_me_password_put_request import UsersMePasswordPutRequest
from openapi_server.models.users_me_patch_request import UsersMePatchRequest
from openapi_server.models.users_me_stats_get200_response import UsersMeStatsGet200Response
from openapi_server.security_api import get_token_BearerAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.get(
    "/users/me",
    responses={
        200: {"model": UsersMeGet200Response, "description": "User profile retrieved successfully"},
        401: {"model": InlineObject1, "description": "Unauthorized - invalid or missing authentication"},
    },
    tags=["Users"],
    summary="Get current user profile",
    response_model_by_alias=True,
)
async def users_me_get(
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> UsersMeGet200Response:
    """Retrieve authenticated user&#39;s profile information"""
    if not BaseUsersApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseUsersApi.subclasses[0]().users_me_get()


@router.get(
    "/users/me/notifications/settings",
    responses={
        200: {"model": UsersMeNotificationsSettingsGet200Response, "description": "Notification settings retrieved"},
    },
    tags=["Users"],
    summary="Get notification settings",
    response_model_by_alias=True,
)
async def users_me_notifications_settings_get(
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> UsersMeNotificationsSettingsGet200Response:
    """Retrieve user&#39;s notification preferences"""
    if not BaseUsersApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseUsersApi.subclasses[0]().users_me_notifications_settings_get()


@router.put(
    "/users/me/notifications/settings",
    responses={
        200: {"model": UsersMeNotificationsSettingsGet200Response, "description": "Settings updated successfully"},
    },
    tags=["Users"],
    summary="Update notification settings",
    response_model_by_alias=True,
)
async def users_me_notifications_settings_put(
    notification_settings: NotificationSettings = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> UsersMeNotificationsSettingsGet200Response:
    """Update user&#39;s notification preferences"""
    if not BaseUsersApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseUsersApi.subclasses[0]().users_me_notifications_settings_put(notification_settings)


@router.put(
    "/users/me/password",
    responses={
        200: {"model": UsersMePasswordPut200Response, "description": "Password changed successfully"},
        400: {"model": InlineObject, "description": "Bad request - validation error"},
        401: {"model": InlineObject1, "description": "Unauthorized - invalid or missing authentication"},
    },
    tags=["Users"],
    summary="Change password",
    response_model_by_alias=True,
)
async def users_me_password_put(
    users_me_password_put_request: UsersMePasswordPutRequest = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> UsersMePasswordPut200Response:
    """Change authenticated user&#39;s password"""
    if not BaseUsersApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseUsersApi.subclasses[0]().users_me_password_put(users_me_password_put_request)


@router.patch(
    "/users/me",
    responses={
        200: {"model": UsersMeGet200Response, "description": "Profile updated successfully"},
        400: {"model": InlineObject, "description": "Bad request - validation error"},
    },
    tags=["Users"],
    summary="Update user profile",
    response_model_by_alias=True,
)
async def users_me_patch(
    users_me_patch_request: UsersMePatchRequest = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> UsersMeGet200Response:
    """Update authenticated user&#39;s profile information"""
    if not BaseUsersApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseUsersApi.subclasses[0]().users_me_patch(users_me_patch_request)


@router.get(
    "/users/me/stats",
    responses={
        200: {"model": UsersMeStatsGet200Response, "description": "Statistics retrieved successfully"},
    },
    tags=["Users"],
    summary="Get user statistics",
    response_model_by_alias=True,
)
async def users_me_stats_get(
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> UsersMeStatsGet200Response:
    """Retrieve user&#39;s overall statistics and metrics"""
    if not BaseUsersApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseUsersApi.subclasses[0]().users_me_stats_get()
