from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from backend.app.db.session import get_db
from backend.app.crud.users import get_user_by_email, create_user
from backend.app.schemas.userss import UserCreate, Token
from backend.app.core.security import verify_password, create_access_token
from backend.app.api.v1.deps import get_current_user  # <-- import dependency

router = APIRouter(tags=["auth"])


@router.post("/register", response_model=dict)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(db, user_in)
    return {"msg": "user created", "id": user.id}


@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    token_data = {"sub": user.email, "role": user.role}
    access_token = create_access_token(token_data)
    return {"access_token": access_token, "token_type": "bearer"}


# -------------------- NEW ENDPOINT --------------------
@router.get("/me", response_model=dict)
def read_current_user(user = Depends(get_current_user)):
    """
    Return current logged-in user info
    """
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "full_name": getattr(user, "full_name", None)
    }
