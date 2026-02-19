# Primetrade — Frontend README

## Overview

This repository contains the **Primetrade** frontend: a modern, responsive single-page application built with **React** and **Tailwind CSS**. It connects to the FastAPI backend (running separately) and implements authentication (JWT), Items CRUD, user profile, and role-based authorization (owner vs admin). The frontend is written in TypeScript and uses **React Query** for server state, caching, and mutations.

---

## Key features (implemented)

* Login / Register with JWT-based authentication (token stored in `localStorage`).
* Profile page (update `full_name`).
* Dashboard (shows a simple user summary and tasks placeholder).
* Items pages:

  * Items listing (shows items from backend).
  * Create new item (signed-in users).
  * Edit item (only the item owner / authorized publisher can edit).
  * Delete item (only admin users — admin flag is set by backend).
* Protected routes (redirect to `/login` when unauthenticated).
* Error handling and user-friendly messages for API failures.
* Scalable and modular frontend architecture (Auth context, API client, React Query, component-based UI).

---

## Tech stack

* React (Vite + TypeScript)
* Tailwind CSS
* React Router
* @tanstack/react-query (React Query) for server state & mutations
* Axios (API client)
* ESLint + TypeScript for code quality and typing

---

## How the frontend connects to the backend

* The frontend communicates with the backend API at `VITE_API_URL` (default `http://localhost:8000`).
* The axios-based API client uses the base URL `${VITE_API_URL}/api/v1`.
* On successful login the backend returns a JWT `access_token`. The token is stored in `localStorage` and attached to subsequent requests as `Authorization: Bearer <token>`.
* The frontend fetches current user data from `/api/v1/auth/me` after login (or on app boot if a token exists) and stores it in the `AuthContext`.

---

## Permissions & behavior (important)

* The logged-in user receives a JWT on login (stored in `localStorage`).
* **Items list**: shows all current items returned by backend `/api/v1/items`.
* **Create item**: allowed for any signed-in user.
* **Edit item**: allowed only for the item’s owner (publisher) or admin.
* **Delete item**: allowed only by **admin** users. (Admin users are configured on the backend. See backend docs.)
* The frontend invalidates React Query caches on successful mutations (create / update / delete) to ensure the list is up-to-date.

---

## Project layout (important files)

```
src/
 ├─ api/              # axios client, API helper functions
 ├─ lib/
 │   ├─ AuthContext.tsx   # typed AuthContext + AuthProvider
 │   └─ api.ts            # optional fetch wrappers
 ├─ pages/
 │   ├─ Login.tsx
 │   ├─ Register.tsx
 │   ├─ Dashboard.tsx
 │   ├─ Profile.tsx
 │   └─ items/
 │       ├─ ItemsList.tsx
 │       ├─ ItemNew.tsx
 │       ├─ ItemEdit.tsx
 │       └─ ItemCard.tsx
 ├─ components/
 │   ├─ Header.tsx
 │   ├─ ProtectedRoute.tsx
 │   └─ button.tsx
 └─ index.css
```

---

## Setup — dependencies & install

From the `frontend` directory:

1. Install dependencies:

```bash
npm install
```

2. Install TypeScript React types (if not already present):

```bash
npm install --save-dev @types/react @types/react-dom
```

3. Tailwind setup (if project already includes Tailwind config, this step is typically done):

```bash
# if you need to install tailwind (only if not preconfigured)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## Environment variables

Create a `.env` or `.env.local` in `frontend/` (Vite uses `VITE_` prefix):

```env
VITE_API_URL=http://localhost:8000
```

* `VITE_API_URL` — base backend host. The frontend app will call `${VITE_API_URL}/api/v1/...`. Default fallback is `http://localhost:8000` if not set.

---

## Run (development & build)

From the `frontend` folder:

* Start the backend :

```bash
npm run dev
```

* Build for production:

```bash
npm run build
```

* Preview production build:

```bash
npm run preview
```

---

## Common scripts

(Assuming the usual `package.json` scripts for Vite)

* `dev` — run the dev server
* `build` — build production assets
* `preview` — preview production build
* `lint` — run lint checks (if configured)
* `type-check` — `npx tsc --noEmit` (type-check only)

---

## API usage summary (used endpoints)

* `POST /api/v1/auth/token` — login (OAuth2 password form -> returns `{ access_token }`)
* `GET  /api/v1/auth/me` — current user profile
* `PUT  /api/v1/auth/me` — update profile (e.g., `full_name`)
* `GET  /api/v1/items` — list items
* `POST /api/v1/items` — create item (signed-in users)
* `GET  /api/v1/items/{id}` — item detail
* `PUT  /api/v1/items/{id}` — update item (owner or admin)
* `DELETE /api/v1/items/{id}` — delete item (admin only)

> The backend enforces owner/admin checks. The frontend performs additional UX-level checks (show/hide edit/delete buttons based on `user` data) but does not replace backend authorization.

---

## Error handling

* The frontend uses safe error extraction and displays readable messages:

  * `catch (err: unknown)` + helper to extract `err.response?.data?.detail || err.message` when possible.
* React Query mutation `onError`/`onSuccess` handlers show alerts, toast messages, or revalidate queries.
* Network or auth failures surface as alerts or redirect to `/login` if the token is invalid / expired.

---

## Developer notes

* **AuthContext / AuthProvider**: Auth state (user, setUser, loading, logout) is provided app-wide via `AuthContext`. On app start, if `localStorage.token` exists, the frontend calls `/auth/me` to populate `user`.
* **React Query** is used to cache items; mutations call `queryClient.invalidateQueries({ queryKey: ["items"] })` when appropriate (create/update/delete).
* **TypeScript**: All code is typed. Replaced `any` with strict types and used `unknown` in `catch` blocks to avoid unsafe `any`.
* **Casing & imports**: Keep import paths and file casing consistent (e.g., `AuthContext.tsx`) — mismatches can cause TypeScript module resolution issues on some platforms.
* **Permissions UX**: Edit buttons are shown only if the logged-in user is the owner or admin; Delete button is shown only to admin users. The backend is authoritative.

---

## What the frontend performs (quick)

* Presents the login flow and obtains JWT token on successful login.
* Fetches and displays items on the Items page.
* Allows signed-in users to create items.
* Allows the authorized publisher (owner) to edit their item.
* Allows admin users (configured in backend) to delete items.
* Shows a simple Tasks placeholder on the Dashboard (tasks are available in the backend but frontend currently shows task-related summary/placeholder).

---

## Notes about admin / roles

* The backend README documents how the admin user is created/assigned. The frontend recognizes the `role` field on the `user` object and exposes admin-only UI (delete operations). Deleting items client-side will only succeed if backend authorizes the request.

---

## Scalability

This project is designed to be horizontally scalable. For production we recommend:

Containerizing services and deploying behind a load-balancer with autoscaling.

Using PostgreSQL with connection pooling (PgBouncer) and proper indexes.

Using Redis for caching and as a message broker for background tasks.

Offloading long-running jobs to background workers (Celery/RQ).

Serving ML models from a separate service for independent scaling.

Implementing monitoring (Prometheus/Grafana) and structured logging.

To add a new feature: create the DB model + Alembic migration, add Pydantic schemas and CRUD, expose routers in FastAPI, add frontend API client + route + page, add tests, and update docs. Follow the checklist in /docs/DEVELOPER_GUIDE.md for more detail.
