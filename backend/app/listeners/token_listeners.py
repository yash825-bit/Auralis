from datetime import datetime, timezone
from sqlalchemy import event, update
from sqlalchemy.orm import Session

from database.session import get_sync_session
from models.token import Token
from models.user import User


def delete_expired_tokens() -> None:
    """Delete expired tokens every 30 minutes."""
    with get_sync_session() as db:
        db.query(Token).filter(Token.expires_at < datetime.now(timezone.utc)).delete(synchronize_session=False)
        db.commit()

@event.listens_for(Token, "before_insert")
def ensure_single_token(mapper, connection, target: Token):
    """Ensure each user has only one active token — delete old one if exists."""
    session = Session.object_session(target)
    if session:
        session.query(Token).filter(Token.user_id == target.user_id).delete(synchronize_session=False)
