# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.v1 import auth, items, tasks, profile
from backend.app.db.session import Base, engine

# Import models so SQLAlchemy sees them and can create tables on startup.
from backend.app.models import users as users_model, item as item_model, task as task_model

app = FastAPI(title="Primetrade - Backend Assignment", version="0.1")

# --- SAFE CORS (development) ---
# Allow only the local origins you use for serving frontend during development.
# Add more origins here if you serve the frontend from a different host/port.
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # optionally include other dev ports you use:
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5173",      # ← add this
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # <-- NOT "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------------------------------

# Mount routers under versioned API prefixes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(items.router, prefix="/api/v1/items", tags=["items"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["tasks"])
app.include_router(profile.router, prefix="/api/v1/profile", tags=["profile"])

@app.on_event("startup")
def on_startup():
    # Ensure tables exist (no-op if already present)
    Base.metadata.create_all(bind=engine)

@app.get("/api/v1/health", tags=["health"])
def health():
    return {"status": "ok"}
