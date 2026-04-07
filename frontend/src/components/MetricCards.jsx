export default function MetricCards({ submissions }) {
  const total = submissions.length
  const verified = submissions.filter(s => s.verdict === 'verified').length
  const flagged = submissions.filter(s => s.verdict === 'flagged').length
  const blocked = submissions.filter(s => s.verdict === 'blocked').length
  const passRate = total > 0 ? Math.round((verified / total) * 100) : 0

  const cards = [
    { label: 'Total Submissions', value: total, sub: 'this session', color: 'text-white' },
    { label: 'Verified', value: verified, sub: `${passRate}% pass rate`, color: 'text-green-400' },
    { label: 'Flagged', value: flagged, sub: 'review needed', color: 'text-yellow-400' },
    { label: 'Blocked', value: blocked, sub: 'fake detected', color: 'text-red-400' },
  ]

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {cards.map(card => (
        <div key={card.label} className="rounded-xl p-5 border border-white/10" style={{backgroundColor: '#0f172a'}}>
          <p className="text-gray-400 text-xs mb-2">{card.label}</p>
          <p className={`text-3xl font-bold mb-1 ${card.color}`}>{card.value}</p>
          <p className="text-gray-500 text-xs">{card.sub}</p>
        </div>
      ))}
    </div>
  )
}