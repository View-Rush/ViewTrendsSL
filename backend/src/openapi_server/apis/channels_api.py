# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.channels_api_base import BaseChannelsApi
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
from typing import List, Optional
from typing_extensions import Annotated
from openapi_server.models.channel_settings import ChannelSettings
from openapi_server.models.channels_callback_get200_response import ChannelsCallbackGet200Response
from openapi_server.models.channels_connect_post200_response import ChannelsConnectPost200Response
from openapi_server.models.channels_me_analytics_get200_response import ChannelsMeAnalyticsGet200Response
from openapi_server.models.channels_me_delete200_response import ChannelsMeDelete200Response
from openapi_server.models.channels_me_get404_response import ChannelsMeGet404Response
from openapi_server.models.channels_me_settings_get200_response import ChannelsMeSettingsGet200Response
from openapi_server.models.channels_me_sync_post200_response import ChannelsMeSyncPost200Response
from openapi_server.models.channels_me_videos_get200_response import ChannelsMeVideosGet200Response
from openapi_server.models.channels_me_videos_get404_response import ChannelsMeVideosGet404Response
from openapi_server.models.inline_object import InlineObject
from openapi_server.security_api import get_token_BearerAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.get(
    "/channels/callback",
    responses={
        200: {"model": ChannelsCallbackGet200Response, "description": "Channel connected successfully"},
        400: {"model": InlineObject, "description": "Bad request - validation error"},
    },
    tags=["Channels"],
    summary="OAuth callback",
    response_model_by_alias=True,
)
async def channels_callback_get(
    code: StrictStr = Query(None, description="", alias="code"),
    state: StrictStr = Query(None, description="", alias="state"),
) -> ChannelsCallbackGet200Response:
    """Handle OAuth callback from YouTube"""
    if not BaseChannelsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseChannelsApi.subclasses[0]().channels_callback_get(code, state)


@router.post(
    "/channels/connect",
    responses={
        200: {"model": ChannelsConnectPost200Response, "description": "OAuth URL generated"},
    },
    tags=["Channels"],
    summary="Connect YouTube channel",
    response_model_by_alias=True,
)
async def channels_connect_post(
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> ChannelsConnectPost200Response:
    """Initiate YouTube channel connection via OAuth"""
    if not BaseChannelsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseChannelsApi.subclasses[0]().channels_connect_post()


@router.get(
    "/channels/me/analytics",
    responses={
        200: {"model": ChannelsMeAnalyticsGet200Response, "description": "Channel analytics retrieved"},
    },
    tags=["Channels"],
    summary="Get channel analytics",
    response_model_by_alias=True,
)
async def channels_me_analytics_get(
    period: Optional[StrictStr] = Query("30d", description="", alias="period"),
    metrics: Optional[List[StrictStr]] = Query(None, description="", alias="metrics"),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> ChannelsMeAnalyticsGet200Response:
    """Retrieve analytics data from connected YouTube channel"""
    if not BaseChannelsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseChannelsApi.subclasses[0]().channels_me_analytics_get(period, metrics)


@router.delete(
    "/channels/me",
    responses={
        200: {"model": ChannelsMeDelete200Response, "description": "Channel disconnected successfully"},
    },
    tags=["Channels"],
    summary="Disconnect channel",
    response_model_by_alias=True,
)
async def channels_me_delete(
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> ChannelsMeDelete200Response:
    """Disconnect YouTube channel from account"""
    if not BaseChannelsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseChannelsApi.subclasses[0]().channels_me_delete()


@router.get(
    "/channels/me",
    responses={
        200: {"model": ChannelsCallbackGet200Response, "description": "Channel information retrieved"},
        404: {"model": ChannelsMeGet404Response, "description": "No channel connected"},
    },
    tags=["Channels"],
    summary="Get connected channel",
    response_model_by_alias=True,
)
async def channels_me_get(
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> ChannelsCallbackGet200Response:
    """Retrieve connected YouTube channel information"""
    if not BaseChannelsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseChannelsApi.subclasses[0]().channels_me_get()


@router.get(
    "/channels/me/settings",
    responses={
        200: {"model": ChannelsMeSettingsGet200Response, "description": "Settings retrieved successfully"},
    },
    tags=["Channels"],
    summary="Get channel settings",
    response_model_by_alias=True,
)
async def channels_me_settings_get(
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> ChannelsMeSettingsGet200Response:
    """Retrieve channel-specific settings"""
    if not BaseChannelsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseChannelsApi.subclasses[0]().channels_me_settings_get()


@router.put(
    "/channels/me/settings",
    responses={
        200: {"model": ChannelsMeSettingsGet200Response, "description": "Settings updated successfully"},
    },
    tags=["Channels"],
    summary="Update channel settings",
    response_model_by_alias=True,
)
async def channels_me_settings_put(
    channel_settings: ChannelSettings = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> ChannelsMeSettingsGet200Response:
    """Update channel-specific settings"""
    if not BaseChannelsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseChannelsApi.subclasses[0]().channels_me_settings_put(channel_settings)


@router.post(
    "/channels/me/sync",
    responses={
        200: {"model": ChannelsMeSyncPost200Response, "description": "Sync initiated successfully"},
    },
    tags=["Channels"],
    summary="Sync channel data",
    response_model_by_alias=True,
)
async def channels_me_sync_post(
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> ChannelsMeSyncPost200Response:
    """Manually trigger channel data synchronization"""
    if not BaseChannelsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseChannelsApi.subclasses[0]().channels_me_sync_post()


@router.get(
    "/channels/me/videos",
    responses={
        200: {"model": ChannelsMeVideosGet200Response, "description": "Videos retrieved successfully"},
        404: {"model": ChannelsMeVideosGet404Response, "description": "No channel connected"},
    },
    tags=["Channels"],
    summary="Get channel videos",
    response_model_by_alias=True,
)
async def channels_me_videos_get(
    page: Optional[Annotated[int, Field(strict=True, ge=1)]] = Query(1, description="", alias="page", ge=1),
    limit: Optional[Annotated[int, Field(le=50, strict=True, ge=1)]] = Query(20, description="", alias="limit", ge=1, le=50),
    sort_by: Optional[StrictStr] = Query("publishedAt", description="", alias="sortBy"),
    order: Optional[StrictStr] = Query("desc", description="", alias="order"),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> ChannelsMeVideosGet200Response:
    """Retrieve videos from connected YouTube channel"""
    if not BaseChannelsApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseChannelsApi.subclasses[0]().channels_me_videos_get(page, limit, sort_by, order)
