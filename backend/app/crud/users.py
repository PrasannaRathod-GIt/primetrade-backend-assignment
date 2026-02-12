# backend/app/crud/users.py
from sqlalchemy.orm import Session
from backend.app.models.users import User
from backend.app.schemas.users import UserCreate
from backend.app.core.security import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_in: UserCreate):
    hashed = get_password_hash(user_in.password)
    db_user = User(email=user_in.email, hashed_password=hashed, role=user_in.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
