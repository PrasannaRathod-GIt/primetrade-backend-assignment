"""Authentication endpoint tests."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


@pytest.fixture
def user_data():
    """Fixture for test user data."""
    return {
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }


def test_register_user(user_data):
    """Test user registration."""
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_user(user_data):
    """Test user login."""
    login_data = {
        "email": user_data["email"],
        "password": user_data["password"]
    }
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()
