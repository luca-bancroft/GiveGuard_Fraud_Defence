export default function DetailPanel({ submission, onClose }) {
  const borderColor = {
    verified: '#1bc5a4',
    flagged:  '#d97706',
    blocked:  '#ef4444',
  }[submission?.verdict] ?? '#6b7280'

  const scoreColor = {
    verified: '#1bc5a4',
    flagged:  '#d97706',
    blocked:  '#ef4444',
  }[submission?.verdict] ?? '#6b7280'

  const verdictLabel = {
    verified: '✓ VERIFIED',
    flagged:  '⚠ FLAGGED',
    blocked:  '⛔ BLOCKED',
  }[submission?.verdict]

  if (!submission) return (
    <div
      className="hidden md:flex w-80 shrink-0 rounded-xl border border-gray-200 p-6 h-fit items-center justify-center"
      style={{ backgroundColor: '#ffffff' }}
    >
      <p className="text-gray-400 text-sm text-center">
        Click any row to see details
      </p>
    </div>
  )

  const irs = submission.irs_lookup

  const content = (
    <div className="p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: borderColor }}>
            {verdictLabel}
          </p>
          <h2 className="text-gray-800 font-bold text-base leading-tight">{submission.org_name}</h2>
          <p className="text-gray-400 text-xs font-mono mt-1">EIN {submission.ein}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 transition-colors text-xl leading-none ml-2"
        >
          ×
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5 p-3 rounded-lg" style={{ backgroundColor: '#f8fafb' }}>
        <span className="font-bold text-3xl" style={{ color: scoreColor }}>{submission.trust_score}</span>
        <div>
          <p className="text-gray-800 text-sm font-medium">Trust Score</p>
          <p className="text-gray-400 text-xs">out of 100</p>
        </div>
      </div>

      {irs && (
        <>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
            IRS Lookup
          </p>
          <div className="rounded-lg border border-gray-200 overflow-hidden mb-5" style={{ backgroundColor: '#f8fafb' }}>
            {[
              { label: 'EIN Exists',  value: irs.ein_exists ? 'Yes' : 'No' },
              { label: 'Status',      value: irs.active_status },
              { label: '990 Filing',  value: irs.filing_990 ? 'On record' : 'Not found' },
              { label: 'NTEE Code',   value: irs.ntee_code },
              { label: 'Ruling Date', value: irs.ruling_date },
            ].map((row, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-3 py-2 border-b border-gray-200 last:border-0"
              >
                <span className="text-gray-500 text-xs">{row.label}</span>
                <span className="text-gray-800 text-xs font-medium">{row.value ?? '—'}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {submission.signals && submission.signals.length > 0 && (
        <>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Fraud Signals
          </p>
          <div className="space-y-2">
            {submission.signals.map((s, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 rounded-lg border border-gray-200"
                style={{ backgroundColor: '#f8fafb' }}
              >
                <span className="text-gray-600 text-xs">{s.flag}</span>
                <span className="text-xs font-bold ml-3 shrink-0" style={{ color: borderColor }}>
                  +{s.risk_points}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {submission.ai_explanation && (
        <>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-5 mb-2">
            AI Explanation
          </p>
          <div
            className="p-3 rounded-lg border border-gray-200 text-xs text-gray-600 leading-relaxed"
            style={{ backgroundColor: '#f8fafb' }}
          >
            {submission.ai_explanation}
          </div>
        </>
      )}

      {!submission.signals?.length && (
        <div
          className="flex items-center gap-2 p-3 rounded-lg border"
          style={{
            backgroundColor: submission.verdict === 'verified' ? '#e6faf7' : '#fffbeb',
            borderColor: submission.verdict === 'verified' ? '#9de8d8' : '#fcd34d',
          }}
        >
          <span className="text-sm" style={{ color: borderColor }}>
            {submission.verdict === 'verified' ? '✓' : '⚠'}
          </span>
          <span className="text-xs" style={{ color: borderColor }}>
            {submission.verdict === 'verified'
              ? 'No fraud signals raised'
              : 'Flagged for manual review'}
          </span>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <div
        className="hidden md:block w-80 shrink-0 rounded-xl border border-gray-200 h-fit"
        style={{ backgroundColor: '#ffffff', borderLeft: `3px solid ${borderColor}` }}
      >
        {content}
      </div>

      {/* Mobile */}
      <div
        className="fixed inset-0 z-50 flex flex-col md:hidden overflow-y-auto"
        style={{ backgroundColor: '#f8fafb' }}
      >
        {content}
      </div>
    </>
  )
}