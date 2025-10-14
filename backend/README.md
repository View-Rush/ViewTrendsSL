# ViewTrendsSL Backend

A YouTube video trend prediction API built with FastAPI, PostgreSQL, and machine learning capabilities. This application allows users to analyze YouTube videos and channels, predict trends, and track video performance metrics.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Running with Docker](#running-with-docker)
  - [Running Locally](#running-locally)
- [Database Migrations](#database-migrations)
- [API Configuration](#api-configuration)
  - [YouTube API Setup](#youtube-api-setup)
  - [Google OAuth Setup](#google-oauth-setup)
- [Testing](#testing)
- [Development](#development)

## 🔧 Prerequisites

### For Docker Deployment
- Docker 20.10+
- Docker Compose 2.0+

### For Local Development
- Python 3.11+
- PostgreSQL 15+
- Poetry 2.2.1+
- Git

### API Keys Required
- Google Cloud Project with YouTube Data API v3 enabled
- Google OAuth 2.0 credentials

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/v1/          # API endpoints (auth, users, videos, channels, predictions)
│   ├── core/            # Security utilities and exceptions
│   ├── db/              # Database session management
│   ├── models/          # SQLAlchemy ORM models
│   ├── schemas/         # Pydantic request/response schemas
│   └── services/        # Business logic layer
├── alembic/             # Database migration scripts
│   └── versions/        # Migration version files
├── tests/               # Test suite
├── docker-compose.yml   # Docker services configuration
├── Dockerfile           # Container build instructions
├── pyproject.toml       # Poetry dependencies
└── .env                 # Environment variables (create this)
```

## 🚀 Setup

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Application
PROJECT_NAME=ViewTrendsSL
API_V1_STR=/api/v1
ENVIRONMENT=development

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/youtube_prediction
TEST_DATABASE_URL=sqlite:///./test.db

# PostgreSQL (for Docker)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=youtube_prediction

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:8000"]
```

**⚠️ Security Note:** Change the `SECRET_KEY` in production! Generate a secure key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Running with Docker

**This is the recommended method for quick setup.**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ViewTrendsSL-main/backend
   ```

2. **Create the `.env` file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   nano .env
   ```

3. **Build and start containers**
   ```bash
   docker-compose up -d
   ```

   This will:
   - Start PostgreSQL database on port 5432
   - Start FastAPI application on port 8000
   - Automatically run database migrations
   - Enable hot-reload for development

4. **Check container status**
   ```bash
   docker-compose ps
   ```

5. **View logs**
   ```bash
   docker-compose logs -f api
   ```

6. **Stop containers**
   ```bash
   docker-compose down
   ```

7. **Stop and remove volumes (⚠️ deletes database data)**
   ```bash
   docker-compose down -v
   ```

### Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/View-Rush/ViewTrendsSL.git
   cd ViewTrendsSL-main/backend
   ```

2. **Install Poetry** (if not already installed)
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

3. **Install dependencies**
   ```bash
   poetry install
   ```

4. **Activate virtual environment**
   ```bash
   poetry shell
   ```

5. **Setup PostgreSQL database**
   ```bash
   # Login to PostgreSQL
   sudo -u postgres psql
   
   # Create database
   CREATE DATABASE youtube_prediction;
   CREATE USER postgres WITH PASSWORD 'postgres';
   GRANT ALL PRIVILEGES ON DATABASE youtube_prediction TO postgres;
   \q
   ```

6. **Create and configure `.env` file**
   ```bash
   cp .env.example .env
   nano .env
   ```
   
   Update `DATABASE_URL` for local PostgreSQL:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/youtube_prediction
   ```

7. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

8. **Start the application**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

9. **Access the API**
   - API: http://localhost:8000
   - Interactive docs: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

## 🗄️ Database Migrations

### View migration history
```bash
alembic history
```

### Check current version
```bash
alembic current
```

### Create a new migration
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply migrations
```bash
# Upgrade to latest
alembic upgrade head

# Upgrade by 1 version
alembic upgrade +1
```

### Rollback migrations
```bash
# Downgrade by 1 version
alembic downgrade -1

# Downgrade to specific version
alembic downgrade <revision_id>

# Rollback all migrations
alembic downgrade base
```

## 🔑 API Configuration

### YouTube API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable APIs:
   - Navigate to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create API credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key (optional: restrict key to YouTube Data API)
5. Add to `.env`:
   ```env
   YOUTUBE_API_KEY=your-api-key-here
   ```

### Google OAuth Setup

1. In [Google Cloud Console](https://console.cloud.google.com/), go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Configure OAuth consent screen:
   - User Type: External (for testing) or Internal
   - Add app name, user support email, and developer contact
   - Add scopes: `email`, `profile`, `openid`
4. Create OAuth Client ID:
   - Application type: Web application
   - Name: ViewTrendsSL
   - Authorized redirect URIs:
     - `http://localhost:8000/api/v1/auth/google/callback`
     - `http://127.0.0.1:8000/api/v1/auth/google/callback`
5. Copy Client ID and Client Secret to `.env`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback
   ```

## 📚 API Documentation

Once the application is running, access interactive API documentation:

- **Swagger UI** (recommended): http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/api/v1/openapi.json

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/api/test_auth.py

# Run with verbose output
pytest -v

# Run and stop at first failure
pytest -x
```

## 💻 Development

### Development Tips

1. **Hot Reload**: The `--reload` flag in uvicorn automatically restarts the server on code changes
2. **Database GUI**: Use tools like pgAdmin or DBeaver to inspect the PostgreSQL database
3. **API Testing**: Use the Swagger UI at `/docs` for interactive API testing
4. **Logging**: Check console output for detailed request/response logs

### Project Dependencies

Main dependencies:
- **FastAPI**: Modern web framework
- **SQLAlchemy**: ORM for database operations
- **Alembic**: Database migrations
- **Pydantic**: Data validation
- **Authlib**: OAuth implementation
- **Google API Client**: YouTube API integration
- **python-jose**: JWT token handling
- **Passlib**: Password hashing

## 📝 License

MIT License

## 👥 Authors

- Kevin Sanjula (kevinxsanjula@gmail.com)

---

For more information, visit the [API documentation](http://localhost:8000/docs) when the server is running.

