# XChart Backend API

FastAPI backend for XChart — Solar Analytics & Industrial Intelligence platform.

## Tech Stack

- **FastAPI** — async web framework
- **PostgreSQL** — relational database
- **SQLAlchemy 2.0** — ORM with connection pooling
- **Alembic** — database migrations
- **JWT** — access + refresh token authentication
- **Passlib + bcrypt** — password hashing

## Setup

### Prerequisites

- Python 3.11+
- PostgreSQL running locally
- A database named `xchart` created in PostgreSQL

```bash
# Create the database (run in psql or pgAdmin)
CREATE DATABASE xchart;
```

### Installation

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Environment Variables

Copy the example env file and update values:

```bash
cp .env.example .env
```

Edit `.env` and set your `JWT_SECRET_KEY` to a random string:

```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/xchart
JWT_SECRET_KEY=your-random-64-character-secret-key-here
```

### Database Migration

```bash
# Run migrations to create tables
alembic upgrade head
```

### Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/login` | No | Login → tokens |
| POST | `/api/auth/refresh` | No | Refresh tokens |
| GET | `/api/users/me` | Yes | Current user profile |

## Example API Requests

### Signup

```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "securepass123"}'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "securepass123"}'
```

### Get Current User

```bash
curl http://localhost:8000/api/users/me \
  -H "Authorization: Bearer <access_token>"
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john@example.com",
  "is_active": true,
  "created_at": "2026-03-17T12:00:00Z"
}
```

### Refresh Token

```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "<refresh_token>"}'
```

## Project Structure

```
backend/
├── alembic/              # Database migrations
├── app/
│   ├── main.py           # FastAPI app entry point
│   ├── config.py         # Environment settings
│   ├── database.py       # SQLAlchemy engine & session
│   ├── dependencies.py   # FastAPI dependencies (auth, db)
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic request/response schemas
│   ├── routes/           # API route handlers
│   ├── services/         # Business logic
│   └── middleware/       # Rate limiting
├── .env.example
└── requirements.txt
```
