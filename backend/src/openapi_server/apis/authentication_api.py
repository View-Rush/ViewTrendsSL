# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.authentication_api_base import BaseAuthenticationApi
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
from openapi_server.models.auth_forgot_password_post200_response import AuthForgotPasswordPost200Response
from openapi_server.models.auth_forgot_password_post_request import AuthForgotPasswordPostRequest
from openapi_server.models.auth_google_post_request import AuthGooglePostRequest
from openapi_server.models.auth_login_post200_response import AuthLoginPost200Response
from openapi_server.models.auth_login_post_request import AuthLoginPostRequest
from openapi_server.models.auth_logout_post200_response import AuthLogoutPost200Response
from openapi_server.models.auth_refresh_post200_response import AuthRefreshPost200Response
from openapi_server.models.auth_refresh_post_request import AuthRefreshPostRequest
from openapi_server.models.auth_register_post201_response import AuthRegisterPost201Response
from openapi_server.models.auth_register_post_request import AuthRegisterPostRequest
from openapi_server.models.auth_reset_password_post200_response import AuthResetPasswordPost200Response
from openapi_server.models.auth_reset_password_post_request import AuthResetPasswordPostRequest
from openapi_server.models.inline_object import InlineObject
from openapi_server.models.inline_object1 import InlineObject1
from openapi_server.models.inline_object4 import InlineObject4
from openapi_server.models.inline_object5 import InlineObject5
from openapi_server.security_api import get_token_BearerAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.post(
    "/auth/forgot-password",
    responses={
        200: {"model": AuthForgotPasswordPost200Response, "description": "Password reset email sent"},
    },
    tags=["Authentication"],
    summary="Request password reset",
    response_model_by_alias=True,
)
async def auth_forgot_password_post(
    auth_forgot_password_post_request: AuthForgotPasswordPostRequest = Body(None, description=""),
) -> AuthForgotPasswordPost200Response:
    """Send password reset email to user"""
    if not BaseAuthenticationApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAuthenticationApi.subclasses[0]().auth_forgot_password_post(auth_forgot_password_post_request)


@router.post(
    "/auth/google",
    responses={
        200: {"model": AuthLoginPost200Response, "description": "Authentication successful"},
        400: {"model": InlineObject, "description": "Bad request - validation error"},
    },
    tags=["Authentication"],
    summary="Google OAuth authentication",
    response_model_by_alias=True,
)
async def auth_google_post(
    auth_google_post_request: AuthGooglePostRequest = Body(None, description=""),
) -> AuthLoginPost200Response:
    """Authenticate or register user using Google OAuth token"""
    if not BaseAuthenticationApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAuthenticationApi.subclasses[0]().auth_google_post(auth_google_post_request)


@router.post(
    "/auth/login",
    responses={
        200: {"model": AuthLoginPost200Response, "description": "Login successful"},
        401: {"model": InlineObject1, "description": "Unauthorized - invalid or missing authentication"},
        429: {"model": InlineObject5, "description": "Rate limit exceeded"},
    },
    tags=["Authentication"],
    summary="Login user",
    response_model_by_alias=True,
)
async def auth_login_post(
    auth_login_post_request: AuthLoginPostRequest = Body(None, description=""),
) -> AuthLoginPost200Response:
    """Authenticate user with email and password"""
    if not BaseAuthenticationApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAuthenticationApi.subclasses[0]().auth_login_post(auth_login_post_request)


@router.post(
    "/auth/logout",
    responses={
        200: {"model": AuthLogoutPost200Response, "description": "Logout successful"},
    },
    tags=["Authentication"],
    summary="Logout user",
    response_model_by_alias=True,
)
async def auth_logout_post(
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> AuthLogoutPost200Response:
    """Invalidate current access token and refresh token"""
    if not BaseAuthenticationApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAuthenticationApi.subclasses[0]().auth_logout_post()


@router.post(
    "/auth/refresh",
    responses={
        200: {"model": AuthRefreshPost200Response, "description": "Token refreshed successfully"},
        401: {"model": InlineObject1, "description": "Unauthorized - invalid or missing authentication"},
    },
    tags=["Authentication"],
    summary="Refresh access token",
    response_model_by_alias=True,
)
async def auth_refresh_post(
    auth_refresh_post_request: AuthRefreshPostRequest = Body(None, description=""),
) -> AuthRefreshPost200Response:
    """Get new access token using refresh token"""
    if not BaseAuthenticationApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAuthenticationApi.subclasses[0]().auth_refresh_post(auth_refresh_post_request)


@router.post(
    "/auth/register",
    responses={
        201: {"model": AuthRegisterPost201Response, "description": "User registered successfully"},
        400: {"model": InlineObject, "description": "Bad request - validation error"},
        409: {"model": InlineObject4, "description": "Conflict - resource already exists"},
    },
    tags=["Authentication"],
    summary="Register a new user",
    response_model_by_alias=True,
)
async def auth_register_post(
    auth_register_post_request: AuthRegisterPostRequest = Body(None, description=""),
) -> AuthRegisterPost201Response:
    """Create a new user account with email and password"""
    if not BaseAuthenticationApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAuthenticationApi.subclasses[0]().auth_register_post(auth_register_post_request)


@router.post(
    "/auth/reset-password",
    responses={
        200: {"model": AuthResetPasswordPost200Response, "description": "Password reset successful"},
        400: {"model": InlineObject, "description": "Bad request - validation error"},
    },
    tags=["Authentication"],
    summary="Reset password",
    response_model_by_alias=True,
)
async def auth_reset_password_post(
    auth_reset_password_post_request: AuthResetPasswordPostRequest = Body(None, description=""),
) -> AuthResetPasswordPost200Response:
    """Reset user password using reset token"""
    if not BaseAuthenticationApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAuthenticationApi.subclasses[0]().auth_reset_password_post(auth_reset_password_post_request)
