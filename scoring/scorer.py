import json
import os
from datetime import datetime, timezone
from typing import Any

import httpx

from scoring.irs_client import fetch_propublica_organization, looks_like_ein, normalize_ein


GEMINI_MODEL = "gemini-2.0-flash"
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"


def _build_irs_lookup(org: dict[str, Any] | None) -> dict[str, Any]:
	if not org:
		return {
			"ein_exists": False,
			"active_status": "Not found",
			"filing_990": False,
			"ntee_code": None,
			"ruling_date": None,
			"state": None,
		}

	filing_candidates = [
		org.get("filings_with_data"),
		org.get("filings_without_data"),
		org.get("tax_filings"),
	]
	filing_990 = any(isinstance(v, list) and len(v) > 0 for v in filing_candidates)
	active_status = (
		org.get("status")
		or org.get("organization_status")
		or org.get("foundation_status")
		or "Unknown"
	)

	return {
		"ein_exists": True,
		"active_status": str(active_status),
		"filing_990": filing_990,
		"ntee_code": org.get("ntee_code"),
		"ruling_date": org.get("ruling_date"),
		"state": org.get("state"),
	}


def _parse_ruling_date(ruling_date: str | None) -> datetime | None:
	if not ruling_date:
		return None
	for fmt in ("%Y-%m-%d", "%Y%m%d", "%Y-%m", "%Y"):
		try:
			parsed = datetime.strptime(ruling_date, fmt)
			return parsed.replace(tzinfo=timezone.utc)
		except ValueError:
			continue
	return None


def _is_recent_org(ruling_date: str | None, days: int = 30) -> bool:
	parsed = _parse_ruling_date(ruling_date)
	if not parsed:
		return False
	delta = datetime.now(timezone.utc) - parsed
	return delta.days < days


def _ntee_mismatch(org_name: str, ntee_code: str | None) -> bool:
	if not ntee_code:
		return True
	prefix = ntee_code[:1].upper()
	name = (org_name or "").lower()

	keyword_expected = {
		"food": {"K"},
		"scholarship": {"B"},
		"education": {"B"},
		"art": {"A"},
		"health": {"E", "F", "G", "H"},
		"veteran": {"W"},
		"military": {"W"},
	}

	for keyword, allowed in keyword_expected.items():
		if keyword in name:
			return prefix not in allowed

	return prefix in {"T", "X", "Y"}


def _is_high_risk_state(state: str | None) -> bool:
	if not state:
		return False
	return state.strip().upper() in {"DE", "NV", "WY"}


def _verdict_from_signals(trust_score: int, signal_count: int) -> str:
	# Important guardrail: a single signal cannot directly block an organization.
	if signal_count >= 2 and trust_score < 40:
		return "blocked"
	if trust_score >= 75 and signal_count == 0:
		return "verified"
	return "flagged"


def _build_explanation(payload: dict[str, Any]) -> str:
	gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
	if gemini_key:
		prompt_payload = {
			"task": (
				"Write a concise plain-English fraud risk explanation for a fintech dashboard. "
				"Reference the strongest signals and end with a recommendation."
			),
			"organization": payload.get("org_name"),
			"ein": payload.get("ein"),
			"trust_score": payload.get("trust_score"),
			"verdict": payload.get("verdict"),
			"signals": payload.get("signals"),
			"irs_lookup": payload.get("irs_lookup"),
		}

		body = {
			"contents": [
				{
					"parts": [
						{"text": json.dumps(prompt_payload)}
					]
				}
			],
			"generationConfig": {
				"maxOutputTokens": 300,
				"temperature": 0.3,
			},
		}

		url = GEMINI_URL.format(model=GEMINI_MODEL)
		try:
			resp = httpx.post(url, params={"key": gemini_key}, json=body, timeout=20.0)
			if resp.status_code >= 400:
				provider_msg = ""
				try:
					err_json = resp.json()
					provider_msg = ((err_json.get("error") or {}).get("message") or "").strip()
				except Exception:
					provider_msg = ""
				if provider_msg:
					return (
						"AI explanation unavailable (Gemini error: "
						f"{provider_msg}). Trust score: {payload['trust_score']}/100."
					)
				return (
					"AI explanation unavailable (Gemini request failed). "
					f"Trust score: {payload['trust_score']}/100."
				)

			data = resp.json()
			candidates = data.get("candidates") or []
			if candidates:
				parts = ((candidates[0].get("content") or {}).get("parts") or [])
				text = " ".join(part.get("text", "").strip() for part in parts if isinstance(part, dict)).strip()
				if text:
					return text
		except Exception:
			pass

	if not payload.get("signals"):
		return (
			"IRS validation found no active fraud signals. "
			f"Trust score: {payload['trust_score']}/100."
		)

	flag_text = ", ".join(signal["flag"] for signal in payload["signals"][:4])
	return (
		f"IRS-based scoring flagged: {flag_text}. "
		f"Trust score: {payload['trust_score']}/100. "
		"AI narrative analysis is planned as a future enhancement."
	)


def score_submission(ein: str, org_name: str) -> dict[str, Any]:
	signals: list[dict[str, Any]] = []
	cleaned_ein = (ein or "").strip()
	is_ein_input = looks_like_ein(cleaned_ein)

	irs_org: dict[str, Any] | None = None
	if is_ein_input:
		irs_org = fetch_propublica_organization(cleaned_ein)
		if irs_org is None:
			signals.append(
				{
					"flag": "EIN not found in ProPublica nonprofit records",
					"risk_points": 30,
				}
			)
	else:
		signals.append(
			{
				"flag": "Input is not a valid EIN format",
				"risk_points": 15,
			}
		)

	irs_lookup = _build_irs_lookup(irs_org)
	if irs_lookup["ein_exists"]:
		if _is_recent_org(irs_lookup["ruling_date"], days=30):
			signals.append({"flag": "Registered less than 30 days ago", "risk_points": 40})
		if not irs_lookup["filing_990"]:
			signals.append({"flag": "No IRS 990 filing on record", "risk_points": 30})
		if _ntee_mismatch(org_name, irs_lookup["ntee_code"]):
			signals.append({"flag": "NTEE category mismatch", "risk_points": 20})
		if _is_high_risk_state(irs_lookup.get("state")):
			signals.append({"flag": "High-risk state of incorporation", "risk_points": 10})

	lookup_name = (org_name or "").strip() or (irs_org or {}).get("name") or cleaned_ein

	total_risk = sum(signal["risk_points"] for signal in signals)
	trust_score = max(0, 100 - total_risk)
	verdict = _verdict_from_signals(trust_score, len(signals))

	payload = {
		"ein": normalize_ein(cleaned_ein) if is_ein_input else cleaned_ein,
		"org_name": lookup_name,
		"trust_score": trust_score,
		"verdict": verdict,
		"signals": signals,
		"top_flag": signals[0]["flag"] if signals else None,
		"irs_lookup": irs_lookup,
	}
	payload["ai_explanation"] = _build_explanation(payload)
	return payload
