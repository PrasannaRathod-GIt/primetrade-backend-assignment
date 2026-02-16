# backend/app/db/base.py
"""SQLAlchemy declarative base (no model imports here)."""

from sqlalchemy.orm import declarative_base

Base = declarative_base()
