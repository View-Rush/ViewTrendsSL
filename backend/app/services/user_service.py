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

    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        return self.db.query(User).filter(User.username == username).first()

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

        if self.get_user_by_username(user_data.username):
            raise UserAlreadyExistsException(detail="Username already taken")

        # Create user
        db_user = User(
            email=user_data.email,
            username=user_data.username,
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
            username: str,
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
                # Ensure unique username
                base_username = username
                counter = 1
                while self.get_user_by_username(username):
                    username = f"{base_username}{counter}"
                    counter += 1

                user = User(
                    email=email,
                    username=username,
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

        if user_data.username and user_data.username != user.username:
            if self.get_user_by_username(user_data.username):
                raise UserAlreadyExistsException(detail="Username already taken")
            user.username = user_data.username

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
