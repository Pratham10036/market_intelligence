ERROR_MESSAGES = {
    # Signup
    "USER_SIGNUP_MISSING_FIELDS": "Full name, email, and password are required.",
    "USER_SIGNUP_INVALID_EMAIL": "Please provide a valid email address.",
    "USER_SIGNUP_USER_WITH_EMAIL_EXISTS": "A user with this email already exists.",
    "USER_EMAIL_VERIFICATION_OTP_EMAIL_FAILED": "Failed to send verification email. Please try again.",
    # Email verification - send OTP
    "EMAIL_REQUIRED": "Email is required.",
    "INVALID_EMAIL": "Please provide a valid email address.",
    "USER_NOT_FOUND": "User not found.",
    "EMAIL_ALREADY_VERIFIED": "Email is already verified.",
    "OTP_RESEND_RATE_LIMITED": "Please wait before requesting a new OTP.",
    # Email verification - verify OTP
    "EMAIL_AND_OTP_REQUIRED": "Email and OTP are required.",
    "OTP_NOT_FOUND": "No active OTP found. Please request a new one.",
    "OTP_EXPIRED": "OTP has expired. Please request a new one.",
    "OTP_MAX_ATTEMPTS_EXCEEDED": "Maximum OTP attempts exceeded. Please request a new one.",
    "INVALID_OTP": "Invalid OTP.",
    # Login
    "USER_LOGIN_MISSING_FIELDS": "Email and password are required.",
    "USER_LOGIN_INVALID_EMAIL_OR_PASSWORD": "Invalid email or password.",
    "USER_LOGIN_EMAIL_NOT_VERIFIED": "Please verify your email before logging in.",
    "USER_LOGIN_OTP_EMAIL_FAILED": "Failed to send login OTP email. Please try again.",
    # Logout
    "INVALID_OR_EXPIRED_ACCESS_TOKEN": "Invalid or expired access token.",
}
