import { useState } from 'react'
import MetricCards from '../components/MetricCards.jsx'
import EINSubmitBar from '../components/EINSubmitBar.jsx'
import SubmissionTable from '../components/SubmissionTable.jsx'
import FraudSignalDrawer from '../components/FraudSignalDrawer.jsx'
import VerifiedDrawer from '../components/VerifiedDrawer.jsx'
import FlaggedDrawer from '../components/FlaggedDrawer.jsx'

const MOCK_SUBMISSIONS = [
  {
    ein: '52-1234567', org_name: 'Bulldog Food Pantry', trust_score: 94,
    verdict: 'verified', top_flag: null,
    irs_lookup: { ein_exists: true, active_status: 'Active', filing_990: true, ntee_code: 'K30', ruling_date: '2016-03-15' }
  },
  {
    ein: '47-9876543', org_name: 'Athens Arts Coalition', trust_score: 71,
    verdict: 'flagged', top_flag: 'Mission/category mismatch',
    irs_lookup: { ein_exists: true, active_status: 'Active', filing_990: true, ntee_code: 'A99', ruling_date: '2020-07-01' },
    signals: [
      { flag: 'Mission/category mismatch', risk_points: 20 },
    ]
  },
  {
    ein: '99-8887776', org_name: 'Dawg Nation Relief Fund LLC', trust_score: 8,
    verdict: 'blocked', top_flag: 'Registered less than 30 days ago',
    irs_lookup: { ein_exists: true, active_status: 'Pending', filing_990: false, ntee_code: 'T99', ruling_date: '2026-03-23' },
    signals: [
      { flag: 'Registered less than 30 days ago', risk_points: 40 },
      { flag: 'No IRS 990 filing on record',       risk_points: 30 },
      { flag: 'NTEE category mismatch',            risk_points: 20 },
      { flag: 'High-risk state of incorporation',  risk_points: 10 },
    ]
  },
  {
    ein: '23-4567890', org_name: 'UGA Scholarship Foundation', trust_score: 91,
    verdict: 'verified', top_flag: null,
    irs_lookup: { ein_exists: true, active_status: 'Active', filing_990: true, ntee_code: 'B82', ruling_date: '2012-01-10' }
  },
]

export default function Dashboard() {
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)

  function handleSubmit(ein) {
    setLoading(true)
    setTimeout(() => {
      const mock = {
        ein,
        org_name: 'Test Organization',
        trust_score: Math.floor(Math.random() * 100),
        verdict: ['verified', 'flagged', 'blocked'][Math.floor(Math.random() * 3)],
        top_flag: 'Mock flag for testing',
        irs_lookup: { ein_exists: true, active_status: 'Active', filing_990: true, ntee_code: 'T00', ruling_date: '2022-06-01' },
        signals: [
          { flag: 'Mock signal one', risk_points: 30 },
          { flag: 'Mock signal two', risk_points: 20 },
        ]
      }
      setSubmissions(prev => [mock, ...prev])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-white mb-1">GiveGuard</h1>
      <p className="text-gray-400 text-sm mb-8">Nonprofit Fraud Defense</p>

      <MetricCards submissions={submissions} />
      <EINSubmitBar onSubmit={handleSubmit} loading={loading} />
      <SubmissionTable submissions={submissions} onSelect={setSelected} />

      {selected?.verdict === 'verified' && <VerifiedDrawer submission={selected} onClose={() => setSelected(null)} />}
      {selected?.verdict === 'flagged'  && <FlaggedDrawer  submission={selected} onClose={() => setSelected(null)} />}
      {selected?.verdict === 'blocked'  && <FraudSignalDrawer submission={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}