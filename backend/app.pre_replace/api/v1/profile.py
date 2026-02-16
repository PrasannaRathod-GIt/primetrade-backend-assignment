from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.api.v1.deps import get_current_user
from backend.app.schemas.users import UserRead, UserUpdate

router = APIRouter()

@router.get("/", response_model=UserRead)
def get_profile(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # If get_current_user returns ORM user -> return it directly
    if hasattr(current_user, "id"):
        return current_user
    # If it returns a dict/payload, raise a 401 so frontend will re-auth
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication")
    
@router.put("/", response_model=UserRead)
def update_profile(user_in: UserUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if not hasattr(current_user, "id"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication")
    for k, v in user_in.model_dump(exclude_unset=True).items():
        setattr(current_user, k, v)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
