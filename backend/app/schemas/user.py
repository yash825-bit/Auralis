from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    name: str
    password: str


class UserLogin(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    name: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
