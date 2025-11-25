from fastapi import APIRouter, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
from datetime import datetime, timezone
from os import makedirs, path, remove
import aiofiles
from sqlalchemy.orm import Session
from typing import List, cast, Optional

from core.security import decode_token
from crud.user import create_user, get_user, get_user_by_email
from crud.resume import create_resume, get_resume_by_user_id
from crud.job import get_jobs, get_job
from crud.application import apply_for_job, get_applications_by_candidate
from api.dependencies import get_db_session
from schemas.user import UserCreate
from schemas.job import JobResponse
from schemas.application import ApplicationResponse
from models.resume import Resume
from models.job import Job
from models.application import Application


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


@router.post("/upload_resume", status_code=status.HTTP_201_CREATED)
async def upload_resume(token: str, file: UploadFile = File(...), db: Session = get_db_session()) -> FileResponse:
    """Upload or replace a candidate's resume and return the uploaded file."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "candidate":
        raise HTTPException(status_code=403, detail="Access denied: only candidates can upload there resumes")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="File not provided")

    if not file.filename.lower().endswith((".pdf", ".doc", ".docx")):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF/DOC/DOCX allowed.")

    old_resume = db.query(Resume).filter(Resume.user_id == user_id).first()
    if old_resume:
        try:
            if path.exists(str(old_resume.storage_path)):
                remove(str(old_resume.storage_path))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting old resume: {e}")
        db.delete(old_resume)
        db.commit()

    filename = f"{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}_{file.filename}"
    storage_path = path.join(UPLOAD_DIR, filename)

    async with aiofiles.open(storage_path, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            await buffer.write(chunk)

    create_resume(
        db=db,
        user_id=user_id,
        filename=file.filename,
        storage_path=storage_path,
    )

    return FileResponse(
        path=storage_path,
        filename=file.filename,
        media_type=file.content_type
    )


@router.get("/my_resume")
async def my_resume(token: str, db: Session = get_db_session()) -> FileResponse:
    """Return the candidate's uploaded resume file."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "candidate":
        raise HTTPException(status_code=403, detail="Access denied: only candidates can view there resumes")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    resume = db.query(Resume).filter(Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found for this user")

    if not path.exists(str(resume.storage_path)):
        raise HTTPException(status_code=404, detail="Resume file missing on server")

    return FileResponse(
        path=str(resume.storage_path),
        filename=str(resume.filename),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={resume.filename}"}
    )


@router.delete("/delete_my_resume", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_resume(token: str, db: Session = get_db_session()) -> None:
    """Delete the candidate's uploaded resume (file + database record)."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "candidate":
        raise HTTPException(status_code=403, detail="Access denied: only candidates can delete there resumes")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    resume = db.query(Resume).filter(Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found for this user")

    try:
        if path.exists(str(resume.storage_path)):
            remove(str(resume.storage_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting file: {e}")

    db.delete(resume)
    db.commit()


@router.get("/jobs", response_model=List[JobResponse])
async def get_all_jobs(token: str, skip: int = 0, limit: int = 100, db: Session = get_db_session()) -> List[Job]:
    """Get all available job postings."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "candidate":
        raise HTTPException(status_code=403, detail="Access denied: only candidates can view jobs")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    jobs = get_jobs(db, skip=skip, limit=limit)
    return jobs


@router.get("/my_applications", response_model=List[ApplicationResponse])
async def get_my_applications(token: str, db: Session = get_db_session()) -> List[Application]:
    """Get all applications submitted by the current candidate."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "candidate":
        raise HTTPException(status_code=403, detail="Access denied: only candidates can view their applications")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    applications = get_applications_by_candidate(db, cast(int, user_id))
    return applications


@router.post("/jobs/{job_id}/apply", status_code=status.HTTP_201_CREATED, response_model=ApplicationResponse)
async def apply_to_job(job_id: int, token: str, cover_letter: Optional[str] = None, db: Session = get_db_session()) -> Application:
    """Apply for a job posting."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "candidate":
        raise HTTPException(status_code=403, detail="Access denied: only candidates can apply for jobs")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    job = get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    resume = get_resume_by_user_id(db, cast(int, user_id))
    if not resume:
        raise HTTPException(status_code=400, detail="Please upload a resume before applying")

    # Check if already applied
    existing_app = db.query(Application).filter(
        Application.candidate_id == user_id,
        Application.job_id == job_id
    ).first()
    
    if existing_app:
        raise HTTPException(status_code=400, detail="You have already applied for this job")

    application = apply_for_job(
        db=db,
        candidate_id=cast(int, user_id),
        job_id=job_id,
        resume_id=resume.id,
        cover_letter=[cover_letter] if cover_letter else None
    )

    return application
