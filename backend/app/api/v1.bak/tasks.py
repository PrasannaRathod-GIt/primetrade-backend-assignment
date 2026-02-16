from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.api.v1.deps import get_current_user
from backend.app.schemas import task as task_schemas
from backend.app.crud import task as crud_task

router = APIRouter()

@router.post("/", response_model=task_schemas.TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(task_in: task_schemas.TaskCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud_task.create_task(db=db, owner_id=current_user.id, task_in=task_in)

@router.get("/", response_model=task_schemas.PaginatedTasks)
def read_tasks(q: Optional[str] = Query(None), page: int = Query(1, ge=1), limit: int = Query(20, ge=1, le=100), status: Optional[str] = None, sort: Optional[str] = None, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    items, total = crud_task.list_tasks(db=db, owner_id=current_user.id, q=q, page=page, limit=limit, status=status, sort=sort)
    return {"data": items, "meta": {"page": page, "limit": limit, "total": total}}

@router.get("/{task_id}", response_model=task_schemas.TaskOut)
def read_task(task_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    task = crud_task.get_task(db, task_id)
    if not task or task.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="task not found")
    return task

@router.put("/{task_id}", response_model=task_schemas.TaskOut)
def update_task(task_id: int, task_in: task_schemas.TaskUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    task = crud_task.get_task(db, task_id)
    if not task or task.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="task not found")
    return crud_task.update_task(db=db, task=task, task_in=task_in)

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    task = crud_task.get_task(db, task_id)
    if not task or task.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="task not found")
    crud_task.delete_task(db=db, task=task)
    return None
