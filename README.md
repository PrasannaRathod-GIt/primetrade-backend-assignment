# Primetrade — Full Project (Backend + Frontend)

## Overview
A small, full-stack demo for the Primetrade assignment:
- **Backend:** FastAPI (Python) — JWT auth, RBAC, Items CRUD, PostgreSQL.
- **Frontend:** React (Vite + TypeScript) + Tailwind CSS — login, profile, dashboard, items CRUD, protected routes.
- Designed as a clean, modular, and scalable starter you can run locally.

---

## Key features
- JWT authentication (login/register), token stored in `localStorage`.
- Role-based behavior: `user` and `admin` (admin is set by backend).
- Items CRUD:
  - Create = any signed-in user
  - Edit = item owner (publisher) or admin
  - Delete = admin only
- Profile update (`full_name`), Dashboard summary, Protected routes.
- Frontend uses React Query for caching and axios for API calls.
- Friendly error handling + type-safe TypeScript on frontend.

---

## Quick prerequisites
- Python 3.11+ and pip
- Node 18+ and npm
- PostgreSQL (or Docker postgres)
- Git (to clone the repo)

Create `.env` from `.env.example` and set DB and JWT_SECRET values.

---

## Run (development) — exact commands to start everything

From project root do the following steps (open TWO terminals / split terminal):

### Terminal A — backend
1. Activate venv (PowerShell):
```powershell
.venv/Scripts/Activate.ps1

2. Start the backend (from project root):
   uvicorn backend.app.main:app --reload

Backend will be available at:
http://localhost:8000

API docs:
http://localhost:8000/docs

Terminal B — frontend

3. Open a second terminal (split) and start the frontend:
  cd frontend
  npm install        # run once if not installed
  npm run dev

Frontend dev server (Vite) usually available at:
http://localhost:5173

Install backend deps (if needed)
From project root (or cd backend):
  pip install --upgrade pip
  pip install -r backend/requirements.txt

Create database (example):
CREATE DATABASE primetrade;

Or run a Docker postgres container.

Environment variables (minimum)
Copy .env.example → .env and set:
DATABASE_URL=postgresql+psycopg2://

postgres:password@localhost:5432/primetrade
JWT_SECRET=replace-with-secure-random-value
ACCESS_TOKEN_EXPIRE_MINUTES=60

For frontend, set (frontend/.env):
VITE_API_URL=http://localhost:8000


API summary (most-used endpoints) :

- POST /api/v1/auth/token — login (returns    access_token)
- GET /api/v1/auth/me — current user
- PUT /api/v1/auth/me — update profile
- GET /api/v1/items — list items
- POST /api/v1/items — create item (signed-in)
- GET /api/v1/items/{id} — detail
- PUT /api/v1/items/{id} — update (owner/admin)
- DELETE /api/v1/items/{id} — delete (admin only)
 Backend enforces owner/admin checks. Frontend performs UX-level checks (show/hide controls) but backend is authoritative.

Notes

- Admin users are configured on the backend (see backend docs). Deletion succeeds only if the backend authorizes.
- Keep file/casing imports consistent (AuthContext.tsx etc.) to avoid TypeScript module resolution issues.
- Run npx tsc --noEmit in frontend to type-check TypeScript.

Minimal developer checklist -

1. pip install -r backend/requirements.txt

2. Set .env and create DB.

3. venv/Scripts/Activate.ps1 → uvicorn backend.app.main:app --reload (Terminal A)

4. cd frontend → npm install → npm run dev (Terminal B)

Scalability  - 

This project is designed to be horizontally scalable. For production we recommend:

Containerizing services and deploying behind a load-balancer with autoscaling.

Using PostgreSQL with connection pooling (PgBouncer) and proper indexes.

Using Redis for caching and as a message broker for background tasks.

Offloading long-running jobs to background workers (Celery/RQ).

Serving ML models from a separate service for independent scaling.

Implementing monitoring (Prometheus/Grafana) and structured logging.

To add a new feature: create the DB model + Alembic migration, add Pydantic schemas and CRUD, expose routers in FastAPI, add frontend API client + route + page, add tests, and update docs. Follow the checklist in /docs/DEVELOPER_GUIDE.md for more detail.