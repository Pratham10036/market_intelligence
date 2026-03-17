import uuid
import logging

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.auth import SignupRequest
from app.services.auth import hash_password

logger = logging.getLogger(__name__)


def create_user(db: Session, data: SignupRequest) -> User:
    user = User(
        name=data.name,
        email=data.email.lower(),
        hashed_password=hash_password(data.password),
    )
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
        logger.info("User created: %s", user.email)
        return user
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email.lower()).first()


def get_user_by_id(db: Session, user_id: uuid.UUID) -> User | None:
    return db.query(User).filter(User.id == user_id).first()
