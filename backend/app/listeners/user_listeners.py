from datetime import datetime, timezone
from datetime import timedelta

from database.session import get_sync_session
from models.user import User


def delete_deactivated_users() -> None:
    """Delete users who have been deactivated for more than 30 days."""
    threshold_date = datetime.now(timezone.utc) - timedelta(days=30)
    with get_sync_session() as db:
        db.query(User).filter(
            User.is_active == False,
            User.updated_at < threshold_date
        ).delete(synchronize_session=False)
        db.commit()
