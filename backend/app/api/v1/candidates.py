from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timezone

from core.security import verify_password, create_access_token, decode_token

from crud.user import create_user, get_user_by_email, get_user
from crud.token import create_refresh_token, revoke_tokens_for_user

from api.dependencies import get_db_session

from schemas.user import UserCreate, UserLogin, UserResponse


router = APIRouter()

@router.post('/signup', response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate=UserCreate(name="User1", email="user1@gmail.com", password="user1"), db=get_db_session()):
    """Register a new candidate user."""

    existing = get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail='Email already registered')
    return create_user(db, user, role='candidate')


@router.post('/login')
def login(user: UserLogin=UserLogin(email="user1@gmail.com", password="user1"), db=get_db_session()):
    """Authenticate user and return JWT access + refresh token."""

    existing = get_user_by_email(db, user.email)
    if not existing or not verify_password(user.password, str(existing.password_hash)):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    
    access_token = create_access_token(
        data={
            "sub": str(existing.id),
            "email": existing.email,
            "role": existing.role,
            "iat": datetime.now(timezone.utc),
        }
    )

    refresh_entry = create_refresh_token(
        db,
        user_id=int(existing.id),
        refresh_token_hash=access_token,
    )

    return {"token": refresh_entry.refresh_token_hash}

@router.post('/refresh')
def refresh_token(token: str, db=get_db_session()):
    """Refresh JWT access token using refresh token."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail='Invalid token')

    new_access_token = create_access_token(
        data={
            "sub": str(user_id),
            "email": payload.get("email"),
            "role": payload.get("role"),
            "iat": datetime.now(timezone.utc),
        }
    )

    refresh_entry = create_refresh_token(
        db,
        user_id=int(user_id),
        refresh_token_hash=new_access_token,
    )

    return {"token": refresh_entry.refresh_token_hash}

@router.get('/me', response_model=UserResponse)
def get_current_user(token: str, db=get_db_session()):
    """Get current user information."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail='Invalid token')

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    return user

@router.delete('/logout', status_code=status.HTTP_204_NO_CONTENT)
def logout(token: str, db=get_db_session()):
    """Log out user and revoke tokens."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail='Invalid token')

    revoke_tokens_for_user(db, user_id)
    