# Primetrade Backend Developer (Intern) Assignment

## 📌 Overview

This project is developed as part of the Primetrade Backend Developer (Intern) assignment.

It implements:

- User Authentication (Register / Login)
- JWT-based authorization
- Role-based access control (User / Admin)
- CRUD operations for Items
- PostgreSQL database integration
- API documentation via Swagger
- Basic frontend interface (Vanilla JS)

The backend is built with FastAPI and follows a modular, versioned API structure.

---

## 🛠 Tech Stack

**Backend**
- FastAPI
- PostgreSQL
- SQLAlchemy ORM
- JWT (python-jose)
- Passlib (password hashing)

**Frontend**
- Vanilla HTML / CSS / JavaScript

---

## 📂 Project Structure

backend/
app/
api/
core/
db/
models/
schemas/
main.py

frontend-simple/
README.md

2️⃣ Create & Activate Virtual Environment
1.python -m venv .venv

2.& .\.venv\Scripts\Activate.ps1

3️⃣ Install Dependencies
pip install -r requirements.txt

4️⃣ Configure Environment Variables
Create a .env file in the project root:

DATABASE_URL=postgresql+psycopg2://postgres:yourpassword@localhost:5432/primetrade
JWT_SECRET=change-me-to-a-secure-random-value
ACCESS_TOKEN_EXPIRE_MINUTES=60

5️⃣ Run Backend
uvicorn backend.app.main:app --reload

- Backend runs at:
http://127.0.0.1:8000

Swagger documentation:
http://127.0.0.1:8000/docs


6️⃣ Run Frontend (Basic Support UI)
- From project root:
python -m http.server 3000 --directory frontend-simple

- Frontend runs at:
http://localhost:3000/login.html


🔐 Features Implemented

1️⃣ Authentication

- User registration with hashed passwords
- Login with JWT token generation
- /api/v1/auth/me endpoint to retrieve current user

2️⃣ Role-Based Access Control

- Default role: user
- Admin role supported
- Only admin can delete items
- Owner or admin can edit items

3️⃣ CRUD – Items

Endpoints:
- POST /api/v1/items/
- GET /api/v1/items/
- PUT /api/v1/items/{id}
- DELETE /api/v1/items/{id}

🗄 Database Schema

Users Table
- id
- email (unique)
- hashed_password
- full_name
- role
- is_active

Items Table
- id
- title
- description
- owner_id (FK → users.id)

🧪 How to Test
1.Register a new user
2.Login to obtain JWT
3.Access /api/v1/auth/me
4.Create items
5.Login as admin to test delete functionality
6.Verify database entries using:
-SELECT * FROM users;
-SELECT * FROM items;

🔐 Security Considerations

Passwords are hashed using Passlib.
- JWT authentication protects private endpoints.
- CORS restricted to development origins.
- Token stored in localStorage for demo simplicity.
Production improvements:
- Store tokens in HttpOnly cookies
- Implement refresh tokens
- Add rate limiting

🚀 Scalability Approach
To scale this system:
1.Use Alembic for proper database migrations.
2.Deploy backend behind a reverse proxy (NGINX).
3.Use managed PostgreSQL (AWS RDS / Render / Railway).
4.Add Redis for caching frequent queries.
5.Containerize using Docker.
6.Horizontal scaling via load balancer.
7.Separate auth service if user base grows  significantly.

📑 API Documentation
Swagger UI available at:
- /docs
Postman collection can be generated from Swagger if required.

📧 Submission
This repository contains:
- Complete backend implementation
- Basic frontend UI
- PostgreSQL schema
- API documentation
- Scalability explanation
Submitted as part of the Primetrade Backend Developer (Intern) assignment.
