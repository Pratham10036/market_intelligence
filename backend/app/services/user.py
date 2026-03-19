import uuid
import logging
from datetime import datetime, timedelta, timezone

from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func

from app.models.user import User
from app.models.otp import UserOtpVerification
from app.schemas.auth import SignupRequest
from app.services.auth import hash_password, verify_password
from app.models.token import RevokedToken
from app.utils.otp import generate_verification_token, generate_otp
from app.utils.email import send_templated_email
from app.services.auth import create_access_token, create_refresh_token, decode_token
from app.config import settings
from app.constants.error_messages import ERROR_MESSAGES

logger = logging.getLogger(__name__)


def create_user(db: Session, data: SignupRequest) -> User | JSONResponse:
    logger.info("User signup request received")

    email = data.email.strip().lower()
    logger.debug("Email validated successfully: %s", email)

    # Check for existing active user with this email
    existing_user = (
        db.query(User)
        .filter(User.email == email, User.is_active == True)
        .first()
    )
    if existing_user:
        logger.warning("Signup failed: Email already exists [%s]", email)
        return JSONResponse(
            status_code=409,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["USER_SIGNUP_USER_WITH_EMAIL_EXISTS"]},
        )

    # Create user
    try:
        user = User(
            name=data.name,
            email=email,
            hashed_password=hash_password(data.password),
        )
        db.add(user)
        db.flush()
        logger.info("User created successfully [user_id=%s]", user.id)
    except IntegrityError:
        db.rollback()
        logger.warning("Signup failed: Duplicate email [%s]", email)
        return JSONResponse(
            status_code=409,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["USER_SIGNUP_USER_WITH_EMAIL_EXISTS"]},
        )

    # Generate email verification OTP
    otp = generate_verification_token()
    otp_record = UserOtpVerification(
        user_id=user.id,
        otp_hash=hash_password(otp),
        otp_type="EMAIL_VERIFICATION",
        target=email,
        expires_at=sql_func.now() + timedelta(minutes=2),
    )
    db.add(otp_record)
    logger.info("Email verification OTP generated for user_id=%s", user.id)

    # Send verification email
    frontend_url = settings.FRONTEND_URL
    verification_link = f"{frontend_url}/verify-email?verificationToken={otp}&email={email}"

    email_resp = send_templated_email(
        template_name="email_verification_otp",
        to=[email],
        context={
            "user_name": user.name,
            "verification_link": verification_link,
        },
    )

    if not email_resp["isSuccess"]:
        logger.error(
            "Email verification OTP email failed for %s: %s",
            email,
            email_resp["error"],
        )
        db.rollback()
        return JSONResponse(
            status_code=500,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["USER_EMAIL_VERIFICATION_OTP_EMAIL_FAILED"]},
        )

    db.commit()
    db.refresh(user)
    logger.info("Verification email sent to %s", email)

    return user


def send_email_verification_otp(db: Session, email: str) -> JSONResponse:
    """Send email verification OTP to the user."""
    logger.info("Email verification OTP send request received")

    email = email.strip().lower()

    # Fetch user
    user = db.query(User).filter(User.email == email, User.is_active == True).first()
    if not user:
        logger.warning("OTP send failed: User not found [%s]", email)
        return JSONResponse(
            status_code=200,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["USER_NOT_FOUND"]},
        )

    # Already verified?
    if user.email_verified:
        logger.info("OTP send skipped: Email already verified [user_id=%s]", user.id)
        return JSONResponse(
            status_code=200,
            content={"isSuccess": False, "data": {"email": user.email, "email_verified": True}, "error": ERROR_MESSAGES["EMAIL_ALREADY_VERIFIED"]},
        )

    # Rate limit check (2 minutes cooldown)
    last_otp = (
        db.query(UserOtpVerification)
        .filter(
            UserOtpVerification.user_id == user.id,
            UserOtpVerification.otp_type == "EMAIL_VERIFICATION",
            UserOtpVerification.active == True,
        )
        .order_by(UserOtpVerification.created_at.desc())
        .first()
    )

    if last_otp:
        elapsed_seconds = (datetime.now(timezone.utc) - last_otp.created_at).total_seconds()
        cooldown_seconds = 2 * 60

        if elapsed_seconds < cooldown_seconds:
            remaining_seconds = int(cooldown_seconds - elapsed_seconds)
            remaining_minutes = (remaining_seconds + 59) // 60

            logger.warning(
                "OTP resend rate-limited [user_id=%s, wait=%ss]",
                user.id,
                remaining_seconds,
            )
            return JSONResponse(
                status_code=429,
                content={
                    "isSuccess": False,
                    "data": {
                        "email": email,
                        "retry_after_seconds": remaining_seconds,
                        "retry_after_minutes": remaining_minutes,
                    },
                    "error": ERROR_MESSAGES["OTP_RESEND_RATE_LIMITED"],
                },
            )

    # Deactivate previous OTPs
    db.query(UserOtpVerification).filter(
        UserOtpVerification.user_id == user.id,
        UserOtpVerification.otp_type == "EMAIL_VERIFICATION",
        UserOtpVerification.active == True,
    ).update({"active": False})
    logger.info("Previous email OTPs deactivated [user_id=%s]", user.id)

    # Generate new OTP
    otp = generate_verification_token()
    otp_record = UserOtpVerification(
        user_id=user.id,
        otp_hash=hash_password(otp),
        otp_type="EMAIL_VERIFICATION",
        target=email,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=2),
        active=True,
    )
    db.add(otp_record)
    logger.info("New email verification OTP generated [user_id=%s]", user.id)

    # Send OTP email
    frontend_url = settings.FRONTEND_URL
    verification_link = f"{frontend_url}/verify-email?verificationToken={otp}&email={email}"

    email_resp = send_templated_email(
        template_name="email_verification_otp",
        to=[email],
        context={
            "user_name": user.name,
            "verification_link": verification_link,
        },
    )

    if not email_resp["isSuccess"]:
        logger.error(
            "Email verification OTP email failed for %s: %s",
            email,
            email_resp["error"],
        )
        db.rollback()
        return JSONResponse(
            status_code=500,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["USER_EMAIL_VERIFICATION_OTP_EMAIL_FAILED"]},
        )

    db.commit()
    logger.info("Verification OTP email sent to %s", email)

    return JSONResponse(
        status_code=200,
        content={"isSuccess": True, "data": {"email": email, "otp_sent": True, "expires_in_minutes": 2}, "error": None},
    )


def verify_email_otp(db: Session, email: str, otp: str) -> JSONResponse:
    """Verify email OTP and mark user email as verified."""
    logger.info("Email verification OTP verify request received")

    email = email.strip().lower()

    # Fetch user
    user = db.query(User).filter(User.email == email, User.is_active == True).first()
    if not user:
        logger.warning("OTP verify failed: User not found [%s]", email)
        return JSONResponse(
            status_code=200,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["USER_NOT_FOUND"]},
        )

    # Already verified?
    if user.email_verified:
        logger.info("OTP verify skipped: Email already verified [user_id=%s]", user.id)
        return JSONResponse(
            status_code=200,
            content={"isSuccess": False, "data": {"email": user.email, "email_verified": True}, "error": ERROR_MESSAGES["EMAIL_ALREADY_VERIFIED"]},
        )

    # Fetch active OTP
    otp_record = (
        db.query(UserOtpVerification)
        .filter(
            UserOtpVerification.user_id == user.id,
            UserOtpVerification.otp_type == "EMAIL_VERIFICATION",
            UserOtpVerification.active == True,
        )
        .order_by(UserOtpVerification.created_at.desc())
        .first()
    )

    if not otp_record:
        logger.warning("OTP verify failed: No active OTP [user_id=%s]", user.id)
        return JSONResponse(
            status_code=200,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["OTP_NOT_FOUND"]},
        )

    # Expiry check
    if otp_record.expires_at < datetime.now(timezone.utc):
        otp_record.active = False
        db.commit()
        logger.warning("OTP expired [user_id=%s]", user.id)
        return JSONResponse(
            status_code=200,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["OTP_EXPIRED"]},
        )

    # Attempt limit check
    if otp_record.attempt_count >= otp_record.max_attempts:
        otp_record.active = False
        db.commit()
        logger.warning(
            "OTP max attempts exceeded [user_id=%s, attempts=%s]",
            user.id,
            otp_record.attempt_count,
        )
        return JSONResponse(
            status_code=403,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["OTP_MAX_ATTEMPTS_EXCEEDED"]},
        )

    # OTP match check
    if not verify_password(otp, otp_record.otp_hash):
        otp_record.attempt_count += 1
        db.commit()
        logger.warning(
            "Invalid OTP attempt [user_id=%s, attempts=%s]",
            user.id,
            otp_record.attempt_count,
        )
        return JSONResponse(
            status_code=400,
            content={"isSuccess": False, "data": {"remaining_attempts": otp_record.max_attempts - otp_record.attempt_count}, "error": ERROR_MESSAGES["INVALID_OTP"]},
        )

    # SUCCESS — Verify email
    user.email_verified = True
    otp_record.active = False
    otp_record.verified_at = datetime.now(timezone.utc)
    db.commit()

    logger.info("Email verified successfully [user_id=%s]", user.id)

    return JSONResponse(
        status_code=200,
        content={"isSuccess": True, "data": {"email": user.email, "email_verified": True}, "error": None},
    )


def send_login_otp(db: Session, email: str, password: str) -> JSONResponse:
    """Login step 1: validate credentials, send login OTP."""
    logger.info("Login OTP send request received")

    email = email.strip().lower()

    # Fetch user
    user = db.query(User).filter(User.email == email, User.is_active == True).first()
    if not user:
        logger.warning("Login OTP send failed: User not found [%s]", email)
        return JSONResponse(
            status_code=401,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["USER_LOGIN_INVALID_EMAIL_OR_PASSWORD"]},
        )

    # Email verified?
    if not user.email_verified:
        logger.warning("Login OTP send failed: Email not verified [user_id=%s]", user.id)
        return JSONResponse(
            status_code=200,
            content={
                "isSuccess": False,
                "data": {
                    "user_id": str(user.id),
                    "email": user.email,
                    "email_verified": user.email_verified,
                },
                "error": ERROR_MESSAGES["USER_LOGIN_EMAIL_NOT_VERIFIED"],
            },
        )

    # Password check
    if not verify_password(password, user.hashed_password):
        logger.warning("Login OTP send failed: Invalid password [%s]", email)
        return JSONResponse(
            status_code=401,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["USER_LOGIN_INVALID_EMAIL_OR_PASSWORD"]},
        )

    # Rate limit check (2 minutes cooldown)
    last_otp = (
        db.query(UserOtpVerification)
        .filter(
            UserOtpVerification.user_id == user.id,
            UserOtpVerification.otp_type == "LOGIN",
            UserOtpVerification.active == True,
        )
        .order_by(UserOtpVerification.created_at.desc())
        .first()
    )

    if last_otp:
        elapsed_seconds = (datetime.now(timezone.utc) - last_otp.created_at).total_seconds()
        cooldown_seconds = 2 * 60

        if elapsed_seconds < cooldown_seconds:
            remaining_seconds = int(cooldown_seconds - elapsed_seconds)
            remaining_minutes = (remaining_seconds + 59) // 60

            logger.warning(
                "Login OTP resend rate-limited [user_id=%s, wait=%ss]",
                user.id,
                remaining_seconds,
            )
            return JSONResponse(
                status_code=429,
                content={
                    "isSuccess": False,
                    "data": {
                        "email": email,
                        "retry_after_seconds": remaining_seconds,
                        "retry_after_minutes": remaining_minutes,
                    },
                    "error": ERROR_MESSAGES["OTP_RESEND_RATE_LIMITED"],
                },
            )

    # Deactivate previous login OTPs
    db.query(UserOtpVerification).filter(
        UserOtpVerification.user_id == user.id,
        UserOtpVerification.otp_type == "LOGIN",
        UserOtpVerification.active == True,
    ).update({"active": False})
    logger.info("Previous login OTPs deactivated [user_id=%s]", user.id)

    # Generate OTP
    otp = generate_otp()
    otp_record = UserOtpVerification(
        user_id=user.id,
        otp_hash=hash_password(otp),
        otp_type="LOGIN",
        target=email,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=2),
        active=True,
    )
    db.add(otp_record)
    logger.info("New login OTP generated [user_id=%s]", user.id)

    # Send OTP email
    email_resp = send_templated_email(
        template_name="login_otp",
        to=[email],
        context={
            "user_name": user.name,
            "otp": otp,
        },
    )

    if not email_resp["isSuccess"]:
        logger.error(
            "Login OTP email failed for %s: %s",
            email,
            email_resp["error"],
        )
        db.rollback()
        return JSONResponse(
            status_code=500,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["USER_LOGIN_OTP_EMAIL_FAILED"]},
        )

    db.commit()
    logger.info("Login OTP email sent to %s", email)

    return JSONResponse(
        status_code=200,
        content={
            "isSuccess": True,
            "data": {
                "user_id": str(user.id),
                "email": user.email,
                "otp_sent": True,
                "expires_in_minutes": 2,
            },
            "error": None,
        },
    )


def verify_login_otp(db: Session, email: str, otp: str) -> JSONResponse:
    """Login step 2: verify OTP, return JWT tokens."""
    logger.info("Login verification request received")

    email = email.strip().lower()

    # Fetch user
    user = db.query(User).filter(User.email == email, User.is_active == True).first()
    if not user:
        logger.warning("Login verify failed: User not found [%s]", email)
        return JSONResponse(
            status_code=200,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["USER_NOT_FOUND"]},
        )

    # Fetch active login OTP
    otp_record = (
        db.query(UserOtpVerification)
        .filter(
            UserOtpVerification.user_id == user.id,
            UserOtpVerification.otp_type == "LOGIN",
            UserOtpVerification.active == True,
        )
        .order_by(UserOtpVerification.created_at.desc())
        .first()
    )

    if not otp_record:
        logger.warning("Login verify failed: No active OTP [user_id=%s]", user.id)
        return JSONResponse(
            status_code=200,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["OTP_NOT_FOUND"]},
        )

    # Expiry check
    if otp_record.expires_at < datetime.now(timezone.utc):
        otp_record.active = False
        db.commit()
        logger.warning("Login OTP expired [user_id=%s]", user.id)
        return JSONResponse(
            status_code=400,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["OTP_EXPIRED"]},
        )

    # Attempt limit check
    if otp_record.attempt_count >= otp_record.max_attempts:
        otp_record.active = False
        db.commit()
        logger.warning(
            "Login OTP max attempts exceeded [user_id=%s, attempts=%s]",
            user.id,
            otp_record.attempt_count,
        )
        return JSONResponse(
            status_code=403,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["OTP_MAX_ATTEMPTS_EXCEEDED"]},
        )

    # OTP match check
    if not verify_password(otp, otp_record.otp_hash):
        otp_record.attempt_count += 1
        db.commit()
        logger.warning(
            "Invalid login OTP attempt [user_id=%s, attempts=%s]",
            user.id,
            otp_record.attempt_count,
        )
        return JSONResponse(
            status_code=400,
            content={
                "isSuccess": False,
                "data": {"remaining_attempts": otp_record.max_attempts - otp_record.attempt_count},
                "error": ERROR_MESSAGES["INVALID_OTP"],
            },
        )

    # SUCCESS — Generate tokens
    user.last_login_at = datetime.now(timezone.utc)
    otp_record.active = False
    otp_record.verified_at = datetime.now(timezone.utc)

    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))

    db.commit()

    logger.info("Login successful [user_id=%s]", user.id)

    return JSONResponse(
        status_code=200,
        content={
            "isSuccess": True,
            "data": {
                "user": {
                    "id": str(user.id),
                    "name": user.name,
                    "email": user.email,
                    "email_verified": user.email_verified,
                    "is_active": user.is_active,
                    "last_login_at": user.last_login_at.isoformat() if user.last_login_at else None,
                },
                "access_token": access_token,
                "refresh_token": refresh_token,
            },
            "error": None,
        },
    )


def logout_user(db: Session, token: str, user: User) -> JSONResponse:
    """Revoke access token and its associated refresh token."""
    logger.info("Logout request received [user_id=%s]", user.id)

    payload = decode_token(token)
    jti = payload.get("jti")

    if not jti:
        logger.warning("Logout failed: Token has no jti [user_id=%s]", user.id)
        return JSONResponse(
            status_code=401,
            content={"isSuccess": False, "data": None, "error": ERROR_MESSAGES["INVALID_OR_EXPIRED_ACCESS_TOKEN"]},
        )

    # Revoke the access token
    revoked = RevokedToken(
        jti=jti,
        user_id=user.id,
        expires_at=datetime.fromtimestamp(payload["exp"], tz=timezone.utc),
    )
    db.add(revoked)
    db.commit()

    logger.info("User logged out successfully [user_id=%s]", user.id)

    return JSONResponse(
        status_code=200,
        content={
            "isSuccess": True,
            "data": {"logged_out": True},
            "error": None,
        },
    )


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email.lower()).first()


def get_user_by_id(db: Session, user_id: uuid.UUID) -> User | None:
    return db.query(User).filter(User.id == user_id).first()
