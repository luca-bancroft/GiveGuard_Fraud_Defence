from fastapi import APIRouter
from models.schemas import OrgSubmission, VerifyResponse
from typing import List

router = APIRouter()

submissions = []

@router.post("/verify", response_model=VerifyResponse)
def verify(submission: OrgSubmission):
    mock_result = {
        # - Mock response
        "ein": submission.ein,
        "org_name": submission.org_name,
        "trust_score": 8,
        "verdict": "blocked",
        "signals": [
            {"flag": "Registered less than 30 days ago", "risk_points": 40},
            {"flag": "No IRS 990 filing on record", "risk_points": 30},
            {"flag": "NTEE category mismatch", "risk_points": 20},
            {"flag": "High-risk state of incorporation", "risk_points": 10}
        ],
        "irs_lookup": {
            "ein_exists": True,
            "active_status": "Pending",
            "filing_990": False,
            "ntee_code": "T99",
            "ruling_date": "2026-03-23"
        }
    }
    submissions.append(mock_result)
    return mock_result

@router.get("/submissions")
def get_submissions():
    return {"submissions": submissions}