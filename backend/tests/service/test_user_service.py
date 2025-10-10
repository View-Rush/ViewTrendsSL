import pytest
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import verify_password
from app.core.exceptions import UserAlreadyExistsException, UserNotFoundException, InvalidCredentialsException
from app.services.user_service import UserService


@pytest.fixture
def user_service(db):
    """Provide a UserService instance"""
    return UserService(db)


@pytest.fixture
def test_user(user_service, db):
    """Create a test user"""
    user_data = UserCreate(
        email="test@example.com",
        username="testuser",
        password="password123"
    )
    user = user_service.create_user(user_data)
    return user


@pytest.fixture
def another_user(user_service, db):
    """Create another user for duplicate tests"""
    user_data = UserCreate(
        email="another@example.com",
        username="anotheruser",
        password="password123"
    )
    user = user_service.create_user(user_data)
    return user


def test_get_user_by_id(user_service, test_user):
    """Test retrieving a user by ID"""
    user = user_service.get_user_by_id(test_user.id)
    assert user.id == test_user.id
    assert user.email == test_user.email
    assert user.username == test_user.username


def test_get_user_by_id_not_found(user_service):
    """Test get_user_by_id raises exception if user not found"""
    with pytest.raises(UserNotFoundException):
        user_service.get_user_by_id(9999)


def test_update_username(user_service, test_user):
    """Test updating username"""
    update_data = UserUpdate(username="updateduser")
    updated_user = user_service.update_user(test_user.id, update_data)
    assert updated_user.username == "updateduser"


def test_update_email(user_service, test_user):
    """Test updating email"""
    update_data = UserUpdate(email="newemail@example.com")
    updated_user = user_service.update_user(test_user.id, update_data)
    assert updated_user.email == "newemail@example.com"


def test_update_duplicate_username(user_service, test_user, another_user):
    """Test updating to a duplicate username raises exception"""
    update_data = UserUpdate(username=another_user.username)
    with pytest.raises(UserAlreadyExistsException):
        user_service.update_user(test_user.id, update_data)


def test_update_duplicate_email(user_service, test_user, another_user):
    """Test updating to a duplicate email raises exception"""
    update_data = UserUpdate(email=another_user.email)
    with pytest.raises(UserAlreadyExistsException):
        user_service.update_user(test_user.id, update_data)


def test_authenticate_user_success(user_service, test_user):
    """Test successful authentication"""
    user = user_service.authenticate_user("test@example.com", "password123")
    assert user.id == test_user.id


def test_authenticate_user_invalid_email(user_service):
    """Test authentication fails with invalid email"""
    with pytest.raises(InvalidCredentialsException):
        user_service.authenticate_user("nonexistent@example.com", "password123")


def test_authenticate_user_wrong_password(user_service, test_user):
    """Test authentication fails with wrong password"""
    with pytest.raises(InvalidCredentialsException):
        user_service.authenticate_user("test@example.com", "wrongpassword")


def test_create_or_update_google_user_new(user_service, db):
    """Test creating a new Google user"""
    google_id = "google123"
    email = "google@example.com"
    username = "googleuser"
    access_token = "token123"

    user = user_service.create_or_update_google_user(
        google_id=google_id,
        email=email,
        username=username,
        access_token=access_token,
        token_expiry=datetime.utcnow() + timedelta(hours=1)
    )

    assert user.google_id == google_id
    assert user.email == email
    assert user.google_access_token == access_token
    assert user.username.startswith("googleuser")


def test_create_or_update_google_user_existing(user_service, test_user):
    """Test linking Google account to existing user"""
    google_id = "google123"
    access_token = "token123"
    user = user_service.create_or_update_google_user(
        google_id=google_id,
        email=test_user.email,
        username=test_user.username,
        access_token=access_token,
        token_expiry=datetime.utcnow() + timedelta(hours=1)
    )
    assert user.google_id == google_id
    assert user.google_access_token == access_token
    assert user.id == test_user.id
