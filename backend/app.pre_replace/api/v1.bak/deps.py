# backend/app/api/v1/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.core.config import SECRET_KEY, ALGORITHM
from backend.app.crud.users import get_user_by_email

# Make this match your auth login/token route in auth router.
# If your login endpoint is POST /api/v1/auth/login, keep "/api/v1/auth/login" here.
# If it's different (eg "/api/v1/auth/token"), change it to that path.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str | None = payload.get("sub")
        if not email:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # get_user_by_email(db, email) MUST exist and return the ORM User (or None)
    user = get_user_by_email(db, email)
    if user is None:
        raise credentials_exception
    return user

def require_admin(user = Depends(get_current_user)):
    # use named HTTP status constant for clarity
    if getattr(user, "role", None) != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return user
