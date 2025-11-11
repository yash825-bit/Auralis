from typing import Generator
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager

from database.base import engine

SessionLocal: sessionmaker[Session] = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    db: Session = SessionLocal()

    try:
        yield db
    finally:
        db.close()

@contextmanager
def get_sync_session():
    """Provide a transactional scope for sync operations."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
        