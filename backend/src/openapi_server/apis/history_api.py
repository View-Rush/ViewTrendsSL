# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.history_api_base import BaseHistoryApi
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
from openapi_server.models.history_recent_get200_response import HistoryRecentGet200Response
from openapi_server.security_api import get_token_BearerAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.get(
    "/history/best-predictions",
    responses={
        200: {"model": HistoryRecentGet200Response, "description": "Best predictions retrieved"},
    },
    tags=["History"],
    summary="Get best predictions",
    response_model_by_alias=True,
)
async def history_best_predictions_get(
    limit: Optional[Annotated[int, Field(le=20, strict=True, ge=1)]] = Query(10, description="", alias="limit", ge=1, le=20),
    period: Optional[StrictStr] = Query(all, description="", alias="period"),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> HistoryRecentGet200Response:
    """Retrieve predictions with highest accuracy"""
    if not BaseHistoryApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseHistoryApi.subclasses[0]().history_best_predictions_get(limit, period)


@router.get(
    "/history/recent",
    responses={
        200: {"model": HistoryRecentGet200Response, "description": "Recent predictions retrieved"},
    },
    tags=["History"],
    summary="Get recent predictions",
    response_model_by_alias=True,
)
async def history_recent_get(
    limit: Optional[Annotated[int, Field(le=20, strict=True, ge=1)]] = Query(10, description="", alias="limit", ge=1, le=20),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> HistoryRecentGet200Response:
    """Retrieve most recent predictions for quick access"""
    if not BaseHistoryApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseHistoryApi.subclasses[0]().history_recent_get(limit)
