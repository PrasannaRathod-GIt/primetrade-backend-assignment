# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.v1 import auth, items
from backend.app.db.session import engine
from backend.app.db.base import Base

# Import models so SQLAlchemy registers them
from backend.app.models import users as users_model
from backend.app.models import item as item_model

app = FastAPI(
    title="Primetrade - Backend Assignment",
    version="0.1"
)

# CORS (development only)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(items.router, prefix="/api/v1/items", tags=["items"])

@app.on_event("startup")
def on_startup():
    # Create tables if not exist
    Base.metadata.create_all(bind=engine)

@app.get("/api/v1/health", tags=["health"])
def health():
    return {"status": "ok"}
