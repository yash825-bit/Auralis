from email.message import EmailMessage
import smtplib
import ssl

from core.config import settings
from schemas.contact import ContactRequest


def _build_contact_message(data: ContactRequest, recipient: str) -> EmailMessage:
    message = EmailMessage()
    message["Subject"] = f"Auralis Contact Form: {data.subject}"
    message["From"] = settings.SMTP_USERNAME or "no-reply@auralis.local"
    message["To"] = recipient

    body = (
        "You have received a new message from the Auralis contact form.\n\n"
        f"Name: {data.name}\n"
        f"Email: {data.email}\n"
        f"Subject: {data.subject}\n\n"
        "Message:\n"
        f"{data.message}\n"
    )

    message.set_content(body)
    return message


def send_contact_email(data: ContactRequest) -> None:
    recipient = settings.CONTACT_RECIPIENT_EMAIL or settings.SMTP_USERNAME

    if not all(
        [
            settings.SMTP_HOST,
            settings.SMTP_PORT,
            settings.SMTP_USERNAME,
            settings.SMTP_PASSWORD,
            recipient,
        ]
    ):
        raise ValueError("SMTP settings are not fully configured.")

    email_message = _build_contact_message(data, recipient=recipient)

    if settings.SMTP_USE_TLS and settings.SMTP_PORT != 465:
        context = ssl.create_default_context()
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(email_message)
    else:
        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(email_message)

