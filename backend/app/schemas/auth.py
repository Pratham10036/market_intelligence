import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class SignupRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class SignupUserData(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    email_verified: bool
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SignupResponse(BaseModel):
    isSuccess: bool
    data: SignupUserData | None = None
    error: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


# Email verification OTP - Send
class OtpSendRequest(BaseModel):
    email: EmailStr


class OtpSendResponse(BaseModel):
    isSuccess: bool
    data: dict | None = None
    error: str | None = None


# Email verification OTP - Verify
class OtpVerifyRequest(BaseModel):
    email: EmailStr
    otp: str


class OtpVerifyResponse(BaseModel):
    isSuccess: bool
    data: dict | None = None
    error: str | None = None


# Login OTP - Send
class LoginOtpSendRequest(BaseModel):
    email: EmailStr
    password: str


# Login OTP - Verify
class LoginOtpVerifyRequest(BaseModel):
    email: EmailStr
    otp: str
