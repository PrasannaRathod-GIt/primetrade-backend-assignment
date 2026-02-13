# backend/app/db/session.py

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

from backend.app.core.config import SQLALCHEMY_DATABASE_URL

# Create Base class for models
Base = declarative_base()

# Create engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Dependency
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
