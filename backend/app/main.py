# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.v1 import auth, items
from backend.app.db.session import Base, engine
from backend.app.models import user, item  # ensure models are imported so metadata is created

app = FastAPI(title="Primetrade - Backend Assignment", version="0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(items.router)

@app.on_event("startup")
def on_startup():
    # create tables
    Base.metadata.create_all(bind=engine)

@app.get("/api/v1/health")
def health():
    return {"status": "ok"}
