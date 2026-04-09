from fastapi import APIRouter
from models.schemas import OrgSubmission, VerifyResponse
from pathlib import Path
import sys

ROOT_DIR = Path(__file__).resolve().parents[2]
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

from scoring.scorer import score_submission

router = APIRouter()

submissions = []

@router.post("/verify", response_model=VerifyResponse)
def verify(submission: OrgSubmission):
    result = score_submission(submission.ein, submission.org_name)
    submissions.append(result)
    return result

@router.get("/submissions")
def get_submissions():
    return {"submissions": submissions}