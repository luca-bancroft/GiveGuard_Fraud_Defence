import VerdictBadge from './VerdictBadge.jsx'

export default function SubmissionTable({ submissions, onSelect }) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10" style={{ backgroundColor: '#0f172a' }}>
            <th className="text-left text-gray-400 font-medium px-5 py-3">EIN</th>
            <th className="text-left text-gray-400 font-medium px-5 py-3">Organization</th>
            <th className="text-left text-gray-400 font-medium px-5 py-3">Trust Score</th>
            <th className="text-left text-gray-400 font-medium px-5 py-3">Verdict</th>
            <th className="text-left text-gray-400 font-medium px-5 py-3">Top Flag</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s, i) => (
            <tr
              key={i}
              onClick={() => onSelect(s)}
              className="border-b border-white/5 transition-colors cursor-pointer hover:bg-white/5"
            >
              <td className="px-5 py-4 text-gray-400 font-mono text-xs">{s.ein}</td>
              <td className="px-5 py-4 text-white">{s.org_name}</td>
              <td className="px-5 py-4">
                <span className={`font-bold ${
                  s.trust_score >= 75 ? 'text-green-400' :
                  s.trust_score >= 40 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {s.trust_score}
                </span>
              </td>
              <td className="px-5 py-4">
                <VerdictBadge verdict={s.verdict} />
              </td>
              <td className="px-5 py-4 text-gray-400 text-xs">
                {s.top_flag ?? <span className="text-gray-600">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}