from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import DeclarativeBase

from core.config import settings

engine: Engine = create_engine(settings.DATABASE_URL)

class Base(DeclarativeBase):
    pass
