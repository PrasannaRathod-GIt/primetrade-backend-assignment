from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.api.v1.deps import get_current_user
from backend.app.schemas.user import UserRead, UserCreate, UserUpdate

router = APIRouter()

@router.get("/", response_model=UserRead)
def get_profile(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # If get_current_user already returns an ORM user instance, return it directly
    return current_user

@router.put("/", response_model=UserRead)
def update_profile(user_in: UserUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    for k, v in user_in.model_dump(exclude_unset=True).items():
        setattr(current_user, k, v)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
