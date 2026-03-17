import time
from collections import defaultdict

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.config import settings

# Stricter limit for auth endpoints
AUTH_PATHS = {"/api/auth/login", "/api/auth/signup"}
AUTH_RATE_LIMIT = 10


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.requests: dict[str, list[float]] = defaultdict(list)

    def _clean_old_requests(self, key: str, window: int) -> None:
        now = time.time()
        self.requests[key] = [
            t for t in self.requests[key] if now - t < window
        ]

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        path = request.url.path
        window = settings.RATE_LIMIT_WINDOW_SECONDS

        # Determine rate limit based on path
        if path in AUTH_PATHS:
            key = f"{client_ip}:{path}"
            limit = AUTH_RATE_LIMIT
        else:
            key = client_ip
            limit = settings.RATE_LIMIT_REQUESTS

        self._clean_old_requests(key, window)

        if len(self.requests[key]) >= limit:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."},
            )

        self.requests[key].append(time.time())
        return await call_next(request)
