from authlib.integrations.starlette_client import OAuth
from app.config import settings
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from datetime import datetime
import httpx

oauth = OAuth()

# Configure Google OAuth with YouTube scope
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile https://www.googleapis.com/auth/youtube.readonly',
        'access_type': 'offline',  # Get refresh token
        'prompt': 'consent'  # Force consent to get refresh token
    }
)


class OAuthService:
    @staticmethod
    async def get_authorization_url(redirect_uri: str, state: str):
        """Generate Google OAuth authorization URL"""
        return await oauth.google.authorize_redirect(redirect_uri, state=state)

    @staticmethod
    async def get_user_info(token: dict):
        """Get user info from Google"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers={'Authorization': f'Bearer {token["access_token"]}'}
            )
            return response.json()

    @staticmethod
    def refresh_access_token(refresh_token: str):
        """Refresh Google access token"""
        import requests

        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token"
        }

        response = requests.post(token_url, data=data)
        if response.status_code == 200:
            return response.json()
        return None

    @staticmethod
    def get_youtube_service(access_token: str):
        """Create YouTube API service"""
        credentials = Credentials(token=access_token)
        return build('youtube', 'v3', credentials=credentials)

    @staticmethod
    def check_youtube_access(access_token: str) -> bool:
        """Check if user has YouTube access by making a test API call"""
        try:
            youtube = OAuthService.get_youtube_service(access_token)
            # Try to get user's channel info
            youtube.channels().list(part='snippet', mine=True).execute()
            return True
        except Exception:
            return False