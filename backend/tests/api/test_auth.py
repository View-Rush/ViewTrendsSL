import pytest
from fastapi import status
from starlette.responses import Response
from unittest.mock import AsyncMock, patch


def test_register_user(client):
    """Test user registration returns token + user"""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@example.com",
            "full_name": "newuser",
            "password": "newpassword123"
        }
    )

    # Validate status code
    assert response.status_code == status.HTTP_201_CREATED

    # Parse JSON response
    data = response.json()

    # Check for token fields
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    # Check user object fields
    user = data["user"]
    assert user["email"] == "newuser@example.com"
    assert user["full_name"] == "newuser"
    assert "id" in user
    assert user["is_active"] is True


def test_register_duplicate_email(client, test_user):
    """Test registration fails with duplicate email"""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": test_user.email,
            "full_name": "differentuser",
            "password": "password123"
        }
    )

    # Expect a 400 for duplicate email
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Email already registered" in response.json()["detail"]


def test_login_success(client, test_user):
    """Test successful login returns token + user"""
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user.email,
            "password": "testpassword123"
        }
    )

    # Validate response success
    assert response.status_code == status.HTTP_200_OK

    # Parse JSON response
    data = response.json()

    # Token assertions
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    # User assertions (if AuthResponse)
    if "user" in data:
        user = data["user"]
        assert user["email"] == test_user.email
        assert "id" in user


def test_login_wrong_password(client, test_user):
    """Test login fails with incorrect password"""
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user.email,
            "password": "wrongpassword"
        }
    )

    # Expect unauthorized
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_login_nonexistent_user(client):
    """Test login fails with non-existent user"""
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "nonexistent@example.com",
            "password": "password123"
        }
    )

    # Expect unauthorized
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@patch("app.api.v1.auth.oauth.google.authorize_redirect", new_callable=AsyncMock)
def test_google_login_endpoint(mock_auth_redirect, client):
    """Test Google login endpoint returns mocked authorization URL"""

    # Mock redirect response
    mock_response = Response(status_code=302, headers={
        "location": "https://accounts.google.com/o/oauth2/auth?state=mock_state"
    })
    mock_auth_redirect.return_value = mock_response

    # Call endpoint
    response = client.get("/api/v1/auth/google")

    # Validate success
    assert response.status_code == 200

    # Parse response
    data = response.json()

    # Check structure
    assert "authorization_url" in data
    assert "state" in data
    assert "accounts.google.com" in data["authorization_url"]
