# backend/app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from backend.app.db.session import get_db
from backend.app.crud.user import get_user_by_email, create_user
from backend.app.schemas.user import UserCreate, Token
from backend.app.core.security import verify_password, create_access_token
from backend.app.schemas.user import TokenData

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

@router.post("/register", response_model=dict)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(db, user_in)
    return {"msg": "user created", "id": user.id}

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    token_data = {"sub": user.email, "role": user.role}
    access_token = create_access_token(token_data)
    return {"access_token": access_token, "token_type": "bearer"}
