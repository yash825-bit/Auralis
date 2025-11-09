from sqlalchemy import (
    Column, Integer, DateTime, ForeignKey, Float
)
from sqlalchemy.orm import relationship, mapped_column, Mapped
from sqlalchemy.sql import func

from database.base import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"))
    candidate_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    similarity_score: Mapped[float] = mapped_column(Float, nullable=False)
    computed_at = Column(DateTime(timezone=True), server_default=func.now())

    job = relationship("Job", back_populates="recommendations")
