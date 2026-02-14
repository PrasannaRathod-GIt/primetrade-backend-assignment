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

## 📁 Project Structure

```
primetrade/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   └── schemas/
│   └── requirements.txt
│
├── frontend-simple/
├── .env.example
└── README.md
```

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

---

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


## 🔌 API Endpoints

### Authentication
- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive JWT access token

### Items
- `GET /items` — List items (authenticated users)
- `POST /items` — Create item (admin only)
- `PUT /items/{id}` — Update item (admin only)
- `DELETE /items/{id}` — Delete item (admin only)

---

## 🔐 Role-Based Access Control (RBAC)

- Default role: `user`
- Admin users can create, update, and delete items.
- Regular users can only view items.
- Access control is enforced using JWT authentication and FastAPI dependencies.

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

