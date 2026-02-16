# backend/app/schemas/item.py
from pydantic import BaseModel
from typing import Optional

class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemUpdate(ItemBase):
    pass

class ItemRead(ItemBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True
