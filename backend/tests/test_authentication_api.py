# coding: utf-8

from fastapi.testclient import TestClient


from openapi_server.models.auth_forgot_password_post200_response import AuthForgotPasswordPost200Response  # noqa: F401
from openapi_server.models.auth_forgot_password_post_request import AuthForgotPasswordPostRequest  # noqa: F401
from openapi_server.models.auth_google_post_request import AuthGooglePostRequest  # noqa: F401
from openapi_server.models.auth_login_post200_response import AuthLoginPost200Response  # noqa: F401
from openapi_server.models.auth_login_post_request import AuthLoginPostRequest  # noqa: F401
from openapi_server.models.auth_logout_post200_response import AuthLogoutPost200Response  # noqa: F401
from openapi_server.models.auth_refresh_post200_response import AuthRefreshPost200Response  # noqa: F401
from openapi_server.models.auth_refresh_post_request import AuthRefreshPostRequest  # noqa: F401
from openapi_server.models.auth_register_post201_response import AuthRegisterPost201Response  # noqa: F401
from openapi_server.models.auth_register_post_request import AuthRegisterPostRequest  # noqa: F401
from openapi_server.models.auth_reset_password_post200_response import AuthResetPasswordPost200Response  # noqa: F401
from openapi_server.models.auth_reset_password_post_request import AuthResetPasswordPostRequest  # noqa: F401
from openapi_server.models.inline_object import InlineObject  # noqa: F401
from openapi_server.models.inline_object1 import InlineObject1  # noqa: F401
from openapi_server.models.inline_object4 import InlineObject4  # noqa: F401
from openapi_server.models.inline_object5 import InlineObject5  # noqa: F401


def test_auth_forgot_password_post(client: TestClient):
    """Test case for auth_forgot_password_post

    Request password reset
    """
    auth_forgot_password_post_request = openapi_server.AuthForgotPasswordPostRequest()

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/auth/forgot-password",
    #    headers=headers,
    #    json=auth_forgot_password_post_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_auth_google_post(client: TestClient):
    """Test case for auth_google_post

    Google OAuth authentication
    """
    auth_google_post_request = openapi_server.AuthGooglePostRequest()

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/auth/google",
    #    headers=headers,
    #    json=auth_google_post_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_auth_login_post(client: TestClient):
    """Test case for auth_login_post

    Login user
    """
    auth_login_post_request = openapi_server.AuthLoginPostRequest()

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/auth/login",
    #    headers=headers,
    #    json=auth_login_post_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_auth_logout_post(client: TestClient):
    """Test case for auth_logout_post

    Logout user
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/auth/logout",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_auth_refresh_post(client: TestClient):
    """Test case for auth_refresh_post

    Refresh access token
    """
    auth_refresh_post_request = openapi_server.AuthRefreshPostRequest()

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/auth/refresh",
    #    headers=headers,
    #    json=auth_refresh_post_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_auth_register_post(client: TestClient):
    """Test case for auth_register_post

    Register a new user
    """
    auth_register_post_request = openapi_server.AuthRegisterPostRequest()

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/auth/register",
    #    headers=headers,
    #    json=auth_register_post_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_auth_reset_password_post(client: TestClient):
    """Test case for auth_reset_password_post

    Reset password
    """
    auth_reset_password_post_request = openapi_server.AuthResetPasswordPostRequest()

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/auth/reset-password",
    #    headers=headers,
    #    json=auth_reset_password_post_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

