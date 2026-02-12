"""Database initialization script."""

from app.db.base import Base
from app.db.session import engine


def init_db():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


def seed_db():
    """Seed database with initial data."""
    # TODO: Add seed data here
    pass


if __name__ == "__main__":
    init_db()
    seed_db()
