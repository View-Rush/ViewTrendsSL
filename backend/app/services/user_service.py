from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.exceptions import (
    UserNotFoundException,
    UserAlreadyExistsException,
    InvalidCredentialsException
)


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_full_name(self, full_name: str) -> Optional[User]:
        """Get user by full name"""
        return self.db.query(User).filter(User.full_name == full_name).first()

    def get_user_by_google_id(self, google_id: str) -> Optional[User]:
        """Get user by Google ID"""
        return self.db.query(User).filter(User.google_id == google_id).first()

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise UserNotFoundException()
        return user

    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user with username/password"""
        # Check if user already exists
        if self.get_user_by_email(user_data.email):
            raise UserAlreadyExistsException(detail="Email already registered")

        # Create user
        db_user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=get_password_hash(user_data.password),
            is_active=True
        )

        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(self, email: str, password: str) -> User:
        """Authenticate user with email and password"""
        user = self.get_user_by_email(email)

        if not user:
            raise InvalidCredentialsException()

        if not user.hashed_password:
            raise InvalidCredentialsException(detail="Please login with Google")

        if not verify_password(password, user.hashed_password):
            raise InvalidCredentialsException()

        if not user.is_active:
            raise InvalidCredentialsException(detail="User account is inactive")

        return user

    def create_or_update_google_user(
        self,
        google_id: str,
        email: str,
        full_name: str,
        access_token: str,
        refresh_token: Optional[str] = None,
        token_expiry: Optional[datetime] = None,
        has_youtube_access: bool = False
    ) -> User:
        """Create or update user from Google OAuth"""
        user = self.get_user_by_google_id(google_id)

        if user:
            # Update existing user
            user.google_access_token = access_token
            if refresh_token:
                user.google_refresh_token = refresh_token
            user.google_token_expiry = token_expiry
            user.has_youtube_access = has_youtube_access
        else:
            # Check if email exists (linking accounts)
            user = self.get_user_by_email(email)

            if user:
                # Link Google account to existing user
                user.google_id = google_id
                user.google_access_token = access_token
                user.google_refresh_token = refresh_token
                user.google_token_expiry = token_expiry
                user.has_youtube_access = has_youtube_access
            else:
                # Create new user
                user = User(
                    email=email,
                    full_name=full_name,
                    google_id=google_id,
                    google_access_token=access_token,
                    google_refresh_token=refresh_token,
                    google_token_expiry=token_expiry,
                    has_youtube_access=has_youtube_access,
                    is_active=True
                )
                self.db.add(user)

        self.db.commit()
        self.db.refresh(user)
        return user


    def update_user(self, user_id: int, user_data: UserUpdate) -> User:
        """Update user information"""
        user = self.get_user_by_id(user_id)

        if user_data.email and user_data.email != user.email:
            if self.get_user_by_email(user_data.email):
                raise UserAlreadyExistsException(detail="Email already in use")
            user.email = user_data.email

        if user_data.full_name:
            if user_data.full_name != user.full_name and self.get_user_by_full_name(user_data.full_name):
                raise UserAlreadyExistsException(detail="Full name already in use")
            user.full_name = user_data.full_name

        if user_data.password:
            user.hashed_password = get_password_hash(user_data.password)

        self.db.commit()
        self.db.refresh(user)
        return user

    def generate_token(self, user: User) -> str:
        """Generate JWT token for user"""
        access_token = create_access_token(
            data={"sub": user.email, "user_id": user.id}
        )
        return access_token
