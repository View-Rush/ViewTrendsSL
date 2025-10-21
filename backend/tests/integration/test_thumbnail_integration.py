"""Integration test for real Supabase thumbnail upload connection."""

import io
import os
import pytest
import requests
from fastapi.testclient import TestClient
from app.main import app

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
BUCKET_NAME = "thumbnails"

# Only run this test if real Supabase credentials are available
pytestmark = pytest.mark.skipif(
    not SUPABASE_URL or not SUPABASE_SERVICE_KEY,
    reason="Supabase credentials not set — skipping integration test",
)


def test_real_thumbnail_upload(client: TestClient, auth_headers: dict):
    """Integration test: Uploads a real thumbnail to Supabase and verifies accessibility."""

    # Step 1: Create a tiny in-memory image (1x1 PNG)
    # No need for Pillow dependency — use a hardcoded valid PNG header
    png_data = (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01"
        b"\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00"
        b"\x00\nIDATx\xdac\xf8\x0f\x00\x01\x01\x01\x00\x18\xdd"
        b"\x8d\xbb\x00\x00\x00\x00IEND\xaeB`\x82"
    )
    fake_file = io.BytesIO(png_data)

    files = {"file": ("integration_test.png", fake_file, "image/png")}
    data = {"user_id": "integration-test"}

    # Step 2: Call the actual upload endpoint (not mocked)
    response = client.post(
        "/api/v1/videos/upload-thumbnail",
        files=files,
        data=data,
        headers=auth_headers,
    )

    assert response.status_code == 200, response.text
    data = response.json()

    public_url = data["public_url"]
    path = data["path"]

    # Step 3: Verify public URL is accessible
    r = requests.get(public_url)
    assert r.status_code == 200, f"Public URL not accessible: {r.status_code}"

    # Step 4: Cleanup — delete the uploaded file
    from supabase import create_client

    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    res = supabase.storage.from_(BUCKET_NAME).remove([path])

    assert "error" not in res or res["error"] is None, f"Failed to delete: {res}"
