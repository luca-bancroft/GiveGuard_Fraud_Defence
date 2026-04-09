import re
from typing import Any

import httpx


PROPUBLICA_URL = "https://projects.propublica.org/nonprofits/api/v2/organizations/{ein}.json"
EIN_PATTERN = re.compile(r"^\d{2}-?\d{7}$")


def normalize_ein(value: str) -> str:
	return re.sub(r"\D", "", value or "")


def looks_like_ein(value: str) -> bool:
	if not value:
		return False
	return bool(EIN_PATTERN.match(value.strip()))


def fetch_propublica_organization(ein: str) -> dict[str, Any] | None:
	normalized = normalize_ein(ein)
	if len(normalized) != 9:
		return None

	url = PROPUBLICA_URL.format(ein=normalized)
	try:
		resp = httpx.get(url, timeout=12.0)
		if resp.status_code == 404:
			return None
		resp.raise_for_status()
		payload = resp.json()
		org = payload.get("organization")
		if not isinstance(org, dict):
			return None
		return org
	except Exception:
		return None
