from sqlalchemy.orm import Session
from backend.app.models.users import User
from backend.app.schemas.users import UserCreate
from backend.app.core.security import get_password_hash

# ----------------- Create User -----------------
def create_user(db: Session, user: UserCreate):
    """
    Create a new user in the database with hashed password.
    Defaults role to 'user' and is_active=True
    """
    db_user = User(
        email=user.email,
        hashed_password=get_password_hash(user.password),
        full_name=user.full_name,
        role="user",       # default role
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ----------------- Get User By Email -----------------
def get_user_by_email(db: Session, email: str):
    """
    Fetch a user from the database by email.
    Returns None if not found
    """
    return db.query(User).filter(User.email == email).first()
