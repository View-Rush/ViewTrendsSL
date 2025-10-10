from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    PROJECT_NAME: str
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database
    DATABASE_URL: str
    TEST_DATABASE_URL: str = "sqlite:///./test.db"

    # Google OAuth
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = []

    # Environment
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Parse CORS origins if it's a JSON string
        if isinstance(self.BACKEND_CORS_ORIGINS, str):
            self.BACKEND_CORS_ORIGINS = json.loads(self.BACKEND_CORS_ORIGINS)


settings = Settings()