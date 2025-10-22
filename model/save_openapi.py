# model/save_openapi.py
from fastapi.openapi.utils import get_openapi
import json
import os
from app.main import app  # your FastAPI app

# Save OpenAPI JSON in the current working directory
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(CURRENT_DIR, "openapi.json")

# Generate OpenAPI schema
openapi_schema = get_openapi(
    title=app.title,
    version="1.0.0",
    description="Auto-generated OpenAPI schema",
    routes=app.routes,
)

# Save to openapi.json in current folder
with open(OUTPUT_FILE, "w") as f:
    json.dump(openapi_schema, f, indent=2)

print(f"OpenAPI schema saved to: {OUTPUT_FILE}")
