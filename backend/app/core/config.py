# backend/app/core/config.py
import os
from datetime import timedelta
from dotenv import load_dotenv

# load .env at project root
load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "change-me-to-a-secure-random-value")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# The environment variable name is DATABASE_URL
# Provide a sensible sqlite fallback for local dev
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./app.db"
)
