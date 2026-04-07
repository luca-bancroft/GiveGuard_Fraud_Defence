# GiveGuard API Contract

Base URL (local): http://localhost:8000
Base URL (deployed): https://giveguard.onrender.com

---

## POST /verify

Submit a nonprofit EIN for verification.

### Request body
{
  "ein": "99-8887776",
  "org_name": "Dawg Nation Relief Fund LLC"
}

### Response
{
  "ein": "99-8887776",
  "org_name": "Dawg Nation Relief Fund LLC",
  "trust_score": 8,
  "verdict": "blocked",
  "signals": [
    { "flag": "Registered less than 30 days ago", "risk_points": 40 },
    { "flag": "No IRS 990 filing on record",       "risk_points": 30 },
    { "flag": "NTEE category mismatch",            "risk_points": 20 },
    { "flag": "High-risk state of incorporation",  "risk_points": 10 }
  ],
  "irs_lookup": {
    "ein_exists": true,
    "active_status": "Pending",
    "filing_990": false,
    "ntee_code": "T99",
    "ruling_date": "2026-03-23"
  }
}

---

## GET /submissions

Get all past submissions for the dashboard feed.

### Response
{
  "submissions": [
    {
      "ein": "52-1234567",
      "org_name": "Bulldog Food Pantry",
      "trust_score": 94,
      "verdict": "verified",
      "top_flag": null
    },
    {
      "ein": "99-8887776",
      "org_name": "Dawg Nation Relief Fund LLC",
      "trust_score": 8,
      "verdict": "blocked",
      "top_flag": "Registered less than 30 days ago"
    }
  ]
}

---

## Verdict scale

| Verdict    | Trust score range |
|------------|-------------------|
| "verified" | 75 – 100          |
| "flagged"  | 40 – 74           |
| "blocked"  | 0 – 39            |

---

## Who owns what

| Endpoint         | Built by   | Consumed by |
|------------------|------------|-------------|
| POST /verify     | Sri        | Luca        |
| GET /submissions | Sri        | Luca        |
| Scoring logic    | Mushfiq    | Sri         


## Error responses

If the EIN is invalid or the IRS API fails, the backend returns:

{
  "error": "Invalid EIN format"
}

{
  "error": "IRS API unavailable, try again"
}
