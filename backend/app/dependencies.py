from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
from app.core.security import decode_access_token
from app.core.exceptions import AuthenticationException
from app.services.user_service import UserService
from app.models.user import User
from app.db.session import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"/api/v1/auth/login")


def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token"""
    payload = decode_access_token(token)

    if payload is None:
        raise AuthenticationException()

    email: str = payload.get("sub")
    if email is None:
        raise AuthenticationException()

    user_service = UserService(db)
    user = user_service.get_user_by_email(email)

    if user is None:
        raise AuthenticationException()

    return user


def get_current_active_user(
        current_user: User = Depends(get_current_user)
) -> User:
    """Ensure user is active"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user


def get_current_superuser(
        current_user: User = Depends(get_current_user)
) -> User:
    """Ensure user is a superuser"""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges"
        )
    return current_user
