"""SQLAlchemy declarative base and model imports."""

from sqlalchemy.ext.declarative import declarative_base
from app.models.item import Item  # noqa

Base = declarative_base()
