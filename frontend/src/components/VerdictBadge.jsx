export default function VerdictBadge({ verdict }) {
  const styles = {
    verified: 'bg-green-500/20 text-green-400 border border-green-500/30',
    flagged:  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    blocked:  'bg-red-500/20 text-red-400 border border-red-500/30',
  }

  const labels = {
    verified: '✓ VERIFIED',
    flagged:  '⚠ FLAGGED',
    blocked:  '⛔ BLOCKED',
  }

  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles[verdict]}`}>
      {labels[verdict]}
    </span>
  )
}