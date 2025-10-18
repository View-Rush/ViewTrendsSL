# backend/save_openapi.py
from fastapi.openapi.utils import get_openapi
import json
import os
from app.main import app  # your FastAPI app

# Path to save OpenAPI JSON
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_PATH = os.path.join(PROJECT_ROOT, "docs")
os.makedirs(DOCS_PATH, exist_ok=True)
OUTPUT_FILE = os.path.join(DOCS_PATH, "openapi.json")

# Generate OpenAPI schema
openapi_schema = get_openapi(
    title=app.title,
    version="1.0.0",
    description="Auto-generated OpenAPI schema",
    routes=app.routes
)

# Save to docs/openapi.json
with open(OUTPUT_FILE, "w") as f:
    json.dump(openapi_schema, f, indent=2)

print(f"OpenAPI schema saved to {OUTPUT_FILE}")
