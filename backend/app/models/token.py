from sqlalchemy import (
    Column, Integer, DateTime, ForeignKey, String
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database.base import Base

class Token(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    refresh_token_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))

    user = relationship("User", back_populates="tokens")
