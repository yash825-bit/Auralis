from fastapi import APIRouter, HTTPException, status

from schemas.contact import ContactRequest
from services.email_service import send_contact_email


router = APIRouter()


@router.post("/send", status_code=status.HTTP_202_ACCEPTED)
async def send_contact_message(payload: ContactRequest) -> dict:
    """Send contact form submission to the configured email."""
    try:
        send_contact_email(payload)
    except ValueError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - safety net for SMTP issues
        raise HTTPException(status_code=500, detail="Unable to send message.") from exc

    return {"success": True}

