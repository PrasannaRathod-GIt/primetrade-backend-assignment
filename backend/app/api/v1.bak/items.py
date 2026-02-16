# backend/app/api/v1/items.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.db.session import get_db
from backend.app.schemas.item import ItemCreate, ItemRead, ItemUpdate
from backend.app.crud.item import create_item, get_items, get_item, update_item, delete_item
from backend.app.api.v1.deps import get_current_user, require_admin

router = APIRouter(tags=["items"])


@router.post("/", response_model=ItemRead)
def create_new_item(item_in: ItemCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return create_item(db, owner_id=user.id, item_in=item_in)

@router.get("/", response_model=List[ItemRead])
def list_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_items(db, skip=skip, limit=limit)

@router.get("/{item_id}", response_model=ItemRead)
def read_item(item_id: int, db: Session = Depends(get_db)):
    db_item = get_item(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item

@router.put("/{item_id}", response_model=ItemRead)
def edit_item(item_id: int, item_in: ItemUpdate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    db_item = get_item(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    # only owner or admin can update
    if db_item.owner_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not permitted")
    return update_item(db, db_item, item_in)

@router.delete("/{item_id}", response_model=dict)
def remove_item(item_id: int, db: Session = Depends(get_db), admin = Depends(require_admin)):
    db_item = get_item(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    delete_item(db, db_item)
    return {"msg": "deleted"}
