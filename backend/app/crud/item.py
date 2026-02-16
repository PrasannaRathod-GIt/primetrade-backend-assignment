# backend/app/crud/item.py
from sqlalchemy.orm import Session
from backend.app.models.item import Item
from backend.app.schemas.item import ItemCreate, ItemUpdate

def create_item(db: Session, owner_id: int, item_in: ItemCreate):
    db_item = Item(title=item_in.title, description=item_in.description, owner_id=owner_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Item).offset(skip).limit(limit).all()

def get_item(db: Session, item_id: int):
    return db.query(Item).filter(Item.id == item_id).first()

def update_item(db: Session, item: Item, item_in: ItemUpdate):
    item.title = item_in.title
    item.description = item_in.description
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def delete_item(db: Session, item: Item):
    db.delete(item)
    db.commit()
