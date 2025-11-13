from fastapi import APIRouter, HTTPException, status, UploadFile, File
from datetime import datetime, timezone
from os import makedirs, path
import aiofiles
from sqlalchemy.orm import Session

from core.security import decode_token
from crud.user import create_user, get_user, get_user_by_email
from crud.resume import create_resume
from api.dependencies import get_db_session
from schemas.user import UserCreate
from schemas.resume import ResumeResponse
from models.resume import Resume


router = APIRouter()

UPLOAD_DIR = "../uploads/resumes"
makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: Session = get_db_session()) -> None :
    """Register a new candidate user."""
    existing = get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    create_user(db, user, role="candidate")


@router.post("/upload_resume", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(token: str, file: UploadFile = File(...), db: Session = get_db_session()) -> Resume:
    """Upload a resume file asynchronously (non-blocking I/O)."""
    payload = decode_token(token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="File Not Exist")

    if not file.filename.lower().endswith((".pdf", ".doc", ".docx")):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF/DOC/DOCX allowed.")

    filename = f"{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}_{file.filename}"
    storage_path = path.join(UPLOAD_DIR, filename)

    async with aiofiles.open(storage_path, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            await buffer.write(chunk)

    return create_resume(
        db=db,
        user_id=user_id,
        filename=file.filename,
        storage_path=storage_path,
        parsed_skills=None,
    )
