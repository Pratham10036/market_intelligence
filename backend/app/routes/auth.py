import logging
import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.auth import (
    LoginOtpSendRequest,
    LoginOtpVerifyRequest,
    LoginRequest,
    OtpSendRequest,
    OtpVerifyRequest,
    RefreshRequest,
    SignupRequest,
    SignupResponse,
    SignupUserData,
    TokenResponse,
)
from app.services.auth import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from app.services.user import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    logout_user,
    send_email_verification_otp,
    send_login_otp,
    verify_email_otp,
    verify_login_otp,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ──────────────────────────────────────────────
# Signup
# ──────────────────────────────────────────────
@router.post("/signup", status_code=201)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    try:
        result = create_user(db, data)

        if isinstance(result, JSONResponse):
            return result

        return JSONResponse(
            status_code=201,
            content=SignupResponse(
                isSuccess=True,
                data=SignupUserData.model_validate(result),
                error=None,
            ).model_dump(mode="json"),
        )

    except Exception as e:
        logger.exception("Unexpected error during signup")
        return JSONResponse(
            status_code=500,
            content={"isSuccess": False, "data": None, "error": str(e)},
        )


# ──────────────────────────────────────────────
# Email Verification
# ──────────────────────────────────────────────
@router.post("/email-verification/send")
def email_verification_send(data: OtpSendRequest, db: Session = Depends(get_db)):
    try:
        return send_email_verification_otp(db, data.email)
    except Exception as e:
        logger.exception("Unexpected error while sending email verification OTP")
        return JSONResponse(
            status_code=500,
            content={"isSuccess": False, "data": None, "error": str(e)},
        )


@router.post("/email-verification/verify")
def email_verification_verify(data: OtpVerifyRequest, db: Session = Depends(get_db)):
    try:
        return verify_email_otp(db, data.email, data.otp)
    except Exception as e:
        logger.exception("Unexpected error during email OTP verification")
        return JSONResponse(
            status_code=500,
            content={"isSuccess": False, "data": None, "error": str(e)},
        )


# ──────────────────────────────────────────────
# Login (OTP-based 2-step)
# ──────────────────────────────────────────────
@router.post("/login/send-otp")
def login_otp_send(data: LoginOtpSendRequest, db: Session = Depends(get_db)):
    try:
        return send_login_otp(db, data.email, data.password)
    except Exception as e:
        logger.exception("Unexpected error during login OTP send")
        return JSONResponse(
            status_code=500,
            content={"isSuccess": False, "data": None, "error": str(e)},
        )


@router.post("/login/verify-otp")
def login_otp_verify(data: LoginOtpVerifyRequest, db: Session = Depends(get_db)):
    try:
        return verify_login_otp(db, data.email, data.otp)
    except Exception as e:
        logger.exception("Unexpected error during login OTP verification")
        return JSONResponse(
            status_code=500,
            content={"isSuccess": False, "data": None, "error": str(e)},
        )


# ──────────────────────────────────────────────
# Logout
# ──────────────────────────────────────────────
@router.post("/logout")
def logout(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        return logout_user(db, token, current_user)
    except Exception as e:
        logger.exception("Unexpected error during logout")
        return JSONResponse(
            status_code=500,
            content={"isSuccess": False, "data": None, "error": str(e)},
        )


# ──────────────────────────────────────────────
# Simple Login (direct, no OTP)
# ──────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        logger.warning("Failed login attempt for: %s", data.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated",
        )
    logger.info("Successful login: %s", user.email)
    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


# ──────────────────────────────────────────────
# Token Refresh
# ──────────────────────────────────────────────
@router.post("/refresh", response_model=TokenResponse)
def refresh(data: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(data.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )
    user = get_user_by_id(db, uuid.UUID(payload["sub"]))
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )
