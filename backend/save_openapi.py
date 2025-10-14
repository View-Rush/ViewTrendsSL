from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
import json
from app.main import app  # your FastAPI app

# Generate OpenAPI schema
openapi_schema = get_openapi(
    title=app.title,
    version="1.0.0",
    description="Auto-generated OpenAPI schema",
    routes=app.routes
)

# Save to file
with open("openapi.json", "w") as f:
    json.dump(openapi_schema, f, indent=2)
