export default function VerifiedDrawer({ submission, onClose }) {
  if (!submission) return null

  const irs = submission.irs_lookup

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="rounded-xl border border-green-500/30 p-6 w-full max-w-lg"
        style={{ backgroundColor: '#0f172a' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-green-400 text-xs font-semibold mb-1">✓ VERIFIED</p>
            <h2 className="text-white font-bold text-lg">{submission.org_name}</h2>
            <p className="text-gray-500 text-xs font-mono mt-1">EIN {submission.ein}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6 p-3 rounded-lg" style={{ backgroundColor: '#1e293b' }}>
          <span className="text-green-400 font-bold text-3xl">{submission.trust_score}</span>
          <div>
            <p className="text-white text-sm font-medium">Trust Score</p>
            <p className="text-gray-500 text-xs">out of 100</p>
          </div>
        </div>

        {irs && (
          <>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
              IRS Lookup
            </p>
            <div className="rounded-lg border border-white/5 overflow-hidden mb-6" style={{ backgroundColor: '#1e293b' }}>
              {[
                { label: 'EIN Exists',     value: irs.ein_exists ? 'Yes' : 'No' },
                { label: 'Active Status',  value: irs.active_status },
                { label: '990 Filing',     value: irs.filing_990 ? 'On record' : 'Not found' },
                { label: 'NTEE Code',      value: irs.ntee_code },
                { label: 'Ruling Date',    value: irs.ruling_date },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center px-4 py-3 border-b border-white/5 last:border-0"
                >
                  <span className="text-gray-400 text-sm">{row.label}</span>
                  <span className="text-white text-sm font-medium">{row.value ?? '—'}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {submission.signals && submission.signals.length > 0 && (
          <>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Minor Signals
            </p>
            <div className="space-y-2">
              {submission.signals.map((s, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 rounded-lg border border-white/5"
                  style={{ backgroundColor: '#1e293b' }}
                >
                  <span className="text-gray-300 text-sm">{s.flag}</span>
                  <span className="text-green-400 text-xs font-bold ml-4 shrink-0">
                    +{s.risk_points} risk
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {!submission.signals?.length && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-green-500/20" style={{ backgroundColor: '#0d2818' }}>
            <span className="text-green-400 text-sm">✓</span>
            <span className="text-green-300 text-sm">No fraud signals raised</span>
          </div>
        )}
      </div>
    </div>
  )
}