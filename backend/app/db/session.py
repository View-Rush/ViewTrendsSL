from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import Engine
from sqlalchemy.pool import NullPool, QueuePool
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Load and manage environment variables."""
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    ECHO: bool = os.getenv("SQLALCHEMY_ECHO", "False").lower() in ("true", "1", "yes")
    POOL_SIZE: int = int(os.getenv("SQLALCHEMY_POOL_SIZE", 5))
    MAX_OVERFLOW: int = int(os.getenv("SQLALCHEMY_MAX_OVERFLOW", 10))
    POOL_CLASS = QueuePool  # Can change to NullPool for testing

settings = Settings()

# Create SQLAlchemy engine with pooling options
engine: Engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.ECHO,
    pool_size=settings.POOL_SIZE,
    max_overflow=settings.MAX_OVERFLOW,
    pool_pre_ping=True,
    poolclass=settings.POOL_CLASS
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for models
Base = declarative_base()

from fastapi import Depends

def get_db():
    db = SessionLocal()  # create a new DB session
    try:
        print("hehe")
        yield db        # yield it to the FastAPI route
    finally:
        db.close()
