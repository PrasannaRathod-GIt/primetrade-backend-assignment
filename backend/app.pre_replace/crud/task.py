from typing import Optional, Tuple, List
from sqlalchemy.orm import Session
from backend.app.models.task import Task
from backend.app.schemas import task as task_schemas

def create_task(db: Session, owner_id: int, task_in: task_schemas.TaskCreate) -> Task:
    db_task = Task(**task_in.model_dump(), owner_id=owner_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_task(db: Session, task_id: int) -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id).first()

def update_task(db: Session, task: Task, task_in: task_schemas.TaskUpdate) -> Task:
    for field, value in task_in.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()

def list_tasks(db: Session, owner_id: int, q: Optional[str], page: int = 1, limit: int = 20, status: Optional[str] = None, sort: Optional[str] = None) -> Tuple[List[Task], int]:
    query = db.query(Task).filter(Task.owner_id == owner_id)
    if q:
        like_q = f"%{q}%"
        query = query.filter((Task.title.ilike(like_q)) | (Task.description.ilike(like_q)))
    if status:
        query = query.filter(Task.status == status)
    total = query.count()
    if sort:
        if sort == "created_desc":
            query = query.order_by(Task.created_at.desc())
        else:
            query = query.order_by(Task.created_at.asc())
    else:
        query = query.order_by(Task.created_at.desc())
    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()
    return items, total
