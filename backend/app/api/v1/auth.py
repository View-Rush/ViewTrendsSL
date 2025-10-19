from fastapi import APIRouter, Depends, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from itsdangerous import URLSafeTimedSerializer
from app.schemas.user import UserCreate, UserResponse, Token, GoogleAuthResponse
from app.services.user_service import UserService
from app.services.oauth_service import OAuthService, oauth
from app.core.config import settings
from app.core.exceptions import OAuthException
from app.db.session import get_db
from app.dependencies import get_current_user


router = APIRouter()

# State serializer for OAuth
serializer = URLSafeTimedSerializer(settings.SECRET_KEY)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user with username/password"""
    user_service = UserService(db)
    user = user_service.create_user(user_data)
    return user


@router.post("/login", response_model=Token)
def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
):
    """Login with username/password and get JWT token"""
    user_service = UserService(db)
    user = user_service.authenticate_user(form_data.username, form_data.password)
    access_token = user_service.generate_token(user)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/google", response_model=GoogleAuthResponse)
async def google_login(request: Request):
    """Initiate Google OAuth flow"""
    # Create state token for CSRF protection
    state = serializer.dumps({"timestamp": datetime.utcnow().isoformat()})

    # Generate authorization URL
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    authorization_url = await oauth.google.authorize_redirect(
        request,
        redirect_uri,
        state=state
    )

    return {
        "authorization_url": str(authorization_url.headers.get("location")),
        "state": state
    }


@router.get("/google/callback")
async def google_callback(
        request: Request,
        db: Session = Depends(get_db)
):
    """Handle Google OAuth callback"""
    try:
        # Verify state
        state = request.query_params.get('state')
        if not state:
            raise OAuthException(detail="Missing state parameter")

        try:
            serializer.loads(state, max_age=600)  # 10 minutes expiry
        except Exception:
            raise OAuthException(detail="Invalid or expired state")

        # Get token from Google
        token = await oauth.google.authorize_access_token(request)

        # Get user info
        user_info = await OAuthService.get_user_info(token)

        # Calculate token expiry
        expires_in = token.get('expires_in', 3600)
        token_expiry = datetime.utcnow() + timedelta(seconds=expires_in)

        # Check YouTube access
        has_youtube_access = OAuthService.check_youtube_access(token['access_token'])

        # Create or update user
        user_service = UserService(db)
        user = user_service.create_or_update_google_user(
            google_id=user_info['id'],
            email=user_info['email'],
            username=user_info.get('name', user_info['email'].split('@')[0]),
            access_token=token['access_token'],
            refresh_token=token.get('refresh_token'),
            token_expiry=token_expiry,
            has_youtube_access=has_youtube_access
        )

        # Generate JWT token
        access_token = user_service.generate_token(user)

        # In production, redirect to frontend with token
        # For now, return JSON response
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse.from_orm(user)
        }

    except OAuthException:
        raise
    except Exception as e:
        raise OAuthException(detail=f"OAuth authentication failed: {str(e)}")


@router.post("/google/refresh-token", response_model=Token)
def refresh_google_token(
        db: Session = Depends(get_db),
        current_user=Depends(get_current_user)
):
    """Refresh Google access token"""

    if not current_user.google_refresh_token:
        raise OAuthException(detail="No refresh token available")

    # Refresh the token
    new_token = OAuthService.refresh_access_token(current_user.google_refresh_token)

    if not new_token:
        raise OAuthException(detail="Failed to refresh token")

    # Update user's tokens
    current_user.google_access_token = new_token['access_token']
    expires_in = new_token.get('expires_in', 3600)
    current_user.google_token_expiry = datetime.utcnow() + timedelta(seconds=expires_in)

    db.commit()

    # Return new JWT token
    user_service = UserService(db)
    access_token = user_service.generate_token(current_user)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
