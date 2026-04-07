export default function FraudSignalDrawer({ submission, onClose }) {
  if (!submission) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="rounded-xl border border-red-500/30 p-6 w-full max-w-lg"
        style={{ backgroundColor: '#0f172a' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-red-400 text-xs font-semibold mb-1">⛔ BLOCKED</p>
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
          <span className="text-red-400 font-bold text-3xl">{submission.trust_score}</span>
          <div>
            <p className="text-white text-sm font-medium">Trust Score</p>
            <p className="text-gray-500 text-xs">out of 100</p>
          </div>
        </div>

        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Fraud Signals Raised
        </p>

        <div className="space-y-2">
          {submission.signals ? (
            submission.signals.map((s, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 rounded-lg border border-white/5"
                style={{ backgroundColor: '#1e293b' }}
              >
                <span className="text-gray-300 text-sm">{s.flag}</span>
                <span className="text-red-400 text-xs font-bold ml-4 shrink-0">
                  +{s.risk_points} risk
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No signal breakdown available.</p>
          )}
        </div>
      </div>
    </div>
  )
}