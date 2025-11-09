from pydantic import BaseModel

class RecommendationResponse(BaseModel):
    job_id: int
    candidate_id: int
    similarity_score: float

    class Config:
        from_attributes = True
        