import { useState, useEffect } from 'react'
import { verifyEIN, getSubmissions } from '../api/giveguard.js'
import MetricCards from '../components/MetricCards.jsx'
import EINSubmitBar from '../components/EINSubmitBar.jsx'
import SubmissionTable from '../components/SubmissionTable.jsx'
import DetailPanel from '../components/DetailPanel.jsx'
import Sidebar from '../components/Sidebar.jsx'

const FILTERS = {
  dashboard: null,
  verified:  'verified',
  flagged:   'flagged',
  blocked:   'blocked',
}

export default function Dashboard() {
  const [submissions, setSubmissions] = useState([])
  const [error, setError]             = useState(null)
  const [loading, setLoading]         = useState(false)
  const [selected, setSelected]       = useState(null)
  const [activePage, setActivePage]   = useState('dashboard')

  const filter = FILTERS[activePage]
  const visible = filter
    ? submissions.filter(s => s.verdict === filter)
    : submissions

  useEffect(() => {
    getSubmissions()
      .then(data => setSubmissions(data.submissions))
      .catch(() => setError('Could not load submissions'))
  }, [])

  async function handleSubmit(ein) {
    setLoading(true)
    setError(null)
    try {
      const result = await verifyEIN(ein, '')
      setSubmissions(prev => [result, ...prev])
    } catch (err) {
      setError('Verification failed — check the EIN and try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-1">
        <i className="fa-solid fa-shield text-green-400 text-2xl"></i>
        <h1 className="text-2xl font-bold text-white">GiveGuard</h1>
      </div>
      <p className="text-gray-400 text-sm mb-8">Nonprofit Fraud Defense</p>

      <MetricCards submissions={submissions} />
      <EINSubmitBar onSubmit={handleSubmit} loading={loading} />

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg border border-red-500/30 text-red-400 text-sm" style={{ backgroundColor: '#1a0a0a' }}>
          {error}
        </div>
      )}

      {/* Mobile tab bar sits above table */}
      <div className="md:hidden">
        <Sidebar active={activePage} onChange={page => { setActivePage(page); setSelected(null) }} />
      </div>

      <div className="flex gap-5 items-start">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar active={activePage} onChange={page => { setActivePage(page); setSelected(null) }} />
        </div>

        <div className="flex-1 min-w-0">
          <SubmissionTable submissions={visible} onSelect={setSelected} />
        </div>

        <DetailPanel submission={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  )
}