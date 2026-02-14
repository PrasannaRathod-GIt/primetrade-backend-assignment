# Primetrade 


## 1) README.md 

```markdown
# Primetrade — Backend Developer (Intern) Assignment

## 📌 Overview
Simple backend built for the Primetrade Backend Developer (Intern) assignment. Implements authentication, RBAC, CRUD on items, and a minimal frontend for demo/testing.

**Main features**
- User registration & login (hashed passwords)
- JWT-based authentication
- Role-based access control (user / admin)
- CRUD APIs for Items
- PostgreSQL + SQLAlchemy
- API docs (Swagger)
- Minimal frontend (Vanilla JS) for demo

---

## 🧩 Tech stack
- **Backend:** FastAPI, SQLAlchemy, python-jose (JWT), Passlib
- **Database:** PostgreSQL
- **Frontend:** Vanilla HTML/CSS/JS (static demo)
- **Dev tools:** Uvicorn, pytest (optional)

---

## 📁 Project structure (important files)
```

backend/
app/
main.py                # FastAPI app entry
api/                   # routers
core/                  # config
db/                    # session, models, migrations
models/
schemas/
frontend-simple/
README.md
.github/workflows/ci.yml
backend/requirements.txt
.env.example

````

---

## ⚙️ Quick start (development)

**Requirements**
- Python 3.11
- PostgreSQL running (local or docker)

### 1. Create & activate virtual environment

**Windows (PowerShell)**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
````

**macOS / Linux**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install dependencies

`requirements.txt` is in the `backend/` folder.

**From repo root**

```bash
pip install --upgrade pip
pip install -r backend/requirements.txt
```

**Or from backend folder**

```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill values (do **not** commit `.env`):

```bash
cp .env.example .env
# then edit .env to set DB password and JWT_SECRET
```

### 4. Create the database (if not present)

**Using psql**

```sql
CREATE DATABASE primetrade;
```

**Using Docker (quick local DB)**

```bash
docker run --name primetrade-db -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_USER=postgres -e POSTGRES_DB=primetrade -p 5432:5432 -d postgres:14
```

### 5. Run the backend

**From repo root**

```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

**Or from backend folder**

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open Swagger: `http://127.0.0.1:8000/docs`

### 6. Run frontend (static demo)

From repo root:

```bash
python -m http.server 3000 --directory frontend-simple
# open http://localhost:3000/login.html
```

### 7. Run tests (optional)

From repo root:

```bash
pytest backend/app/tests -v
```

(Or `cd backend` then `pytest app/tests -v`.)

---

## 🔐 Security & housekeeping

### .env.example (copy this to `.env.example` and edit locally)

```
DATABASE_URL=postgresql+psycopg2://postgres:yourpassword@localhost:5432/primetrade
JWT_SECRET=replace-with-secure-random-value
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### .gitignore (ensure your repo contains these lines)

```
.env
.venv/
__pycache__/
*.pyc
```

### Remove `.env` from git tracking (if accidentally committed)

```powershell
# from repo root (PowerShell)
git rm --cached .env
git commit -m "chore: remove .env from repo"
git push
```

### Remove pycache files from git (if present)

```powershell
# remove cached __pycache__ entries
git rm -r --cached backend/app/__pycache__
# repeat as needed for other __pycache__ folders
git commit -m "chore: remove pycache files"
git push
```

---

## 2) Corrected GitHub Actions workflow (copy to `.github/workflows/ci.yml`)

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        working-directory: ./backend
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Run tests (if present)
        working-directory: ./backend
        run: |
          if [ -d tests ]; then
            echo "Running tests/..."
            pytest tests -v
          else
            echo "No tests found — skipping pytest"
          fi
```

---

## 3) Minimal test file (copy to `backend/app/tests/test_root.py`)

```python
# backend/app/tests/test_root.py
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_returns_200():
    response = client.get("/")
    assert response.status_code == 200
```

---

## 4) Helpful psql commands to verify data (copy-paste)

```sql
-- connect (from shell):
psql -h localhost -U postgres -d primetrade

-- inside psql:
\dt
SELECT id, email, full_name, role FROM users;
\q
```

Or one-liner from shell (prompts for password):

```bash
psql -h localhost -U postgres -d primetrade -c "SELECT id, email, full_name, role FROM users;"
```

---

## 5) Quick local debug checklist (if something fails)

* Ensure Postgres is running and credentials in `.env` match the DB user/password.
* If `uvicorn` shows an import error, re-check `uvicorn` import path and working directory.
* If tests fail due to DB, ensure test DB or `DATABASE_URL` points to a test DB (your workflow uses `test_db`).
* Pydantic v2 warnings about `orm_mode` are harmless; to fix later change schema config to `model_config = {"from_attributes": True}`.
