# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

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

class BaseAuthenticationApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseAuthenticationApi.subclasses = BaseAuthenticationApi.subclasses + (cls,)
    async def auth_forgot_password_post(
        self,
        auth_forgot_password_post_request: AuthForgotPasswordPostRequest,
    ) -> AuthForgotPasswordPost200Response:
        """Send password reset email to user"""
        ...


    async def auth_google_post(
        self,
        auth_google_post_request: AuthGooglePostRequest,
    ) -> AuthLoginPost200Response:
        """Authenticate or register user using Google OAuth token"""
        ...


    async def auth_login_post(
        self,
        auth_login_post_request: AuthLoginPostRequest,
    ) -> AuthLoginPost200Response:
        """Authenticate user with email and password"""
        ...


    async def auth_logout_post(
        self,
    ) -> AuthLogoutPost200Response:
        """Invalidate current access token and refresh token"""
        ...


    async def auth_refresh_post(
        self,
        auth_refresh_post_request: AuthRefreshPostRequest,
    ) -> AuthRefreshPost200Response:
        """Get new access token using refresh token"""
        ...


    async def auth_register_post(
        self,
        auth_register_post_request: AuthRegisterPostRequest,
    ) -> AuthRegisterPost201Response:
        """Create a new user account with email and password"""
        ...


    async def auth_reset_password_post(
        self,
        auth_reset_password_post_request: AuthResetPasswordPostRequest,
    ) -> AuthResetPasswordPost200Response:
        """Reset user password using reset token"""
        ...
