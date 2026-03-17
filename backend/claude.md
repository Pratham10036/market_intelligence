# XChart Backend — API Documentation

## Project Overview

**XChart** is a Solar Analytics & Industrial Intelligence platform. This is the backend API built with **FastAPI** (Python), providing user authentication (JWT-based) and user management endpoints. The project follows a clean layered architecture: Routes → Services → Models, with Pydantic schemas for request/response validation.

---

## Tech Stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Framework        | FastAPI 0.115.6                         |
| ASGI Server      | Uvicorn 0.34.0                          |
| Language         | Python 3.11+                            |
| Database         | PostgreSQL                              |
| ORM              | SQLAlchemy 2.0.36                       |
| Migrations       | Alembic 1.14.1                          |
| Auth             | JWT (python-jose) + bcrypt (passlib)    |
| Validation       | Pydantic v2 + pydantic-settings         |
| Environment      | python-dotenv                           |

---

## Folder Structure

```
backend/
├── .env.example          # Environment variable template
├── requirements.txt      # Python dependencies
├── alembic.ini           # Alembic migration configuration
├── alembic/
│   ├── env.py            # Migration environment setup
│   ├── script.py.mako    # Migration script template
│   └── versions/         # Migration files (auto-generated)
└── app/
    ├── __init__.py
    ├── main.py            # FastAPI app entry point
    ├── config.py          # Settings via pydantic-settings
    ├── database.py        # SQLAlchemy engine & session
    ├── dependencies.py    # Auth dependency (get_current_user)
    ├── middleware/
    │   └── rate_limit.py  # Per-IP rate limiting middleware
    ├── models/
    │   └── user.py        # SQLAlchemy User model
    ├── routes/
    │   ├── auth.py        # /api/auth/* endpoints
    │   └── user.py        # /api/users/* endpoints
    ├── schemas/
    │   ├── auth.py        # Auth request/response schemas
    │   └── user.py        # User response schema
    └── services/
        ├── auth.py        # Password hashing, JWT creation
        └── user.py        # User CRUD operations
```

---

## Setup Instructions

### Prerequisites

- **Python 3.11+** installed
- **PostgreSQL** running (locally or remote)
- A database created (default name: `xchart`)

### Step 1 — Create Virtual Environment

```bash
cd backend
python -m venv venv
```

Activate:

```bash
# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

**What this does:** Creates an isolated Python environment so project dependencies don't conflict with system packages.

### Step 2 — Install Dependencies

```bash
pip install -r requirements.txt
```

**What this does:** Installs all required packages — FastAPI, SQLAlchemy, Uvicorn, JWT libraries, etc.

### Step 3 — Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values (see Environment Variables section below).

### Step 4 — Create the Database

Ensure PostgreSQL is running, then create the database:

```sql
CREATE DATABASE xchart;
```

Or via CLI:

```bash
createdb xchart
```

### Step 5 — Run Database Migrations

```bash
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

**What this does:**
- `revision --autogenerate` — Generates migration files by comparing models to current DB state.
- `upgrade head` — Applies all pending migrations, creating tables in the database.

**Note:** The `alembic/versions/` directory is currently empty. You must generate the initial migration before running `upgrade head`.

### Step 6 — Start Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**What this does:** Starts the FastAPI server on `http://localhost:8000` with hot-reload enabled. Any code changes auto-restart the server.

**API docs available at:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Environment Variables

| Variable                     | Default                                          | Description                                     |
| ---------------------------- | ------------------------------------------------ | ----------------------------------------------- |
| `DATABASE_URL`               | `postgresql://postgres:postgres@localhost:5432/xchart` | PostgreSQL connection string                   |
| `JWT_SECRET_KEY`             | `change-me-to-a-random-64-char-string`           | Secret for signing JWTs — **must change in prod** |
| `ACCESS_TOKEN_EXPIRE_MINUTES`| `30`                                             | Access token lifetime in minutes                |
| `REFRESH_TOKEN_EXPIRE_DAYS`  | `7`                                              | Refresh token lifetime in days                  |
| `CORS_ORIGINS`               | `["http://localhost:5173"]`                      | Allowed frontend origins (JSON array)           |
| `RATE_LIMIT_REQUESTS`        | `60`                                             | Max requests per window (general endpoints)     |
| `RATE_LIMIT_WINDOW_SECONDS`  | `60`                                             | Rate limit window in seconds                    |

---

## How to Run in Production

```bash
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Key differences from development:**
- No `--reload` flag (disables hot-reload for stability)
- `--workers 4` spawns multiple worker processes for concurrency
- Set a strong `JWT_SECRET_KEY` in `.env`
- Set `CORS_ORIGINS` to your actual frontend domain

---

## Database Setup

### ORM: SQLAlchemy 2.0

The project uses SQLAlchemy's modern mapped column syntax with `DeclarativeBase`. Connection pooling is configured with:
- Pool size: 10 connections
- Max overflow: 20 additional connections
- Pre-ping: enabled (tests connections before use)
- Recycle: every 3600 seconds

### Current Model: `User`

| Column          | Type              | Notes                           |
| --------------- | ----------------- | ------------------------------- |
| `id`            | UUID (PK)         | Auto-generated UUID4            |
| `name`          | String(255)       | Required                        |
| `email`         | String(255)       | Unique, indexed, case-insensitive lookup |
| `hashed_password`| String(255)      | bcrypt hash                     |
| `is_active`     | Boolean           | Default: `True`                 |
| `created_at`    | DateTime (tz)     | Server-generated timestamp      |
| `updated_at`    | DateTime (tz)     | Auto-updated on changes         |

### Common Migration Commands

```bash
# Generate a new migration after model changes
alembic revision --autogenerate -m "describe change"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history
```

---

## API Endpoints

### Health

| Method | Path            | Auth     | Description        |
| ------ | --------------- | -------- | ------------------ |
| GET    | `/api/health`   | None     | Health check       |

### Authentication

| Method | Path                | Auth     | Description                          |
| ------ | ------------------- | -------- | ------------------------------------ |
| POST   | `/api/auth/signup`  | None     | Register new user, returns tokens    |
| POST   | `/api/auth/login`   | None     | Login with email/password            |
| POST   | `/api/auth/refresh` | None     | Exchange refresh token for new tokens|

### Users

| Method | Path              | Auth     | Description                    |
| ------ | ----------------- | -------- | ------------------------------ |
| GET    | `/api/users/me`   | Bearer   | Get current user profile       |

### Auth Flow

1. **Signup/Login** → Returns `access_token` + `refresh_token`
2. **Authenticated requests** → Send `Authorization: Bearer <access_token>` header
3. **Token expired** → Call `/api/auth/refresh` with the refresh token to get new tokens

---

## Architecture Notes

### Layered Architecture

```
Request → Middleware (CORS, Rate Limit) → Route → Service → Model/DB
                                            ↓
                                         Schema (validation)
```

- **Routes** (`app/routes/`): Define API endpoints, handle HTTP concerns, call services.
- **Services** (`app/services/`): Business logic — password hashing, JWT creation, user CRUD.
- **Models** (`app/models/`): SQLAlchemy ORM models defining database tables.
- **Schemas** (`app/schemas/`): Pydantic models for request validation and response serialization.
- **Dependencies** (`app/dependencies.py`): FastAPI dependency injection — DB sessions, auth guard.
- **Middleware** (`app/middleware/`): Request-level processing — rate limiting.

### Authentication

- Passwords hashed with **bcrypt** via passlib
- JWTs signed with **HS256** algorithm
- Access tokens: 30-minute expiry, type `"access"`
- Refresh tokens: 7-day expiry, type `"refresh"`
- Token validation checks type, expiry, and user existence/active status

### Rate Limiting

- In-memory per-IP tracking (resets on server restart)
- Auth endpoints (`/api/auth/login`, `/api/auth/signup`): **10 requests/minute**
- All other endpoints: **60 requests/minute** (configurable)
- Returns `429 Too Many Requests` when exceeded

### Error Handling

- Global exception handler catches unhandled errors → returns `500 Internal Server Error`
- Structured logging with timestamps and severity levels
- Specific HTTP errors: `401` (auth), `409` (duplicate email), `429` (rate limit)

---

## Conventions

- **Email handling**: All emails lowercased before storage and lookup
- **UUID primary keys**: All entities use UUID4, not auto-increment integers
- **Timezone-aware timestamps**: All datetime columns use `timezone=True`
- **Structured logging**: Format `%(asctime)s | %(levelname)-8s | %(name)s | %(message)s`
- **Password validation**: Minimum 8 characters, maximum 128
- **Name validation**: Minimum 2 characters, maximum 100
- **API prefix**: All routes prefixed with `/api/`

---

## Common Issues & Troubleshooting

| Issue | Solution |
| ----- | -------- |
| `psycopg2` install fails | Install PostgreSQL dev headers: `apt install libpq-dev` (Linux) or use `psycopg2-binary` (already in requirements) |
| `alembic upgrade head` fails with "No migrations" | Run `alembic revision --autogenerate -m "initial"` first |
| Connection refused to PostgreSQL | Ensure PostgreSQL is running and `DATABASE_URL` is correct |
| `ModuleNotFoundError` | Ensure virtual environment is activated |
| CORS errors from frontend | Add your frontend URL to `CORS_ORIGINS` in `.env` |
| `JWT_SECRET_KEY` warning | Replace the default key with a random 64-character string for production |
