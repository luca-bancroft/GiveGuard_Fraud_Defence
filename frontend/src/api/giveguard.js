const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export async function verifyEIN(ein, orgName) {
  const res = await fetch(`${BASE_URL}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ein, org_name: orgName }),
  })
  if (!res.ok) throw new Error('Verification failed')
  return res.json()
}

export async function getSubmissions() {
  const res = await fetch(`${BASE_URL}/submissions`)
  if (!res.ok) throw new Error('Failed to fetch submissions')
  return res.json()
}