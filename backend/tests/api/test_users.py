import pytest
from fastapi import status


def test_get_current_user(authenticated_client):
    """Test getting current user info"""
    response = authenticated_client.get("/api/v1/users/me")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "testuser"


def test_get_current_user_unauthorized(client):
    """Test getting current user without authentication"""
    response = client.get("/api/v1/users/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_update_current_user(authenticated_client):
    """Test updating current user"""
    response = authenticated_client.put(
        "/api/v1/users/me",
        json={
            "full_name": "updateduser"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["full_name"] == "updateduser"


def test_update_current_user_email(authenticated_client):
    """Test updating current user email"""
    response = authenticated_client.put(
        "/api/v1/users/me",
        json={
            "email": "newemail@example.com"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "newemail@example.com"


def test_update_user_same_name(authenticated_client, db, test_user):
    """Test updating with the same name"""
    # Create another user
    from app.models.user import User
    from app.core.security import get_password_hash

    another_user = User(
        email="another@example.com",
        full_name="anotheruser",
        hashed_password=get_password_hash("password123"),
        is_active=True
    )
    db.add(another_user)
    db.commit()

    # Try to update to duplicate username
    response = authenticated_client.put(
        "/api/v1/users/me",
        json={
            "full_name": "anotheruser"
        }
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_get_user_by_id_as_admin(client, test_user, test_superuser):
    """Test getting user by ID as superuser"""
    # Login as superuser
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": test_superuser.email,
            "password": "adminpassword123"
        }
    )
    token = response.json()["access_token"]

    # Get user by ID
    response = client.get(
        f"/api/v1/users/{test_user.id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == test_user.id
    assert data["email"] == test_user.email


def test_get_user_by_id_as_regular_user(authenticated_client, test_user):
    """Test getting user by ID as regular user (should fail)"""
    response = authenticated_client.get(f"/api/v1/users/{test_user.id}")
    assert response.status_code == status.HTTP_403_FORBIDDEN