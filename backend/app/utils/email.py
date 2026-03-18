import logging
import re
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

from app.config import settings

logger = logging.getLogger(__name__)

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "templates"


def send_templated_email(
    template_name: str,
    to: list[str],
    context: dict,
) -> dict:
    """
    Send a templated email. Returns {"isSuccess": bool, "error": str | None}.

    Templates are loaded from app/templates/<template_name>/:
        - subject.txt  — single-line subject
        - body.html    — HTML body with {{ variable }} placeholders
    """
    try:
        subject, body = _render_template(template_name, context)

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.SMTP_FROM_EMAIL
        msg["To"] = ", ".join(to)
        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM_EMAIL, to, msg.as_string())

        logger.info("Email sent successfully to %s (template=%s)", to, template_name)
        return {"isSuccess": True, "error": None}

    except Exception as e:
        logger.error("Failed to send email to %s: %s", to, str(e))
        return {"isSuccess": False, "error": str(e)}


def _render_template(template_name: str, context: dict) -> tuple[str, str]:
    """
    Load subject.txt and body.html from app/templates/<template_name>/,
    replace {{ key }} placeholders with values from context.
    Returns (subject, html_body).
    """
    template_dir = TEMPLATES_DIR / template_name

    subject_path = template_dir / "subject.txt"
    body_path = template_dir / "body.html"

    if not subject_path.exists() or not body_path.exists():
        raise ValueError(
            f"Template '{template_name}' not found. "
            f"Expected files at {subject_path} and {body_path}"
        )

    subject = subject_path.read_text(encoding="utf-8").strip()
    body = body_path.read_text(encoding="utf-8")

    # Replace {{ key }} placeholders with context values
    for key, value in context.items():
        body = re.sub(r"\{\{\s*" + re.escape(key) + r"\s*\}\}", str(value), body)
        subject = re.sub(r"\{\{\s*" + re.escape(key) + r"\s*\}\}", str(value), subject)

    return subject, body
