from pydantic import BaseModel
from typing import Optional

class OrgSubmission(BaseModel):
    ein: str
    org_name: str
    
class Signal(BaseModel):
    flag: str
    risk_points: int

class IRSLookup(BaseModel):
    ein_exists: bool
    active_status: str
    filing_990: bool
    ntee_code: Optional[str] = None
    ruling_date: Optional[str] = None
    state: Optional[str] = None

class VerifyResponse(BaseModel):
    ein: str
    org_name: str
    trust_score: int
    verdict: str
    signals: list[Signal]
    top_flag: Optional[str] = None
    irs_lookup: IRSLookup
    ai_explanation: Optional[str] = None
