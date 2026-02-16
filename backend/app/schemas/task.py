from typing import Optional, List
from pydantic import BaseModel, constr
from datetime import datetime

class TaskBase(BaseModel):
    title: constr(strip_whitespace=True, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = "open"

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[constr(strip_whitespace=True, min_length=1, max_length=255)]
    description: Optional[str]
    status: Optional[str]

class TaskOut(TaskBase):
    id: int
    owner_id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

class PaginatedTasks(BaseModel):
    data: List[TaskOut]
    meta: dict
