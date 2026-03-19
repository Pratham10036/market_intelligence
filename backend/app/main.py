import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.middleware.rate_limit import RateLimitMiddleware
from app.routes.auth import router as auth_router
from app.routes.user import router as user_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="XChart API",
    description="Backend API for XChart — Solar Analytics & Industrial Intelligence",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Rate limiting middleware
app.add_middleware(RateLimitMiddleware)

# Include routers
app.include_router(auth_router)
app.include_router(user_router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    # Build a readable message from the first validation error
    first = errors[0] if errors else {}
    field = " -> ".join(str(loc) for loc in first.get("loc", [])[1:])  # skip "body"
    msg = first.get("msg", "Validation error")
    error_message = f"{field}: {msg}" if field else msg
    return JSONResponse(
        status_code=422,
        content={"isSuccess": False, "data": None, "error": error_message},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"isSuccess": False, "data": None, "error": exc.detail},
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"isSuccess": False, "data": None, "error": "Internal server error"},
    )


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
