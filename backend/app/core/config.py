# backend/app/core/config.py
import os
from datetime import timedelta

SECRET_KEY = os.getenv("JWT_SECRET", "change-me-to-a-secure-random-value")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
