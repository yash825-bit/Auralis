from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timezone

from core.config import settings
from core.security import verify_password, create_access_token, decode_token

from crud.user import get_user_by_email, get_user, get_users
from crud.token import create_refresh_token, revoke_tokens_for_user
from crud.job import get_jobs

from api.dependencies import get_db_session

from schemas.user import UserLogin, UserResponse
from schemas.job import JobResponse


router = APIRouter()

@router.post('/login')
def login(user: UserLogin=UserLogin(email=settings.ADMIN["email"], password=settings.ADMIN["password"]), db=get_db_session()):
    """Authenticate user and return JWT access + refresh token."""

    existing = get_user_by_email(db, user.email)

    if not existing:
        raise HTTPException(status_code=404, detail='User not found')

    if not verify_password(user.password, str(existing.password_hash)):
        raise HTTPException(status_code=401, detail='Wrong password')
    
    if existing.role != 'admin':
        raise HTTPException(status_code=403, detail='User role mismatch')
    
    activate_user(db, existing.id)
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
    
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    
    if user.role != 'admin':
        raise HTTPException(status_code=403, detail='User role mismatch')

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
    
    if user.role != 'admin':
        raise HTTPException(status_code=403, detail='User role mismatch')

    return user


@router.get('/users', response_model=list[UserResponse])
def list_users(token: str, skip: int = 0, limit: int = 100, db=get_db_session()):
    """List users with pagination."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail='Invalid token')
    
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    user_role = payload.get("role")
    if user_role != "admin":
        raise HTTPException(status_code=403, detail='Not authorized to access this resource')

    users = get_users(db, skip=skip, limit=limit)
    return users


@router.get('/jobs', response_model=list[JobResponse])
def list_jobs(token: str, skip: int = 0, limit: int = 100, db=get_db_session()):
    """List jobs with pagination."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail='Invalid token')
    
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    user_role = payload.get("role")
    if user_role != "admin":
        raise HTTPException(status_code=403, detail='Not authorized to access this resource')

    jobs = get_jobs(db, skip=skip, limit=limit)
    return jobs


@router.delete('/logout', status_code=status.HTTP_204_NO_CONTENT)
def logout(token: str, db=get_db_session()):
    """Log out user and revoke tokens."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail='Invalid token')
    
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    
    if user.role != 'admin':
        raise HTTPException(status_code=403, detail='User role mismatch')

    revoke_tokens_for_user(db, user_id)
