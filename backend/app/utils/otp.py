import secrets
import random
import string


def generate_verification_token() -> str:
    return secrets.token_urlsafe(32)


def generate_otp(length: int = 6) -> str:
    """Generate a numeric OTP of given length."""
    return "".join(random.choices(string.digits, k=length))
