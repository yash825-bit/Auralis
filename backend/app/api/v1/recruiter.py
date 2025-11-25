from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, cast

from core.security import decode_token
from crud.user import create_user, get_user_by_email, get_user
from crud.job import create_job, get_jobs, get_job
from crud.application import get_applications_by_job
from api.dependencies import get_db_session
from schemas.user import UserCreate
from schemas.job import JobCreate, JobResponse
from schemas.application import ApplicationResponse
from models.job import Job
from models.application import Application


router = APIRouter()


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: Session = get_db_session()) -> None :
    """Register a new recruiter user."""
    existing = get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    create_user(db, user, role="recruiter")


@router.post("/jobs", status_code=status.HTTP_201_CREATED, response_model=JobResponse)
async def create_job_post(job: JobCreate, token: str, db: Session = get_db_session()) -> Job:
    """Create a new job posting."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "recruiter":
        raise HTTPException(status_code=403, detail="Access denied: only recruiters can create jobs")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_job = create_job(db, cast(int, user_id), job)
    return db_job


@router.get("/my_jobs", response_model=List[JobResponse])
async def get_my_jobs(token: str, skip: int = 0, limit: int = 100, db: Session = get_db_session()) -> List[Job]:
    """Get all jobs posted by the current recruiter."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "recruiter":
        raise HTTPException(status_code=403, detail="Access denied: only recruiters can view their jobs")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    jobs = db.query(Job).filter(Job.recruiter_id == user_id).offset(skip).limit(limit).all()
    return jobs


@router.get("/jobs/{job_id}/applications", response_model=List[ApplicationResponse])
async def get_job_applications(job_id: int, token: str, db: Session = get_db_session()) -> List[Application]:
    """Get all applications for a specific job (only recruiter who posted it)."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "recruiter":
        raise HTTPException(status_code=403, detail="Access denied: only recruiters can view applications")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    job = get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.recruiter_id != int(user_id):
        raise HTTPException(status_code=403, detail="Access denied: you can only view applications for your own jobs")

    applications = get_applications_by_job(db, job_id)
    return applications
